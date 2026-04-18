import os
import json
from dotenv import load_dotenv
from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.1
)

class BOEState(TypedDict):
    raw_input:         str
    parsed_intent:     Optional[dict]
    slice_config:      Optional[dict]
    validation_result: Optional[dict]
    error_message:     Optional[str]
    final_output:      Optional[dict]

def intent_parser_node(state: BOEState) -> BOEState:
    print("\n[BOE] Node 1: Parsing enterprise intent...")
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are NexusXLA's enterprise intent parser.
Extract structured business intent from plain English.
Return ONLY valid JSON. No markdown. No explanation. No code blocks.

JSON schema:
{{
  "industry": "manufacturing|logistics|healthcare|smart_city|other",
  "use_case": "brief description",
  "num_devices": <integer>,
  "criticality": "critical|high|medium|low",
  "zero_downtime_required": <true|false>,
  "real_time_control": <true|false>,
  "high_bandwidth_needed": <true|false>,
  "many_low_power_sensors": <true|false>
}}"""),
        ("user", "{input}")
    ])
    try:
        response = (prompt | llm).invoke({"input": state["raw_input"]})
        content = response.content.strip()
        if "```" in content:
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        parsed = json.loads(content.strip())
        print(f"[BOE] Intent: {parsed['industry']} | {parsed['use_case']}")
        return {**state, "parsed_intent": parsed, "error_message": None}
    except Exception as e:
        return {**state, "error_message": f"Intent parsing failed: {str(e)}"}

def slice_configurator_node(state: BOEState) -> BOEState:
    if state.get("error_message"):
        return state
    print("\n[BOE] Node 2: Configuring 5G slice parameters...")
    intent = state["parsed_intent"]
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are NexusXLA's 5G slice configuration engine.
Map enterprise intent to optimal 5G network slice parameters.

SLICE TYPE RULES:
- URLLC: critical, real-time control, zero downtime, robotics, surgery
  latency <= 5ms, reliability >= 99.999%, priority_class 1-2
- eMBB: high bandwidth, video, AR/VR, large data
  latency <= 50ms, throughput >= 100Mbps, priority_class 3-5
- mMTC: many low-power sensors, IoT, smart meters
  latency <= 1000ms, many endpoints, priority_class 6-9

Return ONLY valid JSON. No markdown. No explanation.

{{
  "slice_type": "URLLC|eMBB|mMTC",
  "max_latency_ms": <float>,
  "min_throughput_mbps": <float>,
  "reliability_percent": <float>,
  "num_endpoints": <integer>,
  "priority_class": <integer 1-9>,
  "sla_tier": "platinum|gold|silver|bronze",
  "estimated_monthly_cost_inr": <float>,
  "reasoning": "<one sentence why>"
}}"""),
        ("user", "Enterprise intent: {intent}")
    ])
    try:
        response = (prompt | llm).invoke({"intent": json.dumps(intent, indent=2)})
        content = response.content.strip()
        if "```" in content:
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        config = json.loads(content.strip())
        print(f"[BOE] Slice: {config['slice_type']} | "
              f"Latency: {config['max_latency_ms']}ms | "
              f"Tier: {config['sla_tier']}")
        return {**state, "slice_config": config}
    except Exception as e:
        return {**state, "error_message": f"Slice config failed: {str(e)}"}

def validator_node(state: BOEState) -> BOEState:
    if state.get("error_message"):
        return state
    print("\n[BOE] Node 3: Validating slice against SLA bounds...")
    config = state["slice_config"]
    intent = state["parsed_intent"]
    issues = []
    warnings = []

    if config["max_latency_ms"] <= 0:
        issues.append("Latency must be positive")
    if config["min_throughput_mbps"] <= 0:
        issues.append("Throughput must be positive")
    if not (0 < config["reliability_percent"] <= 100):
        issues.append("Reliability must be 0-100")
    if config["num_endpoints"] <= 0:
        issues.append("Must have at least 1 endpoint")
    if not (1 <= config["priority_class"] <= 9):
        issues.append("Priority class must be 1-9")
    if config["slice_type"] not in ["URLLC", "eMBB", "mMTC"]:
        issues.append("Invalid slice type")

    if intent.get("zero_downtime_required") and config["slice_type"] != "URLLC":
        warnings.append("Zero downtime required — consider upgrading to URLLC")
    if intent.get("criticality") == "critical" and config["reliability_percent"] < 99.9:
        warnings.append("Critical operation — consider increasing reliability")

    passed = len(issues) == 0
    result = {
        "passed": passed,
        "issues": issues,
        "warnings": warnings,
        "sla_summary": (
            f"{config['slice_type']} | "
            f"{config['max_latency_ms']}ms latency | "
            f"{config['reliability_percent']}% reliability | "
            f"INR {config['estimated_monthly_cost_inr']:,.0f}/month"
        )
    }
    if passed:
        print(f"[BOE] Validation PASSED | {result['sla_summary']}")
    else:
        print(f"[BOE] Validation FAILED | Issues: {issues}")
    return {**state, "validation_result": result}

def output_formatter_node(state: BOEState) -> BOEState:
    if state.get("error_message"):
        return state
    print("\n[BOE] Node 4: Formatting final output...")
    config = state["slice_config"]
    intent = state["parsed_intent"]
    validation = state["validation_result"]

    final_output = {
        "status": "APPROVED" if validation["passed"] else "REJECTED",
        "platform": "NexusXLA — Network as a Service",
        "enterprise_request": state["raw_input"],
        "industry": intent["industry"],
        "use_case": intent["use_case"],
        "slice_parameters": {
            "slice_type": config["slice_type"],
            "max_latency_ms": config["max_latency_ms"],
            "min_throughput_mbps": config["min_throughput_mbps"],
            "reliability_percent": config["reliability_percent"],
            "num_endpoints": config["num_endpoints"],
            "priority_class": config["priority_class"],
        },
        "commercial": {
            "sla_tier": config["sla_tier"],
            "monthly_cost_inr": config["estimated_monthly_cost_inr"],
            "billing_model": "outcome-based subscription",
            "auto_credit_enabled": True,
        },
        "reasoning": config["reasoning"],
        "sla_summary": validation["sla_summary"],
        "warnings": validation.get("warnings", []),
        "research_basis": {
            "intent_translation": "P1 IEEE Access 2019",
            "pricing_model":      "P3 IEEE ICC 2017",
            "sla_enforcement":    "P4 IEEE CommMag 2023",
            "ml_forecasting":     "P5 IEEE ICCC 2024",
        }
    }

    print(f"\n{'='*55}")
    print(f"  NexusXLA BOE — SLICE CONFIGURED")
    print(f"{'='*55}")
    print(f"  Status   : {final_output['status']}")
    print(f"  Industry : {intent['industry'].upper()}")
    print(f"  Slice    : {config['slice_type']}")
    print(f"  Latency  : {config['max_latency_ms']} ms")
    print(f"  Reliabil : {config['reliability_percent']}%")
    print(f"  Tier     : {config['sla_tier'].upper()}")
    print(f"  Cost     : INR {config['estimated_monthly_cost_inr']:,.0f}/month")
    print(f"  Reason   : {config['reasoning']}")
    print(f"{'='*55}\n")
    return {**state, "final_output": final_output}

def build_boe_agent():
    graph = StateGraph(BOEState)
    graph.add_node("intent_parser",      intent_parser_node)
    graph.add_node("slice_configurator", slice_configurator_node)
    graph.add_node("validator",          validator_node)
    graph.add_node("output_formatter",   output_formatter_node)
    graph.set_entry_point("intent_parser")
    graph.add_edge("intent_parser",      "slice_configurator")
    graph.add_edge("slice_configurator", "validator")
    graph.add_edge("validator",          "output_formatter")
    graph.add_edge("output_formatter",   END)
    return graph.compile()

boe_agent = build_boe_agent()

def run_boe(enterprise_input: str) -> dict:
    initial_state: BOEState = {
        "raw_input":         enterprise_input,
        "parsed_intent":     None,
        "slice_config":      None,
        "validation_result": None,
        "error_message":     None,
        "final_output":      None,
    }
    result = boe_agent.invoke(initial_state)
    if result.get("error_message"):
        return {"status": "ERROR", "message": result["error_message"]}
    return result["final_output"]

if __name__ == "__main__":
    import time
    
    test_cases = [
        "300 robotic arms doing precision welding, zero downtime tolerated",
        "ICU patient monitoring for 50 beds, ECG must transmit continuously",
        "Track 10,000 delivery packages across warehouse, updates every 5 minutes",
        "5,000 smart city air quality sensors, battery powered, hourly updates",
    ]
    for i, test in enumerate(test_cases, 1):
        print(f"\n{'#'*55}")
        print(f"TEST {i}: {test[:50]}...")
        print(f"{'#'*55}")
        result = run_boe(test)
        print(json.dumps(result, indent=2))
        print("\nWaiting 3 seconds...")
        time.sleep(3)


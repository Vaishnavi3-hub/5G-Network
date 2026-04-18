import React from 'react'

export default function ResultCard({ result }: { result: any }) {
  const s = result
  const slice = s.slice_parameters

  return (
    <div className="card result-card">
      <div className="result-head">
        <div className={`status ${s.status === 'APPROVED' ? 'ok' : 'bad'}`}>
          {s.status}
        </div>
        <h2>{s.platform}</h2>
        <p className="summary">{s.sla_summary}</p>
      </div>

      <div className="section-grid">

        <div className="section-card">
          <h3>Network Profile</h3>
          <div className="grid">
            <div className="metric"><span>Type</span><strong>{slice?.slice_type}</strong></div>
            <div className="metric"><span>Latency</span><strong>{slice?.max_latency_ms} ms</strong></div>
            <div className="metric"><span>Throughput</span><strong>{slice?.min_throughput_mbps} Mbps</strong></div>
          </div>
        </div>

        <div className="section-card">
          <h3>Deployment</h3>
          <div className="grid">
            <div className="metric"><span>Endpoints</span><strong>{slice?.num_endpoints}</strong></div>
            <div className="metric"><span>Priority</span><strong>{slice?.priority_class}</strong></div>
          </div>
        </div>

        <div className="section-card">
          <h3>Commercial</h3>
          <div className="grid">
            <div className="metric"><span>SLA</span><strong>{s.commercial?.sla_tier}</strong></div>
            <div className="metric"><span>Cost</span><strong>₹ {s.commercial?.monthly_cost_inr}</strong></div>
          </div>
        </div>

      </div>

      <div className="architecture">
        <span>User</span>
        <span>→</span>
        <span>Edge</span>
        <span>→</span>
        <span>Core</span>
        <span>→</span>
        <span>Slice</span>
      </div>
    </div>
  )
}
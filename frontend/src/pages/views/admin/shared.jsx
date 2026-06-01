export function StatCard({ label, value, color }) {
  return (
    <div className="stat-card">
      <span className="stat-value" style={{ color }}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export function EmptyRow({ cols, msg }) {
  return <tr><td colSpan={cols} className="empty-row">{msg}</td></tr>;
}

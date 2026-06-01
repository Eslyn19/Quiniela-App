export function StatCard({ label, value, color }) {
    return (
        <div className="player-stat-card">
            <span className="player-stat-value" style={{ color }}>{value}</span>
            <span className="player-stat-label">{label}</span>
        </div>
    );
}

export function EmptyState({ msg }) {
    return (
        <div className="player-empty-state">
            <span>{msg}</span>
        </div>
    );
}

export function EstadoBadge({ estado }) {
    const colors = {
        ABIERTA:    { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444' },
        CERRADA:    { bg: 'rgba(255,209,102,0.15)', text: '#ffd166' },
        FINALIZADA: { bg: 'rgba(107,255,149,0.15)', text: '#6bff95' },
    };
    const style = colors[estado] ?? { bg: 'rgba(255,255,255,0.08)', text: '#f0f0f5' };
    return (
        <span className="player-estado-badge" style={{ background: style.bg, color: style.text }}>
            {estado}
        </span>
    );
}

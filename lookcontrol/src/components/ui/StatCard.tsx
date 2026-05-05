interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
}

export default function StatCard({ label, value, sub, color = 'primary' }: StatCardProps) {
  const colorMap = {
    primary: 'primary',
    success: 'success',
    warning: 'accent',
    danger: 'danger',
    accent: 'accent',
  };

  return (
    <div className={`stat-card ${colorMap[color]}`}>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
      {sub && <p className="stat-card-sub">{sub}</p>}
    </div>
  );
}

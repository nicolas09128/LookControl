export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="dash-empty">
      <p className="dash-empty-text">{message}</p>
    </div>
  );
}

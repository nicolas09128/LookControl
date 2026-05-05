export default function Alert({ type, message }: { type: 'error' | 'success'; message: string }) {
  return <div className={`modal-alert ${type}`}>{message}</div>;
}

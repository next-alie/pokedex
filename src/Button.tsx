/**
 * Generic button with label and a function
 */
export default function Button({
  label,
  onClick,
}: {
  label: string;
  onClick: Function;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onClick()}>
        {label}
      </button>
    </div>
  );
}

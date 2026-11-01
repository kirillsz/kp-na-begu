import styles from "./style.module.css";

export function NumericField({
  value,
  onChange,
  label,
  min = 0,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
}) {
  return (
    <label className={`field ${styles.field}`}>
      <span>{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step="any"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

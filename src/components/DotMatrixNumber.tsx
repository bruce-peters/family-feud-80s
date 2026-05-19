type Props = { value: number; digits?: number; className?: string };

export function DotMatrixNumber({ value, digits = 3, className = '' }: Props) {
  const text = String(value).padStart(digits, '0');
  return (
    <div className={`dot-display text-7xl md:text-9xl leading-none ${className}`}>
      {text}
    </div>
  );
}

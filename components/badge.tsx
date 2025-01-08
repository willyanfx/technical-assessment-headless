export default function Badge({ label = 'On Sale!', variant, className }: BadgeProps) {
  const styles = {
    sale: {
      container: 'absolute left-5 top-5 border-red-600 bg-white',
      label: 'text-red-600'
    },
    soldOut: {
      container: 'absolute bottom-5 left-5 bg-black border-white',
      label: 'text-white'
    }
  };
  return (
    <div
      className={`${styles[variant].container} z-10 inline-flex h-7 items-center justify-center gap-3 overflow-hidden rounded-3xl border px-3 py-1.5 ${className}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`h-4 text-center text-base font-medium leading-none ${styles[variant].label}`}
        aria-label="{label}"
      >
        {label}
      </span>
    </div>
  );
}

type BadgeVariant = 'sale' | 'soldOut';

type BadgeProps = {
  variant: BadgeVariant;
  label?: string;
  className?: string;
};

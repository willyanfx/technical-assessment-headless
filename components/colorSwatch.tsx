export default function ColorSwatch({ color, isAvailable, isSelected, onClick }: ColorSwatchProps) {
  return (
    <>
      <button
        className={`tooltip-button h-6 w-6 rounded-full border-2 hover:border-zinc-600 focus:outline focus:outline-2 focus:outline-sky-600 ${
          isSelected ? 'border-sky-900' : 'border-transparent'
        } relative mr-1 ${isAvailable ? 'cursor-pointer' : 'opacity-30'}`}
        aria-label={`Select ${color.name} color`}
        title={`Select ${color.name} color`}
        role="button"
        aria-disabled={!isAvailable}
        onClick={onClick}
        data-tooltip={color.name}
      >
        <span className="absolute inset-0.5 rounded-full" style={{ backgroundColor: color.code }} />
        {!isAvailable && (
          <span className="absolute left-1/2 top-1/2 z-10 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white" />
        )}
      </button>
    </>
  );
}

type ColorSwatchProps = {
  color: Color;
  isAvailable: boolean;
  isSelected: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

type Color = {
  name: string;
  code: string;
};

interface DiamondRatingProps {
  value?: number;
  className?: string;
  diamondClassName?: string;
}

const DIAMOND_POINTS = '23,10 77,10 100,37 50,77 0,37';

function formatRating(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export default function DiamondRating({
  value = 0,
  className = '',
  diamondClassName = 'h-4 w-5',
}: DiamondRatingProps) {
  const rating = Math.max(0, Math.min(5, value));
  if (rating === 0) return null;

  return (
    <span role="img" aria-label={`${formatRating(rating)}钻`} className={`inline-flex items-center gap-[3px] ${className}`}>
      {Array.from({ length: Math.ceil(rating) }, (_, index) => {
        const coverage = Math.max(0, Math.min(1, rating - index));
        return (
          <span key={index} className={`relative inline-block shrink-0 ${diamondClassName}`} aria-hidden="true">
            <svg
              viewBox="0 0 100 80"
              className="absolute inset-0 h-full w-full"
              style={{ clipPath: `inset(0 ${100 - coverage * 100}% 0 0)` }}
            >
              <polygon points={DIAMOND_POINTS} fill="#FFB000" />
            </svg>
          </span>
        );
      })}
    </span>
  );
}

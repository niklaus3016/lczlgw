interface DiamondRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

const DIAMOND_POINTS = '23,10 77,10 100,37 50,77 0,37';

function formatRating(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function DiamondVisual({ coverage }: { coverage: number }) {
  return (
    <>
      <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <polygon points={DIAMOND_POINTS} fill="#D1D5DB" />
      </svg>
      {coverage > 0 && (
        <svg
          viewBox="0 0 100 80"
          className="absolute inset-0 h-full w-full"
          style={{ clipPath: `inset(0 ${100 - coverage * 100}% 0 0)` }}
          aria-hidden="true"
        >
          <polygon points={DIAMOND_POINTS} fill="#FFB000" />
        </svg>
      )}
    </>
  );
}

export default function DiamondRatingInput({ value, onChange }: DiamondRatingInputProps) {
  return (
    <div className="flex min-h-[38px] items-center gap-2 rounded-lg border border-gray-200 px-3 py-1">
      <div className="flex items-center gap-0.5" role="group" aria-label="选择酒店钻级">
        {Array.from({ length: 5 }, (_, index) => {
          const halfValue = index + 0.5;
          const fullValue = index + 1;
          const coverage = Math.max(0, Math.min(1, value - index));
          return (
            <span key={index} className="relative block h-6 w-7 shrink-0">
              <DiamondVisual coverage={coverage} />
              <button
                type="button"
                title={`${formatRating(halfValue)}钻（点击左半）`}
                aria-label={`${formatRating(halfValue)}钻`}
                aria-pressed={value === halfValue}
                onClick={() => onChange(halfValue)}
                className="absolute inset-y-0 left-0 z-10 w-1/2 cursor-pointer rounded-l focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#EE9B27]"
              />
              <button
                type="button"
                title={`${fullValue}钻（点击右半）`}
                aria-label={`${fullValue}钻`}
                aria-pressed={value === fullValue}
                onClick={() => onChange(fullValue)}
                className="absolute inset-y-0 right-0 z-10 w-1/2 cursor-pointer rounded-r focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#EE9B27]"
              />
            </span>
          );
        })}
      </div>
      <span className="ml-auto whitespace-nowrap text-xs text-gray-500">{formatRating(value)}钻</span>
      {value > 0 && (
        <button
          type="button"
          onClick={() => onChange(0)}
          className="whitespace-nowrap text-xs text-gray-400 hover:text-[#EE9B27]"
        >
          清零
        </button>
      )}
    </div>
  );
}

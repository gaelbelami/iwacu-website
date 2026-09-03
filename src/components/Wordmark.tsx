export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display text-[22px] font-medium tracking-[-0.02em] leading-none ${className}`}
    >
      <svg
        className="block w-[26px] h-[14px]"
        viewBox="0 0 26 14"
        aria-hidden="true"
      >
        <path
          d="M 1 13 Q 13 -2 25 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      iwacu
    </span>
  );
}

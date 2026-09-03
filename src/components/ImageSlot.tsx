function isUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("//") || value.startsWith("data:");
}

export default function ImageSlot({
  placeholder = "Drop image here",
  className = "",
  alt = "",
}: {
  placeholder?: string;
  className?: string;
  alt?: string;
}) {
  // If the placeholder value is actually a URL, render the image
  if (placeholder && isUrl(placeholder)) {
    return (
      <div
        className={`absolute inset-0 overflow-hidden rounded-lg ${className}`}
        style={{ backgroundImage: `url(${placeholder})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-current/20 bg-current/[0.04] rounded-lg text-center p-4 ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className="text-xs font-display tracking-wide opacity-50 max-w-[90%]">
        {placeholder}
      </span>
    </div>
  );
}

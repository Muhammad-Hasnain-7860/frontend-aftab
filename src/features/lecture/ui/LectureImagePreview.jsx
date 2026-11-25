import { useEffect, useState } from "react";

const LectureImagePreview = ({ imageUrl, title, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`View ${title} image`}
        className={`group relative block w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 ${className}`}
      >
        <img
          src={imageUrl}
          alt={`${title} preview`}
          loading="lazy"
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-xs font-medium text-white">
          Click to view full image
        </span>
      </button>

      {isOpen && (
        <div
          role="presentation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} image`}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-6xl items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close image"
              className="absolute right-2 top-2 z-10 rounded-full bg-black/60 px-3 py-1.5 text-xl leading-none text-white hover:bg-black/80"
            >
              ×
            </button>
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[88vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LectureImagePreview;

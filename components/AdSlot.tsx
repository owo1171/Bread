interface AdSlotProps {
  /** stable id so the AdSense snippet can target it later */
  id: string;
  /** short note shown in the placeholder, also used as aria-label */
  note: string;
  /** reserve height to keep CLS near zero */
  minHeight?: number;
}

/**
 * Placeholder ad container. When AdSense goes live, drop <ins class="adsbygoogle">
 * inside this div and delete the placeholder styles.
 */
export default function AdSlot({ id, note, minHeight = 120 }: AdSlotProps) {
  return (
    <div
      id={id}
      data-ad-slot={note}
      aria-label={`Advertisement: ${note}`}
      style={{ minHeight }}
      className="my-6 flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-xs text-slate-400"
    >
      {note}
    </div>
  );
}

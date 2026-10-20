interface AdSlotProps {
  /** stable id so a future ad unit can target it */
  id: string;
  /** short note describing the intended unit position — documentation, never rendered */
  note: string;
  /** reserve height to keep CLS near zero once a unit is live */
  minHeight?: number;
}

/**
 * Disabled placeholder for a Google ad unit.
 *
 * `ADS_ENABLED` is the single switch. While it is false — the state this
 * repository ships in — the component renders nothing at all: no dashed box, no
 * reserved space, and above all no internal note such as "Ad slot — results
 * area (300x250)" on a page a visitor or a reviewer is reading.
 *
 * To go live: set ADS_ENABLED to true AND replace the empty div with a real
 * `<ins class="adsbygoogle">` unit. The `note` prop is documentation for whoever
 * wires that unit; it must not be put back into the DOM as page copy.
 */
const ADS_ENABLED: boolean = false;

export default function AdSlot({ id, minHeight = 120 }: AdSlotProps) {
  if (!ADS_ENABLED) return null;
  return <div id={id} style={{ minHeight }} aria-label="Advertisement" />;
}

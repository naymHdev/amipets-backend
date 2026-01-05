// Types
interface Positionable {
  _id: string;
  position?: number;
}

function shuffle<T>(arr: ReadonlyArray<T>): T[] {
  const out = Array.from(arr);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

/**
 * Order services by fixed positions and fill gaps with random unpositioned items.
 *
 * Behaviour:
 *  - All items with position > 0 are "fixed".
 *  - Positions are considered 1..maxFixedPosition. For each position p:
 *      - If fixed items exist for p => append all of them (preserve their relative order)
 *      - Else => append one random unpositioned item (if available)
 *  - After loop, append remaining unpositioned items (in random order).
 */
export function orderByPositionAndFill<T extends Positionable>(
  services: T[],
): T[] {
  if (!Array.isArray(services) || services.length === 0) return [];

  // Partition into fixed and unpositioned
  const fixedMap: Map<number, T[]> = new Map();
  const unpositioned: T[] = [];

  for (const item of services) {
    const pos = Number(item.position) || 0;
    if (pos > 0) {
      if (!fixedMap.has(pos)) fixedMap.set(pos, []);
      fixedMap.get(pos)!.push(item);
    } else {
      unpositioned.push(item);
    }
  }

  if (fixedMap.size === 0) {
    // no fixed positions -> just return shuffled list (or original order if you prefer)
    return shuffle(services);
  }

  // Prepare
  const fixedPositions = Array.from(fixedMap.keys()).sort((a, b) => a - b);
  const maxPosition = Math.max(...fixedPositions);

  // Shuffle unpositioned pool once
  const randomPool = shuffle(unpositioned);
  let randomIndex = 0;

  const result: T[] = [];

  // Fill positions 1..maxPosition
  for (let p = 1; p <= maxPosition; p++) {
    const fixedForPos = fixedMap.get(p);
    if (fixedForPos && fixedForPos.length > 0) {
      // push all fixed items for this position (preserve order)
      result.push(...fixedForPos);
    } else {
      // fill gap with a single random item if available
      if (randomIndex < randomPool.length) {
        result.push(randomPool[randomIndex]);
        randomIndex++;
      }
      // if random pool exhausted, simply skip (no filler)
    }
  }

  // Append any remaining random items
  while (randomIndex < randomPool.length) {
    result.push(randomPool[randomIndex]);
    randomIndex++;
  }

  return result;
}

/* ============================
   Example: Integration with DB
   (adjust QueryBuilder / Service model types to your codebase)
   ============================ */

export type QueryRecord = Record<string, unknown>;

// Example service type specifics (adjust to match your model)
export interface ServiceDoc extends Positionable {
  name: string;
  icon?: string;
  service_tags?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

let counter = 0

/**
 * Creates a stable, collision-free identifier for a survey item.
 *
 * Question and section ids are also react-hook-form field names and the
 * targets of `nextSectionId`, so two items sharing an id silently merge
 * into a single form field. `Date.now()` alone collides whenever two items
 * are created within the same millisecond, which duplication and keyboard
 * shortcuts both do.
 */
export function createId(prefix: 'q' | 'sec'): string {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${Date.now()}_${counter}${random}`
}

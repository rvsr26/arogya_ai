import type { DoctorEntity } from './schemas/doctor.schema.js';
import type { SlotEntity } from './schemas/slot.schema.js';
/**
 * Demo provider directory for the Arogya Appointment Arc MVP.
 *
 * Portraits are real Unsplash hotlinks sourced via the image search tool —
 * every doctor renders as an image card, so `imageUrl` is never blank.
 */
export declare const SEED_DOCTORS: DoctorEntity[];
/**
 * Calendar dates the demo directory publishes slots for.
 * `2026-07-28` is intentionally first: the guided demo conversation books the
 * 17:00 slot on that date, so it must always exist in the seeded data.
 */
export declare const SEED_DATES: readonly ["2026-07-28", "2026-07-29", "2026-07-30"];
/**
 * Expand the slot grid into concrete slot documents for every seeded date.
 * A small deterministic rule pre-books a couple of mid-day slots so the
 * comparison view shows realistic scarcity instead of a fully open calendar.
 */
export declare function buildSeedSlots(): SlotEntity[];
//# sourceMappingURL=seed-data.d.ts.map
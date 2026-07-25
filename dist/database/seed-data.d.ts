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
export declare const SEED_DATES: readonly ["2026-07-28", "2026-07-29", "2026-07-30", "2026-07-31", "2026-08-01", "2026-08-02", "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07", "2026-08-08", "2026-08-09", "2026-08-10", "2026-08-11", "2026-08-12", "2026-08-13", "2026-08-14", "2026-08-15", "2026-08-16", "2026-08-17", "2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21", "2026-08-22", "2026-08-23", "2026-08-24", "2026-08-25", "2026-08-26"];
/**
 * Expand the slot grid into concrete slot documents for every seeded date.
 * A small deterministic rule pre-books a couple of mid-day slots so the
 * comparison view shows realistic scarcity instead of a fully open calendar.
 */
export declare function buildSeedSlots(): SlotEntity[];
//# sourceMappingURL=seed-data.d.ts.map
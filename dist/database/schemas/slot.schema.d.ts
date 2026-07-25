import { type Model } from 'mongoose';
export type SlotStatus = 'available' | 'booked';
export type ConsultationMode = 'in-person' | 'video';
/**
 * A single bookable consultation window for one doctor on one calendar day.
 * Dates are stored as ISO calendar strings (`YYYY-MM-DD`) and times as 24h
 * `HH:mm` so slot comparison is a pure string comparison — no timezone drift.
 */
export interface SlotEntity {
    slotId: string;
    doctorId: string;
    /** ISO calendar date, e.g. "2026-07-28". */
    date: string;
    /** 24h start time, e.g. "17:00". */
    startTime: string;
    /** 24h end time, e.g. "17:30". */
    endTime: string;
    mode: ConsultationMode;
    status: SlotStatus;
    fee: number;
    /** Populated when the slot is booked. */
    bookingId?: string | null;
}
export declare const SlotModel: Model<SlotEntity>;
//# sourceMappingURL=slot.schema.d.ts.map
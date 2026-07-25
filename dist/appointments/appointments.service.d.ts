import { DatabaseService } from '../database/database.service.js';
/** Shape consumed by the `booking` confirmation widget. */
export interface BookingView {
    bookingId: string;
    status: string;
    doctor: {
        doctorId: string;
        name: string;
        specialty: string;
        imageUrl: string;
    };
    hospital: string;
    address: string;
    city: string;
    slot: {
        slotId: string;
        date: string;
        startTime: string;
        endTime: string;
        mode: string;
        /** Human label, e.g. "Tue, 28 Jul 2026 · 5:00 PM". */
        label: string;
    };
    patient: {
        name: string;
        phone: string;
        age: number | null;
    };
    reason: string | null;
    fee: number;
    currency: string;
    bookedAt: string;
    predictions?: {
        queueDelayMinutes: number;
        noShowProbability: string;
        predictionReason: string;
        confidenceScore: number;
    };
}
export declare class BookingError extends Error {
}
/**
 * Write-side logic for appointments: reserve a slot atomically, then read the
 * confirmation back. Slot reservation uses a conditional update so two
 * concurrent bookings can never claim the same window.
 */
export declare class AppointmentsService {
    private readonly db;
    constructor(db: DatabaseService);
    /** `booking_` + short random suffix; readable enough to say out loud. */
    private newBookingId;
    /**
     * Accept "17:00", "5 PM", "5:00 PM", "1700" and normalise to `HH:mm`.
     * Returns null when the input cannot be understood.
     */
    normaliseTime(raw: string): string | null;
    /** "2026-07-28" + "17:00" → "Tue, 28 Jul 2026 · 5:00 PM". */
    private formatSlotLabel;
    /**
     * Book a slot.
     *
     * Resolution order: explicit `slotId` wins; otherwise the slot is located by
     * `doctorId` + `date` + normalised `startTime`. The reservation is an atomic
     * `findOneAndUpdate` filtered on `status: 'available'`, so a losing racer gets
     * a clear "already booked" error instead of a double booking.
     */
    bookAppointment(params: {
        doctorId: string;
        date: string;
        startTime?: string;
        slotId?: string;
        patientName: string;
        patientPhone: string;
        patientAge?: number;
        reason?: string;
    }): Promise<BookingView>;
    /** Read a confirmation back by booking id. */
    getAppointment(bookingId: string): Promise<BookingView | null>;
    /** Map a stored appointment to the widget-facing view model. */
    private toView;
}
//# sourceMappingURL=appointments.service.d.ts.map
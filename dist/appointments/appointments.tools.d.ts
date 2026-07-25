import { ExecutionContext, z } from '@nitrostack/core';
import { AppointmentsService } from './appointments.service.js';
declare const bookAppointmentInput: z.ZodObject<{
    doctorId: z.ZodString;
    date: z.ZodString;
    startTime: z.ZodOptional<z.ZodString>;
    slotId: z.ZodOptional<z.ZodString>;
    patientName: z.ZodString;
    patientPhone: z.ZodString;
    patientAge: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    doctorId: string;
    date: string;
    patientName: string;
    patientPhone: string;
    slotId?: string | undefined;
    startTime?: string | undefined;
    patientAge?: number | undefined;
    reason?: string | undefined;
}, {
    doctorId: string;
    date: string;
    patientName: string;
    patientPhone: string;
    slotId?: string | undefined;
    startTime?: string | undefined;
    patientAge?: number | undefined;
    reason?: string | undefined;
}>;
declare const getAppointmentInput: z.ZodObject<{
    bookingId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    bookingId: string;
}, {
    bookingId: string;
}>;
/**
 * Booking surface: reserve a slot, then render the confirmation the patient can
 * screenshot and carry to the hospital.
 */
export declare class AppointmentsTools {
    private readonly appointments;
    constructor(appointments: AppointmentsService);
    bookAppointment(input: z.infer<typeof bookAppointmentInput>, ctx: ExecutionContext): Promise<{
        booked: boolean;
        bookingId: string;
        status: string;
        doctorId: string;
        doctorName: string;
        specialty: string;
        hospital: string;
        address: string;
        city: string;
        slot: string;
        slotLabel: string;
        mode: string;
        patientName: string;
        patientPhone: string;
        fee: number;
        currency: string;
        summary: string;
        nextStep: string;
        error?: undefined;
        message?: undefined;
    } | {
        booked: boolean;
        bookingId: null;
        error: boolean;
        message: string;
        summary: string;
        status?: undefined;
        doctorId?: undefined;
        doctorName?: undefined;
        specialty?: undefined;
        hospital?: undefined;
        address?: undefined;
        city?: undefined;
        slot?: undefined;
        slotLabel?: undefined;
        mode?: undefined;
        patientName?: undefined;
        patientPhone?: undefined;
        fee?: undefined;
        currency?: undefined;
        nextStep?: undefined;
    }>;
    getAppointment(input: z.infer<typeof getAppointmentInput>, ctx: ExecutionContext): Promise<{
        found: boolean;
        bookingId: string;
        error: boolean;
        message: string;
        summary: string;
    } | {
        summary: string;
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
        found: boolean;
        error?: undefined;
        message?: undefined;
    } | {
        error: boolean;
        message: string;
        found?: undefined;
        bookingId?: undefined;
        summary?: undefined;
    }>;
}
export {};
//# sourceMappingURL=appointments.tools.d.ts.map
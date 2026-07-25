import { ExecutionContext, z } from '@nitrostack/core';
import { DiscoveryService } from './discovery.service.js';
declare const searchDoctorsInput: z.ZodObject<{
    specialty: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    maxFee: z.ZodOptional<z.ZodNumber>;
    minRating: z.ZodOptional<z.ZodNumber>;
    acceptsInsurance: z.ZodOptional<z.ZodBoolean>;
    date: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodEnum<["rating", "distance", "fee", "earliest"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    specialty?: string | undefined;
    city?: string | undefined;
    acceptsInsurance?: boolean | undefined;
    date?: string | undefined;
    maxFee?: number | undefined;
    minRating?: number | undefined;
    sortBy?: "rating" | "distance" | "fee" | "earliest" | undefined;
}, {
    specialty?: string | undefined;
    city?: string | undefined;
    acceptsInsurance?: boolean | undefined;
    date?: string | undefined;
    limit?: number | undefined;
    maxFee?: number | undefined;
    minRating?: number | undefined;
    sortBy?: "rating" | "distance" | "fee" | "earliest" | undefined;
}>;
declare const compareSlotsInput: z.ZodObject<{
    doctorIds: z.ZodArray<z.ZodString, "many">;
    date: z.ZodString;
    mode: z.ZodOptional<z.ZodEnum<["in-person", "video"]>>;
}, "strip", z.ZodTypeAny, {
    date: string;
    doctorIds: string[];
    mode?: "in-person" | "video" | undefined;
}, {
    date: string;
    doctorIds: string[];
    mode?: "in-person" | "video" | undefined;
}>;
/**
 * Patient-facing discovery surface: find a clinician, then compare their open
 * consultation windows before committing to a booking.
 */
export declare class DiscoveryTools {
    private readonly discovery;
    constructor(discovery: DiscoveryService);
    searchDoctors(input: z.infer<typeof searchDoctorsInput>, ctx: ExecutionContext): Promise<{
        query: {
            specialty: string | null;
            city: string | null;
        };
        count: number;
        doctors: import("./discovery.service.js").DoctorCard[];
        recommendation: string | undefined;
        summary: string;
        nextStep: string;
        error?: undefined;
        message?: undefined;
    } | {
        error: boolean;
        message: string;
        query?: undefined;
        count?: undefined;
        doctors?: undefined;
        recommendation?: undefined;
        summary?: undefined;
        nextStep?: undefined;
    }>;
    compareSlots(input: z.infer<typeof compareSlotsInput>, ctx: ExecutionContext): Promise<{
        date: string;
        mode: string;
        columns: import("./discovery.service.js").SlotComparisonColumn[];
        commonTimes: string[];
        unknownDoctorIds: string[];
        recommendedSlot: {
            doctorId: string;
            slotId: string;
        } | null | undefined;
        recommendedReason: string | null | undefined;
        summary: string;
        nextStep: string;
        error?: undefined;
        message?: undefined;
    } | {
        error: boolean;
        message: string;
        date?: undefined;
        mode?: undefined;
        columns?: undefined;
        commonTimes?: undefined;
        unknownDoctorIds?: undefined;
        recommendedSlot?: undefined;
        recommendedReason?: undefined;
        summary?: undefined;
        nextStep?: undefined;
    }>;
    doctorSummary(input: {
        doctorId: string;
    }, ctx: ExecutionContext): Promise<{
        error: boolean;
        message: string;
        doctorId?: undefined;
        summary?: undefined;
    } | {
        doctorId: string;
        summary: string;
        error?: undefined;
        message?: undefined;
    }>;
}
export {};
//# sourceMappingURL=discovery.tools.d.ts.map
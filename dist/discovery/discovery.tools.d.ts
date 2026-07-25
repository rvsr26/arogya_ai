import { ExecutionContext, z } from '@nitrostack/core';
import { DiscoveryService } from './discovery.service.js';
declare const searchDoctorsInput: z.ZodObject<{
    specialty: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    maxFee: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    specialty?: string | undefined;
    city?: string | undefined;
    maxFee?: number | undefined;
}, {
    specialty?: string | undefined;
    city?: string | undefined;
    limit?: number | undefined;
    maxFee?: number | undefined;
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
            maxFee: number | null;
        };
        count: number;
        doctors: import("./discovery.service.js").DoctorCard[];
        summary: string;
        nextStep: string;
    }>;
    compareSlots(input: z.infer<typeof compareSlotsInput>, ctx: ExecutionContext): Promise<{
        date: string;
        mode: string;
        columns: import("./discovery.service.js").SlotComparisonColumn[];
        commonTimes: string[];
        unknownDoctorIds: string[];
        summary: string;
        nextStep: string;
    }>;
}
export {};
//# sourceMappingURL=discovery.tools.d.ts.map
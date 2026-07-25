import { ConfigService, type OnModuleInit, type OnApplicationShutdown } from '@nitrostack/core';
import { DoctorModel } from './schemas/doctor.schema.js';
import { SlotModel } from './schemas/slot.schema.js';
import { AppointmentModel } from './schemas/appointment.schema.js';
import { ReminderModel } from './schemas/reminder.schema.js';
import { PatientPreferenceModel } from './schemas/patient-preference.schema.js';
import { BedModel } from './schemas/bed.schema.js';
import { MedicineModel } from './schemas/medicine.schema.js';
import { LabTestModel } from './schemas/lab-test.schema.js';
/**
 * Owns the single Mongoose connection for the whole MCP server and guarantees
 * demo data exists before any tool runs.
 *
 * Design notes:
 * - `connect()` is idempotent and concurrency-safe: every tool awaits the same
 *   in-flight promise instead of opening a second connection.
 * - Seeding is idempotent (upsert by natural key), so restarts never duplicate
 *   rows and never wipe real appointments.
 * - No `console.*` anywhere: this process speaks MCP over STDIO.
 */
export declare class DatabaseService implements OnModuleInit, OnApplicationShutdown {
    private readonly config;
    private connectionPromise;
    private connected;
    constructor(config: ConfigService);
    /** Eagerly connect + seed at boot so the first tool call is fast. */
    onModuleInit(): Promise<void>;
    onApplicationShutdown(): Promise<void>;
    /** Resolve the Mongo connection string from env, with a local fallback. */
    private getUri;
    /**
     * Connect (once) and ensure the demo directory is seeded.
     * Safe to call from every tool handler.
     */
    connect(): Promise<void>;
    /**
     * Idempotently upsert the seed directory.
     *
     * Doctors are upserted by `doctorId`; slots by `slotId`, and an existing slot
     * keeps its `status`/`bookingId` (we only `$setOnInsert` those) so a restart
     * never silently frees an already booked slot.
     */
    private ensureSeeded;
    /** Doctor directory collection (connection guaranteed). */
    doctors(): Promise<typeof DoctorModel>;
    /** Slot inventory collection (connection guaranteed). */
    slots(): Promise<typeof SlotModel>;
    /** Appointment ledger collection (connection guaranteed). */
    appointments(): Promise<typeof AppointmentModel>;
    /** Reminders collection */
    reminders(): Promise<typeof ReminderModel>;
    /** Patient preferences collection */
    patientPreferences(): Promise<typeof PatientPreferenceModel>;
    /** Beds collection */
    beds(): Promise<typeof BedModel>;
    /** Medicines collection */
    medicines(): Promise<typeof MedicineModel>;
    /** Lab tests collection */
    labTests(): Promise<typeof LabTestModel>;
}
//# sourceMappingURL=database.service.d.ts.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import mongoose from 'mongoose';
import { Injectable, ConfigService, } from '@nitrostack/core';
import { DoctorModel } from './schemas/doctor.schema.js';
import { SlotModel } from './schemas/slot.schema.js';
import { AppointmentModel } from './schemas/appointment.schema.js';
import { SEED_DOCTORS, buildSeedSlots } from './seed-data.js';
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
let DatabaseService = class DatabaseService {
    config;
    connectionPromise = null;
    connected = false;
    constructor(config) {
        this.config = config;
    }
    /** Eagerly connect + seed at boot so the first tool call is fast. */
    async onModuleInit() {
        try {
            await this.connect();
        }
        catch {
            // Swallow at boot: a tool call will retry and surface a useful error to
            // the model rather than crashing the server before the handshake.
            this.connectionPromise = null;
        }
    }
    async onApplicationShutdown() {
        if (this.connected) {
            await mongoose.disconnect();
            this.connected = false;
            this.connectionPromise = null;
        }
    }
    /** Resolve the Mongo connection string from env, with a local fallback. */
    getUri() {
        const uri = this.config.get('MONGODB_URI') ?? process.env.MONGODB_URI ?? '';
        if (!uri) {
            throw new Error('MONGODB_URI is not configured. Add it to .env before using Arogya tools.');
        }
        return uri;
    }
    /**
     * Connect (once) and ensure the demo directory is seeded.
     * Safe to call from every tool handler.
     */
    async connect() {
        if (this.connected && mongoose.connection.readyState === 1)
            return;
        if (!this.connectionPromise) {
            this.connectionPromise = (async () => {
                await mongoose.connect(this.getUri(), {
                    dbName: 'health',
                    serverSelectionTimeoutMS: 15000,
                });
                this.connected = true;
                await this.ensureSeeded();
            })().catch((error) => {
                this.connectionPromise = null;
                this.connected = false;
                throw error;
            });
        }
        await this.connectionPromise;
    }
    /**
     * Idempotently upsert the seed directory.
     *
     * Doctors are upserted by `doctorId`; slots by `slotId`, and an existing slot
     * keeps its `status`/`bookingId` (we only `$setOnInsert` those) so a restart
     * never silently frees an already booked slot.
     */
    async ensureSeeded() {
        const doctorOps = SEED_DOCTORS.map((doctor) => ({
            updateOne: {
                filter: { doctorId: doctor.doctorId },
                update: { $set: doctor },
                upsert: true,
            },
        }));
        if (doctorOps.length > 0) {
            await DoctorModel.bulkWrite(doctorOps, { ordered: false });
        }
        const slotOps = buildSeedSlots().map((slot) => {
            const { status, bookingId, ...stable } = slot;
            return {
                updateOne: {
                    filter: { slotId: slot.slotId },
                    update: {
                        $set: stable,
                        $setOnInsert: { status, bookingId: bookingId ?? null },
                    },
                    upsert: true,
                },
            };
        });
        if (slotOps.length > 0) {
            await SlotModel.bulkWrite(slotOps, { ordered: false });
        }
    }
    /** Doctor directory collection (connection guaranteed). */
    async doctors() {
        await this.connect();
        return DoctorModel;
    }
    /** Slot inventory collection (connection guaranteed). */
    async slots() {
        await this.connect();
        return SlotModel;
    }
    /** Appointment ledger collection (connection guaranteed). */
    async appointments() {
        await this.connect();
        return AppointmentModel;
    }
};
DatabaseService = __decorate([
    Injectable({ deps: [ConfigService] }),
    __metadata("design:paramtypes", [ConfigService])
], DatabaseService);
export { DatabaseService };
//# sourceMappingURL=database.service.js.map
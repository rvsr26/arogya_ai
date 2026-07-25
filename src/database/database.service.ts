import mongoose from 'mongoose';
import {
  Injectable,
  ConfigService,
  type OnModuleInit,
  type OnApplicationShutdown,
} from '@nitrostack/core';
import { DoctorModel } from './schemas/doctor.schema.js';
import { SlotModel } from './schemas/slot.schema.js';
import { AppointmentModel } from './schemas/appointment.schema.js';
import { ReminderModel } from './schemas/reminder.schema.js';
import { PatientPreferenceModel } from './schemas/patient-preference.schema.js';
import { BedModel } from './schemas/bed.schema.js';
import { MedicineModel } from './schemas/medicine.schema.js';
import { LabTestModel } from './schemas/lab-test.schema.js';
import { SEED_DOCTORS, buildSeedSlots } from './seed-data.js';
import { generateDoctors, generateBeds, generateMedicines, generateLabTests } from './seed-generator.js';

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
@Injectable({ deps: [ConfigService] })
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  private connectionPromise: Promise<void> | null = null;
  private connected = false;

  constructor(private readonly config: ConfigService) {}

  /** Eagerly connect + seed at boot so the first tool call is fast. */
  async onModuleInit(): Promise<void> {
    try {
      await this.connect();
    } catch {
      // Swallow at boot: a tool call will retry and surface a useful error to
      // the model rather than crashing the server before the handshake.
      this.connectionPromise = null;
    }
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.connected) {
      await mongoose.disconnect();
      this.connected = false;
      this.connectionPromise = null;
    }
  }

  /** Resolve the Mongo connection string from env, with a local fallback. */
  private getUri(): string {
    const uri =
      this.config.get<string>('MONGODB_URI') ?? process.env.MONGODB_URI ?? '';

    if (!uri) {
      throw new Error(
        'MONGODB_URI is not configured. Add it to .env before using Arogya tools.',
      );
    }

    return uri;
  }

  /**
   * Connect (once) and ensure the demo directory is seeded.
   * Safe to call from every tool handler.
   */
  async connect(): Promise<void> {
    if (this.connected && mongoose.connection.readyState === 1) return;

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
  private async ensureSeeded(): Promise<void> {
    const allDoctors = [...SEED_DOCTORS, ...generateDoctors(100)];
    const doctorOps = allDoctors.map((doctor) => ({
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

    const bedOps = generateBeds(150).map((bed) => ({
      updateOne: { filter: { bedId: bed.bedId }, update: { $set: bed }, upsert: true }
    }));
    if (bedOps.length > 0) await BedModel.bulkWrite(bedOps, { ordered: false });

    const medOps = generateMedicines(500).map((med) => ({
      updateOne: { filter: { medicineId: med.medicineId }, update: { $set: med }, upsert: true }
    }));
    if (medOps.length > 0) await MedicineModel.bulkWrite(medOps, { ordered: false });

    const labOps = generateLabTests().map((lab) => ({
      updateOne: { filter: { testId: lab.testId }, update: { $set: lab }, upsert: true }
    }));
    if (labOps.length > 0) await LabTestModel.bulkWrite(labOps, { ordered: false });
  }

  /** Doctor directory collection (connection guaranteed). */
  async doctors(): Promise<typeof DoctorModel> {
    await this.connect();
    return DoctorModel;
  }

  /** Slot inventory collection (connection guaranteed). */
  async slots(): Promise<typeof SlotModel> {
    await this.connect();
    return SlotModel;
  }

  /** Appointment ledger collection (connection guaranteed). */
  async appointments(): Promise<typeof AppointmentModel> {
    await this.connect();
    return AppointmentModel;
  }

  /** Reminders collection */
  async reminders(): Promise<typeof ReminderModel> {
    await this.connect();
    return ReminderModel;
  }

  /** Patient preferences collection */
  async patientPreferences(): Promise<typeof PatientPreferenceModel> {
    await this.connect();
    return PatientPreferenceModel;
  }

  /** Beds collection */
  async beds(): Promise<typeof BedModel> {
    await this.connect();
    return BedModel;
  }

  /** Medicines collection */
  async medicines(): Promise<typeof MedicineModel> {
    await this.connect();
    return MedicineModel;
  }

  /** Lab tests collection */
  async labTests(): Promise<typeof LabTestModel> {
    await this.connect();
    return LabTestModel;
  }
}

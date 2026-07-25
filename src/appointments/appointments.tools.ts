import {
  ToolDecorator as Tool,
  Widget,
  Injectable,
  ExecutionContext,
  z,
} from '@nitrostack/core';
import { AppointmentsService, BookingError } from './appointments.service.js';

const bookAppointmentInput = z.object({
  doctorId: z
    .string()
    .min(1)
    .describe('Doctor id from search-doctors, e.g. "doc_pune_card_01".'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be ISO format YYYY-MM-DD')
    .describe('Appointment date, ISO format YYYY-MM-DD, e.g. "2026-07-28".'),
  startTime: z
    .string()
    .optional()
    .describe(
      'Slot start time. Accepts 24h "17:00" or 12h "5:00 PM". Required unless slotId is supplied.',
    ),
  slotId: z
    .string()
    .optional()
    .describe('Exact slotId from compare-slots. Takes precedence over startTime.'),
  patientName: z.string().min(1).describe('Full name of the patient, e.g. "Ananya Sharma".'),
  patientPhone: z
    .string()
    .min(6)
    .describe('Patient contact phone number, e.g. "9876543210".'),
  patientAge: z.number().int().min(0).max(120).optional().describe('Patient age in years.'),
  reason: z.string().optional().describe('Reason for the visit or presenting complaint.'),
});

const getAppointmentInput = z.object({
  bookingId: z
    .string()
    .min(1)
    .describe('Booking id returned by book-appointment, e.g. "booking_1a2b3c4d".'),
});

/**
 * Booking surface: reserve a slot, then render the confirmation the patient can
 * screenshot and carry to the hospital.
 */
@Injectable({ deps: [AppointmentsService] })
export class AppointmentsTools {
  constructor(private readonly appointments: AppointmentsService) {}

  @Tool({
    name: 'book-appointment',
    title: 'Book appointment',
    description:
      'Book a consultation slot for a patient. Supply the doctorId, the date (YYYY-MM-DD) and either the slot start time (e.g. "17:00") or an exact slotId, plus the patient name and phone. Reserves the slot atomically and returns a bookingId — pass that bookingId to get-appointment to show the confirmation.',
    inputSchema: bookAppointmentInput,
    invocation: {
      invoking: 'Reserving the slot…',
      invoked: 'Appointment booked',
    },
    metadata: { category: 'appointments', tags: ['booking', 'slot', 'confirm'] },
    examples: {
      request: {
        doctorId: 'doc_pune_card_01',
        date: '2026-07-28',
        startTime: '17:00',
        patientName: 'Ananya Sharma',
        patientPhone: '9876543210',
      },
      response: {
        booked: true,
        bookingId: 'booking_1a2b3c4d',
        status: 'confirmed',
        doctorName: 'Dr. Rohan Deshmukh',
        hospital: 'Sahyadri Super Speciality Hospital',
        slot: '2026-07-28 17:00',
        fee: 900,
      },
    },
  })
  async bookAppointment(
    input: z.infer<typeof bookAppointmentInput>,
    ctx: ExecutionContext,
  ) {
    ctx.logger.info('book-appointment', {
      doctorId: input.doctorId,
      date: input.date,
      startTime: input.startTime,
      slotId: input.slotId,
    });

    try {
      const booking = await this.appointments.bookAppointment({
        doctorId: input.doctorId,
        date: input.date,
        startTime: input.startTime,
        slotId: input.slotId,
        patientName: input.patientName,
        patientPhone: input.patientPhone,
        patientAge: input.patientAge,
        reason: input.reason,
      });

      return {
        booked: true,
        bookingId: booking.bookingId,
        status: booking.status,
        doctorId: booking.doctor.doctorId,
        doctorName: booking.doctor.name,
        specialty: booking.doctor.specialty,
        hospital: booking.hospital,
        address: booking.address,
        city: booking.city,
        slot: `${booking.slot.date} ${booking.slot.startTime}`,
        slotLabel: booking.slot.label,
        mode: booking.slot.mode,
        patientName: booking.patient.name,
        patientPhone: booking.patient.phone,
        fee: booking.fee,
        currency: booking.currency,
        summary: `Appointment confirmed. ${booking.patient.name} will see ${booking.doctor.name} (${booking.doctor.specialty}) at ${booking.hospital}, ${booking.city} on ${booking.slot.label}. Booking id ${booking.bookingId}, consultation fee ₹${booking.fee}.`,
        nextStep: `Call get-appointment with bookingId "${booking.bookingId}" to display the confirmation card.`,
      };
    } catch (error: any) {
      if (error instanceof BookingError) {
        ctx.logger.warn?.('book-appointment rejected', { reason: error.message });
        return {
          booked: false,
          bookingId: null,
          error: true,
          message: error.message,
          summary: `Could not book that slot: ${error.message}`,
        };
      }
      ctx.logger.error('book-appointment failed', { error: error.message });
      return {
        booked: false,
        bookingId: null,
        error: true,
        message: `Booking failed: ${error.message}`,
        summary: `Could not book that slot due to a system error.`,
      };
    }
  }

  @Tool({
    name: 'get-appointment',
    title: 'Get appointment',
    description:
      'Retrieve a booked appointment by bookingId and render the confirmation card: status, doctor photo and specialty, hospital and address, slot date/time, consultation mode, patient details and fee.',
    inputSchema: getAppointmentInput,
    invocation: {
      invoking: 'Fetching your confirmation…',
      invoked: 'Confirmation ready',
    },
    metadata: { category: 'appointments', tags: ['booking', 'confirmation'] },
    examples: {
      request: { bookingId: 'booking_1a2b3c4d' },
      response: {
        found: true,
        bookingId: 'booking_1a2b3c4d',
        status: 'confirmed',
        doctor: {
          doctorId: 'doc_pune_card_01',
          name: 'Dr. Rohan Deshmukh',
          specialty: 'Cardiologist',
          imageUrl: 'https://images.unsplash.com/photo-1647598378432-1aa8fa34f37f',
        },
        hospital: 'Sahyadri Super Speciality Hospital',
        slot: { date: '2026-07-28', startTime: '17:00', label: 'Tue, 28 Jul 2026 · 5:00 PM' },
        fee: 900,
      },
    },
  })
  @Widget({
    route: 'booking',
    prefersBorder: true,
    csp: { resourceDomains: ['https://images.unsplash.com'] },
  })
  async getAppointment(
    input: z.infer<typeof getAppointmentInput>,
    ctx: ExecutionContext,
  ) {
    ctx.logger.info('get-appointment', { bookingId: input.bookingId });

    try {
      const booking = await this.appointments.getAppointment(input.bookingId);

      if (!booking) {
        ctx.logger.warn?.('get-appointment not found', { bookingId: input.bookingId });
        return {
          found: false,
          bookingId: input.bookingId,
          error: true,
          message: `No appointment found with bookingId "${input.bookingId}".`,
          summary: `No appointment found with bookingId "${input.bookingId}". Book one with book-appointment first.`,
        };
      }

      ctx.logger.info('get-appointment success', { bookingId: input.bookingId, status: booking.status });
      return {
        found: true,
        ...booking,
        summary: `Booking ${booking.bookingId} is ${booking.status}. ${booking.patient.name} — ${booking.doctor.name} (${booking.doctor.specialty}) at ${booking.hospital}, ${booking.city} on ${booking.slot.label} (${booking.slot.mode}). Fee ₹${booking.fee}.`,
      };
    } catch (error: any) {
      ctx.logger.error('get-appointment failed', { error: error.message });
      return { error: true, message: `Get appointment failed: ${error.message}` };
    }
  }
}

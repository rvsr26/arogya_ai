import type { DoctorEntity } from './schemas/doctor.schema.js';
import type { SlotEntity } from './schemas/slot.schema.js';

/**
 * Demo provider directory for the Arogya Appointment Arc MVP.
 *
 * Portraits are real Unsplash hotlinks sourced via the image search tool —
 * every doctor renders as an image card, so `imageUrl` is never blank.
 */
export const SEED_DOCTORS: DoctorEntity[] = [
  {
    doctorId: 'doc_pune_card_01',
    name: 'Dr. Rohan Deshmukh',
    specialty: 'Cardiologist',
    specialtySlug: 'cardiology',
    specialtyAliases: ['cardiologist', 'cardiology', 'heart', 'heart specialist', 'cardiac'],
    city: 'Pune',
    hospital: 'Sahyadri Super Speciality Hospital',
    address: 'Plot 30-C, Erandwane, Karve Road, Pune 411004',
    qualifications: 'MBBS, MD (Medicine), DM (Cardiology)',
    experienceYears: 18,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 900,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 1247,
    imageUrl:
      'https://images.unsplash.com/photo-1647598378432-1aa8fa34f37f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYWxlJTIwZG9jdG9yJTIwcG9ydHJhaXQlMjB3aGl0ZSUyMGNvYXR8ZW58MXwyfHx8MTc4NDk3NjQxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Interventional cardiologist with 3,000+ angioplasties. Special interest in preventive cardiac care and heart failure management.',
  },
  {
    doctorId: 'doc_pune_card_02',
    name: 'Dr. Ananya Kulkarni',
    specialty: 'Cardiologist',
    specialtySlug: 'cardiology',
    specialtyAliases: ['cardiologist', 'cardiology', 'heart', 'heart specialist', 'cardiac'],
    city: 'Pune',
    hospital: 'Ruby Hall Clinic',
    address: '40, Sassoon Road, Pune 411001',
    qualifications: 'MBBS, MD, DNB (Cardiology)',
    experienceYears: 12,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 800,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 862,
    imageUrl:
      'https://images.unsplash.com/photo-1643297654416-05795d62e39c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmZW1hbGUlMjBkb2N0b3IlMjBzbWlsaW5nJTIwc3RldGhvc2NvcGV8ZW58MXwyfHx8MTc4NDk3NjQxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Non-invasive cardiologist focused on echocardiography, arrhythmia screening and women’s cardiac health.',
  },
  {
    doctorId: 'doc_pune_card_03',
    name: 'Dr. Vikram Patil',
    specialty: 'Cardiologist',
    specialtySlug: 'cardiology',
    specialtyAliases: ['cardiologist', 'cardiology', 'heart', 'heart specialist', 'cardiac'],
    city: 'Pune',
    hospital: 'Jehangir Hospital',
    address: '32, Sassoon Road, Pune 411001',
    qualifications: 'MBBS, MD, DM (Cardiology), FSCAI',
    experienceYears: 22,
    languages: ['English', 'Marathi'],
    consultationFee: 1100,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 1893,
    imageUrl:
      'https://images.unsplash.com/photo-1624697330553-3a4cca85514c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBtYWxlJTIwZG9jdG9yJTIwcG9ydHJhaXQlMjB3aGl0ZSUyMGNvYXR8ZW58MXwyfHx8MTc4NDk3NjQxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Senior structural heart specialist. Leads the TAVI and complex coronary intervention programme.',
  },
  {
    doctorId: 'doc_pune_derm_01',
    name: 'Dr. Sneha Joshi',
    specialty: 'Dermatologist',
    specialtySlug: 'dermatology',
    specialtyAliases: ['dermatologist', 'dermatology', 'skin', 'skin specialist'],
    city: 'Pune',
    hospital: 'Deenanath Mangeshkar Hospital',
    address: 'Erandwane, Pune 411004',
    qualifications: 'MBBS, MD (Dermatology)',
    experienceYears: 9,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 700,
    currency: 'INR',
    rating: 4.6,
    reviewCount: 534,
    imageUrl:
      'https://images.unsplash.com/photo-1626174586716-2154bdc15961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBmZW1hbGUlMjBkb2N0b3IlMjBzbWlsaW5nJTIwc3RldGhvc2NvcGV8ZW58MXwyfHx8MTc4NDk3NjQxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Clinical and aesthetic dermatology, acne scar revision and paediatric skin conditions.',
  },
  {
    doctorId: 'doc_pune_ortho_01',
    name: 'Dr. Aditya Rane',
    specialty: 'Orthopaedic Surgeon',
    specialtySlug: 'orthopaedics',
    specialtyAliases: [
      'orthopaedic',
      'orthopedic',
      'orthopaedics',
      'orthopedics',
      'bone',
      'joint',
      'knee',
    ],
    city: 'Pune',
    hospital: 'Sancheti Hospital',
    address: '16, Shivajinagar, Pune 411005',
    qualifications: 'MBBS, MS (Ortho), Fellowship in Joint Replacement',
    experienceYears: 15,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 850,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 1021,
    imageUrl:
      'https://images.unsplash.com/photo-1624280184411-d61e4ca10f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBtYWxlJTIwZG9jdG9yJTIwcG9ydHJhaXQlMjB3aGl0ZSUyMGNvYXR8ZW58MXwyfHx8MTc4NDk3NjQxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Robotic knee and hip replacement, sports injury and arthroscopy specialist.',
  },
  {
    doctorId: 'doc_pune_paed_01',
    name: 'Dr. Meera Iyer',
    specialty: 'Paediatrician',
    specialtySlug: 'paediatrics',
    specialtyAliases: ['paediatrician', 'pediatrician', 'paediatrics', 'pediatrics', 'child', 'kids'],
    city: 'Pune',
    hospital: 'KEM Hospital Pune',
    address: '489, Rasta Peth, Sardar Moodliar Road, Pune 411011',
    qualifications: 'MBBS, MD (Paediatrics)',
    experienceYears: 11,
    languages: ['English', 'Hindi', 'Tamil', 'Marathi'],
    consultationFee: 650,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 742,
    imageUrl:
      'https://images.unsplash.com/photo-1594879036995-b3ea9b53e793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBmZW1hbGUlMjBkb2N0b3IlMjBzbWlsaW5nJTIwc3RldGhvc2NvcGV8ZW58MXwyfHx8MTc4NDk3NjQxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Newborn care, childhood nutrition and immunisation counselling.',
  },
  {
    doctorId: 'doc_mum_card_01',
    name: 'Dr. Farhan Shaikh',
    specialty: 'Cardiologist',
    specialtySlug: 'cardiology',
    specialtyAliases: ['cardiologist', 'cardiology', 'heart', 'heart specialist', 'cardiac'],
    city: 'Mumbai',
    hospital: 'Lilavati Hospital',
    address: 'A-791, Bandra Reclamation, Bandra West, Mumbai 400050',
    qualifications: 'MBBS, MD, DM (Cardiology)',
    experienceYears: 16,
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 1400,
    currency: 'INR',
    rating: 4.8,
    reviewCount: 1560,
    imageUrl:
      'https://images.unsplash.com/photo-1633625576932-348e73c45e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXwyfHx8MTc4NDk3NjQzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Heart-failure and transplant cardiology; runs a dedicated cardiac rehab clinic.',
  },
  {
    doctorId: 'doc_mum_gyn_01',
    name: 'Dr. Priya Nair',
    specialty: 'Gynaecologist',
    specialtySlug: 'gynaecology',
    specialtyAliases: ['gynaecologist', 'gynecologist', 'gynaecology', 'obgyn', 'obstetrician'],
    city: 'Mumbai',
    hospital: 'Kokilaben Dhirubhai Ambani Hospital',
    address: 'Rao Saheb Achutrao Patwardhan Marg, Andheri West, Mumbai 400053',
    qualifications: 'MBBS, MS (OBGY), FMAS',
    experienceYears: 14,
    languages: ['English', 'Hindi', 'Malayalam'],
    consultationFee: 1200,
    currency: 'INR',
    rating: 4.9,
    reviewCount: 1330,
    imageUrl:
      'https://images.unsplash.com/photo-1749017818421-aadb344f32d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBmZW1hbGUlMjBkb2N0b3IlMjBzbWlsaW5nJTIwc3RldGhvc2NvcGV8ZW58MXwyfHx8MTc4NDk3NjQxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'High-risk pregnancy, laparoscopic gynaecology and fertility preservation.',
  },
  {
    doctorId: 'doc_blr_neuro_01',
    name: 'Dr. Karthik Reddy',
    specialty: 'Neurologist',
    specialtySlug: 'neurology',
    specialtyAliases: ['neurologist', 'neurology', 'brain', 'nerve', 'migraine'],
    city: 'Bengaluru',
    hospital: 'Manipal Hospital Old Airport Road',
    address: '98, HAL Old Airport Road, Bengaluru 560017',
    qualifications: 'MBBS, MD, DM (Neurology)',
    experienceYears: 13,
    languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
    consultationFee: 1000,
    currency: 'INR',
    rating: 4.7,
    reviewCount: 688,
    imageUrl:
      'https://images.unsplash.com/photo-1548964095-b9a292144866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHw2fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMG1hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXwyfHx8MTc4NDk3NjQzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Epilepsy, stroke thrombolysis and headache medicine.',
  },
  {
    doctorId: 'doc_del_gen_01',
    name: 'Dr. Neha Bansal',
    specialty: 'General Physician',
    specialtySlug: 'general-medicine',
    specialtyAliases: [
      'general physician',
      'general medicine',
      'physician',
      'gp',
      'family doctor',
      'internal medicine',
    ],
    city: 'Delhi',
    hospital: 'Max Super Speciality Hospital Saket',
    address: '1, 2, Press Enclave Road, Saket, New Delhi 110017',
    qualifications: 'MBBS, MD (Internal Medicine)',
    experienceYears: 8,
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 600,
    currency: 'INR',
    rating: 4.5,
    reviewCount: 410,
    imageUrl:
      'https://images.unsplash.com/photo-1631203883080-9e5338ebcf2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHw0fHxkb2N0b3IlMjB3aGl0ZSUyMGNvYXQlMjBzbWlsaW5nfGVufDF8Mnx8fDE3ODQ5NzY0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Diabetes, hypertension and preventive health check-ups.',
  },
];

/**
 * Calendar dates the demo directory publishes slots for.
 * `2026-07-28` is intentionally first: the guided demo conversation books the
 * 17:00 slot on that date, so it must always exist in the seeded data.
 */
export const SEED_DATES = ['2026-07-28', '2026-07-29', '2026-07-30'] as const;

/**
 * Per-doctor daily slot grid. Deliberately varied so `compare-slots` produces a
 * genuinely interesting side-by-side rather than identical columns.
 * Every entry MUST keep a 17:00 slot for the doctors used in the demo flow.
 */
const SLOT_GRID: Record<string, Array<{ start: string; mode: 'in-person' | 'video' }>> = {
  doc_pune_card_01: [
    { start: '09:30', mode: 'in-person' },
    { start: '10:00', mode: 'video' },
    { start: '11:30', mode: 'in-person' },
    { start: '16:30', mode: 'in-person' },
    { start: '17:00', mode: 'in-person' },
    { start: '18:00', mode: 'video' },
  ],
  doc_pune_card_02: [
    { start: '10:30', mode: 'in-person' },
    { start: '12:00', mode: 'video' },
    { start: '15:30', mode: 'in-person' },
    { start: '17:00', mode: 'video' },
    { start: '17:30', mode: 'in-person' },
  ],
  doc_pune_card_03: [
    { start: '08:30', mode: 'in-person' },
    { start: '09:00', mode: 'in-person' },
    { start: '14:00', mode: 'video' },
    { start: '17:00', mode: 'in-person' },
    { start: '19:00', mode: 'in-person' },
  ],
  doc_pune_derm_01: [
    { start: '11:00', mode: 'in-person' },
    { start: '13:30', mode: 'video' },
    { start: '17:00', mode: 'in-person' },
    { start: '18:30', mode: 'in-person' },
  ],
  doc_pune_ortho_01: [
    { start: '09:00', mode: 'in-person' },
    { start: '10:30', mode: 'in-person' },
    { start: '16:00', mode: 'video' },
    { start: '17:00', mode: 'in-person' },
  ],
  doc_pune_paed_01: [
    { start: '09:30', mode: 'in-person' },
    { start: '12:30', mode: 'video' },
    { start: '17:00', mode: 'in-person' },
    { start: '19:30', mode: 'in-person' },
  ],
  doc_mum_card_01: [
    { start: '10:00', mode: 'in-person' },
    { start: '11:00', mode: 'video' },
    { start: '17:00', mode: 'in-person' },
    { start: '20:00', mode: 'video' },
  ],
  doc_mum_gyn_01: [
    { start: '09:00', mode: 'in-person' },
    { start: '14:30', mode: 'video' },
    { start: '17:00', mode: 'in-person' },
  ],
  doc_blr_neuro_01: [
    { start: '10:00', mode: 'in-person' },
    { start: '15:00', mode: 'video' },
    { start: '17:00', mode: 'in-person' },
    { start: '18:30', mode: 'video' },
  ],
  doc_del_gen_01: [
    { start: '08:00', mode: 'in-person' },
    { start: '11:30', mode: 'in-person' },
    { start: '17:00', mode: 'video' },
    { start: '19:00', mode: 'in-person' },
  ],
};

/** Add 30 minutes to an `HH:mm` string. */
function addThirtyMinutes(time: string): string {
  const [hourPart, minutePart] = time.split(':');
  const total = Number(hourPart) * 60 + Number(minutePart) + 30;
  const hours = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Expand the slot grid into concrete slot documents for every seeded date.
 * A small deterministic rule pre-books a couple of mid-day slots so the
 * comparison view shows realistic scarcity instead of a fully open calendar.
 */
export function buildSeedSlots(): SlotEntity[] {
  const slots: SlotEntity[] = [];

  for (const doctor of SEED_DOCTORS) {
    const grid = SLOT_GRID[doctor.doctorId] ?? [];

    for (const date of SEED_DATES) {
      grid.forEach((entry, index) => {
        // Pre-book one non-17:00 slot per doctor per day for realism.
        const preBooked = entry.start !== '17:00' && index === 1 && date !== '2026-07-28';

        slots.push({
          slotId: `slot_${doctor.doctorId}_${date.replace(/-/g, '')}_${entry.start.replace(':', '')}`,
          doctorId: doctor.doctorId,
          date,
          startTime: entry.start,
          endTime: addThirtyMinutes(entry.start),
          mode: entry.mode,
          status: preBooked ? 'booked' : 'available',
          fee: doctor.consultationFee,
          bookingId: null,
        });
      });
    }
  }

  return slots;
}

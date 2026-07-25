import type { DoctorEntity } from './schemas/doctor.schema.js';
import type { BedEntity } from './schemas/bed.schema.js';
import type { MedicineEntity } from './schemas/medicine.schema.js';
import type { LabTestEntity } from './schemas/lab-test.schema.js';

const CITIES = ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Coimbatore', 'Kochi', 'Mysore', 'Madurai', 'Trivandrum'];
const HOSPITALS = ['Apollo', 'Fortis', 'Aster', 'Manipal', 'KIMS', 'Narayana', 'Kauvery', 'Sri Ramachandra', 'CMC', 'AIIMS'];
const SPECIALTIES = [
  { slug: 'cardiology', title: 'Cardiologist', aliases: ['heart', 'cardiac'] },
  { slug: 'orthopedics', title: 'Orthopedic Surgeon', aliases: ['bone', 'joint'] },
  { slug: 'neurology', title: 'Neurologist', aliases: ['brain', 'nerves'] },
  { slug: 'dermatology', title: 'Dermatologist', aliases: ['skin', 'hair'] },
  { slug: 'pediatrics', title: 'Pediatrician', aliases: ['child', 'kids'] },
  { slug: 'emergency', title: 'Emergency Medicine', aliases: ['trauma', 'casualty'] },
];

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Krishna', 'Ishan', 'Ananya', 'Diya', 'Sneha', 'Riya', 'Kavya', 'Neha', 'Pooja'];
const LAST_NAMES = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Rao', 'Nair', 'Menon', 'Iyer', 'Pillai', 'Desai', 'Joshi', 'Kulkarni'];

export function generateDoctors(count: number): DoctorEntity[] {
  const doctors: DoctorEntity[] = [];
  for (let i = 0; i < count; i++) {
    const spec = SPECIALTIES[i % SPECIALTIES.length];
    const city = CITIES[i % CITIES.length];
    const hospital = HOSPITALS[i % HOSPITALS.length];
    
    doctors.push({
      doctorId: `doc_${i}_${Date.now()}`,
      name: `Dr. ${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
      specialty: spec.title,
      specialtySlug: spec.slug,
      specialtyAliases: spec.aliases,
      city,
      hospital,
      address: `Main Branch, ${city}`,
      qualifications: 'MBBS, MD',
      experienceYears: 5 + (i % 25),
      languages: ['English', 'Hindi', 'Local Regional'],
      consultationFee: 500 + (i % 10) * 100,
      currency: 'INR',
      rating: 4.0 + ((i % 10) / 10),
      reviewCount: 100 + (i * 13) % 2000,
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5OTQ3NTl8MHwxfHNlYXJjaHwxfHxkb2N0b3J8ZW58MXwyfHx8MTc4NDk3NjQxNnw&ixlib=rb-4.1.0&q=80&w=1080',
      bio: `Experienced ${spec.title} practicing at ${hospital}, ${city}. Dedicated to providing excellent patient care.`,
      acceptsInsurance: i % 2 === 0,
      distance: (i % 20) + 1.5,
      estimatedWaitingTime: (i % 6) * 10,
    });
  }
  return doctors;
}

export function generateMedicines(count: number): MedicineEntity[] {
  const medicines: MedicineEntity[] = [];
  const prefixes = ['Para', 'Azi', 'Amox', 'Cipro', 'Diclo', 'Panto', 'Levo', 'Met'];
  const suffixes = ['cetamol', 'thromycin', 'cillin', 'floxacin', 'fenac', 'prazole', 'cetirizine', 'formin'];
  
  for (let i = 0; i < count; i++) {
    const name = `${prefixes[i % prefixes.length]}${suffixes[(i + 1) % suffixes.length]}`;
    medicines.push({
      medicineId: `med_${i}`,
      name: `${name} ${250 + (i % 4) * 250}mg`,
      stock: 100 + (i % 500),
      expiryDate: new Date(Date.now() + 31536000000), // 1 year from now
      availability: true,
      alternativeMedicines: [],
    });
  }
  return medicines;
}

export function generateBeds(count: number): BedEntity[] {
  const beds: BedEntity[] = [];
  const types = ['ICU', 'General', 'Emergency', 'NICU'];
  for (let i = 0; i < count; i++) {
    beds.push({
      bedId: `bed_${i}`,
      type: types[i % types.length] as any,
      status: i % 4 === 0 ? 'Occupied' : 'Available',
      hospital: HOSPITALS[i % HOSPITALS.length],
      lastUpdated: new Date(),
    });
  }
  return beds;
}

export function generateLabTests(): LabTestEntity[] {
  return [
    { testId: 'lab_1', name: 'Complete Blood Count (CBC)', price: 500, collectionStatus: 'Pending', reportStatus: 'Pending', expectedDelivery: new Date() },
    { testId: 'lab_2', name: 'Liver Function Test (LFT)', price: 800, collectionStatus: 'Pending', reportStatus: 'Pending', expectedDelivery: new Date() },
    { testId: 'lab_3', name: 'Kidney Function Test (KFT)', price: 800, collectionStatus: 'Pending', reportStatus: 'Pending', expectedDelivery: new Date() },
    { testId: 'lab_4', name: 'MRI Brain', price: 7500, collectionStatus: 'Pending', reportStatus: 'Pending', expectedDelivery: new Date() },
    { testId: 'lab_5', name: 'HbA1c', price: 600, collectionStatus: 'Pending', reportStatus: 'Pending', expectedDelivery: new Date() },
    { testId: 'lab_6', name: 'Lipid Profile', price: 700, collectionStatus: 'Pending', reportStatus: 'Pending', expectedDelivery: new Date() },
  ];
}

export const societies = [
  'Photography Club',
  'OWASP Student Chapter',
  'Thapar ACM Student Chapter',
  'Thapar Robotics Club',
  'Music and Dance Society',
  'Fine Arts Society',
  'Sports Society',
]

export const categories = [
  'Media & Film',
  'Robotics & Hardware',
  'Audio & Sound',
  'Stage Props & Lights',
  'Computing',
  'Sports & Recreation',
]

const specsFor = (category, index) => {
  if (category === 'Media & Film') return { Sensor: index % 2 ? 'APS-C CMOS' : 'Full-frame CMOS', Resolution: index % 2 ? '24.2 MP' : '33 MP', Video: '4K UHD', Mount: 'Sony E / adaptable' }
  if (category === 'Robotics & Hardware') return { Processor: index % 2 ? 'Quad-core 64-bit' : 'Dual-core MCU', Connectivity: 'Wi-Fi / Bluetooth', Included: 'Starter components', Power: 'USB-C / 5V' }
  if (category === 'Audio & Sound') return { Channels: '2-channel stereo', Connectivity: 'Wireless / XLR', Response: '20 Hz – 20 kHz', Power: 'Rechargeable' }
  if (category === 'Stage Props & Lights') return { Output: 'Full HD / RGB', Connectivity: 'DMX / HDMI', Mount: 'Portable stand', Power: 'AC adapter' }
  if (category === 'Computing') return { Resolution: 'Full HD', Connectivity: 'USB-C / HDMI', Compatibility: 'Windows / macOS', Included: 'Protective case' }
  return { Set: 'Club-ready kit', Material: 'Durable composite', Included: 'Carry bag', Level: 'Recreational' }
}

const itemSeed = [
  ['Sony A7 IV Camera', 'Media & Film', 'Photography Club', 2, 'Like New', 'Media Lab · Room 204', 'Camera', 4.9],
  ['Canon EOS R50', 'Media & Film', 'Photography Club', 3, 'Excellent', 'Media Lab · Room 204', 'Camera', 4.8],
  ['4K Video Camera', 'Media & Film', 'Photography Club', 2, 'Good', 'Media Lab · Room 204', 'Camera', 4.7],
  ['Professional Tripod', 'Media & Film', 'Photography Club', 5, 'Excellent', 'Media Lab · Room 204', 'Tripod', 4.8],
  ['LED Ring Light', 'Media & Film', 'Fine Arts Society', 4, 'Like New', 'Fine Arts Studio', 'Light', 4.6],
  ['Wireless Camera Microphone', 'Media & Film', 'Photography Club', 3, 'Good', 'Media Lab · Room 204', 'Mic', 4.7],
  ['Arduino Starter Kit', 'Robotics & Hardware', 'Thapar Robotics Club', 6, 'Excellent', 'Robotics Lab · B Block', 'Board', 4.9],
  ['Raspberry Pi 5 Kit', 'Robotics & Hardware', 'Thapar Robotics Club', 4, 'Like New', 'Robotics Lab · B Block', 'Board', 4.9],
  ['ESP32 Development Board', 'Robotics & Hardware', 'OWASP Student Chapter', 8, 'Good', 'Innovation Hub', 'Board', 4.6],
  ['Robotics Chassis Kit', 'Robotics & Hardware', 'Thapar Robotics Club', 3, 'Good', 'Robotics Lab · B Block', 'Robot', 4.7],
  ['Sensor Pack', 'Robotics & Hardware', 'Thapar Robotics Club', 7, 'Excellent', 'Robotics Lab · B Block', 'Board', 4.8],
  ['PA Speaker System', 'Audio & Sound', 'Music and Dance Society', 2, 'Good', 'Auditorium Store', 'Speaker', 4.9],
  ['Wireless Microphone Set', 'Audio & Sound', 'Music and Dance Society', 5, 'Excellent', 'Auditorium Store', 'Mic', 4.8],
  ['Audio Mixer', 'Audio & Sound', 'Music and Dance Society', 2, 'Like New', 'Auditorium Store', 'Mixer', 4.7],
  ['Studio Headphones', 'Audio & Sound', 'Photography Club', 6, 'Good', 'Media Lab · Room 204', 'Headphones', 4.6],
  ['LED PAR Lights', 'Stage Props & Lights', 'Music and Dance Society', 8, 'Excellent', 'Auditorium Store', 'Light', 4.8],
  ['Stage Fog Machine', 'Stage Props & Lights', 'Music and Dance Society', 2, 'Good', 'Auditorium Store', 'Fog', 4.5],
  ['Portable Projector', 'Stage Props & Lights', 'Thapar ACM Student Chapter', 3, 'Like New', 'ACM Lab · Room 110', 'Projector', 4.8],
  ['Event Backdrop Stand', 'Stage Props & Lights', 'Fine Arts Society', 3, 'Good', 'Fine Arts Studio', 'Stand', 4.5],
  ['Graphics Tablet', 'Computing', 'Thapar ACM Student Chapter', 4, 'Excellent', 'ACM Lab · Room 110', 'Tablet', 4.8],
  ['Portable Monitor', 'Computing', 'OWASP Student Chapter', 3, 'Like New', 'Innovation Hub', 'Monitor', 4.7],
  ['HDMI Capture Card', 'Computing', 'Thapar ACM Student Chapter', 5, 'Good', 'ACM Lab · Room 110', 'Board', 4.6],
  ['Football Set', 'Sports & Recreation', 'Sports Society', 4, 'Good', 'Sports Complex · Counter 2', 'Ball', 4.7],
  ['Badminton Racket Set', 'Sports & Recreation', 'Sports Society', 6, 'Excellent', 'Sports Complex · Counter 2', 'Racket', 4.8],
]

export const resources = itemSeed.map(([name, category, society, total, condition, location, art, rating], index) => ({
  id: `gear-${index + 1}`,
  name,
  category,
  society,
  total,
  condition,
  location,
  art,
  rating,
  maxDays: category === 'Sports & Recreation' ? 3 : 7,
  description: `${name} is shared by ${society} for student projects, workshops, and campus events. This demo listing includes verified condition notes and practical borrowing guidance.`,
  rules: ['Bring your student ID when collecting.', 'Keep the equipment in its protective case.', 'Return all included accessories with the item.'],
  specs: specsFor(category, index),
  manager: { name: 'Aarav Mehta', email: 'society.manager@campusvault.demo' },
  maintenance: index === 4 ? 1 : 0,
  addedAt: index < 3 ? 5 : 15 + index,
}))

const dateOffset = (offset) => {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offset)
  return date.toISOString().slice(0, 10)
}

export const makeDemoBookings = () => [
  {
    id: 'BK-581204',
    resourceId: 'gear-1',
    student: 'Ananya Sharma',
    society: 'Photography Club',
    quantity: 1,
    startDate: dateOffset(-2),
    startTime: '11:00 AM – 1:00 PM',
    endDate: dateOffset(2),
    endTime: '4:00 PM – 6:00 PM',
    purpose: 'Student documentary',
    notes: '',
    status: 'checked_out',
    createdAt: dateOffset(-4),
    returnRequested: false,
  },
  {
    id: 'BK-581219',
    resourceId: 'gear-12',
    student: 'Rohan Kapoor',
    society: 'Music and Dance Society',
    quantity: 1,
    startDate: dateOffset(1),
    startTime: '9:00 AM – 11:00 AM',
    endDate: dateOffset(3),
    endTime: '2:00 PM – 4:00 PM',
    purpose: 'Open mic evening',
    notes: 'Collect with speaker stands',
    status: 'pending',
    createdAt: dateOffset(0),
    returnRequested: false,
  },
  {
    id: 'BK-581167',
    resourceId: 'gear-7',
    student: 'Meera Iyer',
    society: 'Thapar Robotics Club',
    quantity: 2,
    startDate: dateOffset(-5),
    startTime: '9:00 AM – 11:00 AM',
    endDate: dateOffset(-1),
    endTime: '4:00 PM – 6:00 PM',
    purpose: 'Line-follower workshop',
    notes: '',
    status: 'returned',
    createdAt: dateOffset(-8),
    returnRequested: false,
  },
  {
    id: 'BK-581130',
    resourceId: 'gear-2',
    student: 'Kabir Singh',
    society: 'Photography Club',
    quantity: 1,
    startDate: dateOffset(2),
    startTime: '2:00 PM – 4:00 PM',
    endDate: dateOffset(4),
    endTime: '4:00 PM – 6:00 PM',
    purpose: 'Portrait workshop',
    notes: '',
    status: 'approved',
    createdAt: dateOffset(-1),
    returnRequested: false,
  },
  {
    id: 'BK-580998',
    resourceId: 'gear-8',
    student: 'Diya Malhotra',
    society: 'Thapar Robotics Club',
    quantity: 1,
    startDate: dateOffset(-12),
    startTime: '11:00 AM – 1:00 PM',
    endDate: dateOffset(-9),
    endTime: '2:00 PM – 4:00 PM',
    purpose: 'Prototype testing',
    notes: '',
    status: 'rejected',
    createdAt: dateOffset(-14),
    returnRequested: false,
    rejectionReason: 'The kit is reserved for a scheduled workshop.',
  },
  {
    id: 'BK-580721',
    resourceId: 'gear-13',
    student: 'Ishaan Verma',
    society: 'Music and Dance Society',
    quantity: 1,
    startDate: dateOffset(-9),
    startTime: '9:00 AM – 11:00 AM',
    endDate: dateOffset(-6),
    endTime: '2:00 PM – 4:00 PM',
    purpose: 'Rehearsal',
    notes: '',
    status: 'overdue',
    createdAt: dateOffset(-12),
    returnRequested: false,
  },
]

export const makeId = () => `BK-${Math.floor(100000 + Math.random() * 900000)}`
export const localDate = (date) => {
  const copy = new Date(date)
  copy.setHours(12, 0, 0, 0)
  return copy.toISOString().slice(0, 10)
}
export const isActiveBooking = (booking) => ['pending', 'approved', 'checked_out', 'overdue'].includes(booking.status)
export const overlaps = (aStart, aEnd, bStart, bEnd) => aStart <= bEnd && bStart <= aEnd

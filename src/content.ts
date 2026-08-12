export const assetUrl = (fileName: string) => `${import.meta.env.BASE_URL}assets/${fileName}`

export const profile = {
  name: 'Dylan Tsai',
  role: 'Aspiring SOC Analyst',
  programme: 'Diploma in Cybersecurity & Digital Forensics',
  school: 'Singapore Polytechnic',
  location: 'Singapore',
  email: 'dylantsai25@gmail.com',
  linkedin: 'https://www.linkedin.com/in/dylantsaiyiheng/',
  introduction:
    'I am a cybersecurity student building practical capability across threat detection, digital forensics, secure systems, and CTF-style problem solving.',
}

export const stats = [
  { value: '3.86', label: 'Current GPA' },
  { value: '1st', label: 'Runner-Up · BrainHack 2026' },
  { value: '5th', label: 'Place · Cyber Sports Day CTF' },
]

export const focusAreas = [
  {
    number: '01',
    title: 'Security operations',
    description: 'Learning the workflows that turn alerts into useful, evidence-based decisions.',
    tags: ['SOC triage', 'SIEM', 'Threat intelligence'],
  },
  {
    number: '02',
    title: 'Digital forensics',
    description: 'Developing disciplined investigation habits across evidence, systems, and incidents.',
    tags: ['Incident response', 'Linux security', 'Investigation'],
  },
  {
    number: '03',
    title: 'Offensive security',
    description: 'Using CTF challenges and web-security exercises to understand attacker thinking.',
    tags: ['Web security', 'CTFs', 'Reverse engineering'],
  },
]

export const experience = [
  {
    period: 'Mar - Apr 2026',
    title: 'DIS Sentinel Intern',
    organisation: 'DSO National Laboratories · Digital Division',
    description:
      'Completed an educational internship with exposure to initial SOC alert triage, basic GRC work, and security-exercise material creation.',
    tags: ['Elastic', 'Splunk', 'Recorded Future'],
  },
  {
    period: 'May 2025 - Present',
    title: 'Deputy Head of Events',
    organisation: 'Gryphons · Events & Operations',
    description:
      'Supports event organisation and CTF material creation, combining operational ownership with hands-on cybersecurity learning.',
    tags: ['Events', 'CTF design', 'Team leadership'],
  },
  {
    period: '2025 - 2026',
    title: 'Cybersecurity Trainer & Organiser',
    organisation: 'CyberBlitz and Youth Cyber Exploration Programme',
    description:
      'Created and delivered beginner-friendly cybersecurity materials, supported programme planning, and led the web stream for CyberBlitz 2026.',
    tags: ['Training', 'Web security', 'Programme delivery'],
  },
]

export const achievements = [
  {
    label: 'Competition result',
    title: 'Sentinel Challenge at BrainHack 2026',
    result: '1st Runner-Up',
    description: 'Team “mangos” placed 1st Runner-Up in the Sentinel Challenge CTF.',
    image: assetUrl('brainhack.webp'),
    alt: 'Team photo from the Sentinel Challenge at BrainHack 2026',
  },
  {
    label: 'Competition result',
    title: 'Sentinel Cyber Sports Day CTF',
    result: '5th Place',
    description: 'A team placement in a Polytechnic and ITE CTF challenge.',
    image: assetUrl('cyber-sports.webp'),
    alt: 'Team photo after receiving fifth place at Sentinel Cyber Sports Day',
  },
]

export const credentials = [
  {
    title: 'CTF participation',
    items: ['GCTF 2025', 'YBN CTF 2025', 'CTF 101 2025', 'Sieberrsec CTF 2026'],
  },
  {
    title: 'Technical learning',
    items: ['Introduction to Python', 'Intermediate Python', 'Data Manipulation with pandas', 'HTML Essential Training'],
  },
]

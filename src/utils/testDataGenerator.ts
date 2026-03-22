// Country configurations
export interface CountryConfig {
  code: string
  name: string
  ibanLength: number
  ibanBankCodeLength: number
  ibanAccountLength: number
  postcodeFormat: string
  postcodeRegex: RegExp
  addressFormat: string
  cities: string[]
  streets: string[]
  firstNames: string[]
  lastNames: string[]
}

export const countries: Record<string, CountryConfig> = {
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    ibanLength: 22,
    ibanBankCodeLength: 4,
    ibanAccountLength: 14,
    postcodeFormat: 'AA99 9AA',
    postcodeRegex: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/,
    addressFormat: '{number} {street}, {city}, {postcode}',
    cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Bristol', 'Sheffield', 'Edinburgh', 'Glasgow', 'Cardiff'],
    streets: ['High Street', 'Station Road', 'Church Lane', 'Park Avenue', 'Victoria Road', 'Queens Road', 'King Street', 'Mill Lane', 'The Green', 'Oak Drive'],
    firstNames: ['James', 'Oliver', 'William', 'Harry', 'George', 'Emma', 'Olivia', 'Sophia', 'Isabella', 'Charlotte'],
    lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Clark'],
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    ibanLength: 22,
    ibanBankCodeLength: 8,
    ibanAccountLength: 10,
    postcodeFormat: '99999',
    postcodeRegex: /^\d{5}$/,
    addressFormat: '{street} {number}, {postcode} {city}',
    cities: ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'],
    streets: ['Hauptstraße', 'Bahnhofstraße', 'Schulstraße', 'Gartenstraße', 'Bergstraße', 'Kirchstraße', 'Waldstraße', 'Ringstraße', 'Parkstraße', 'Mozartstraße'],
    firstNames: ['Lukas', 'Leon', 'Maximilian', 'Felix', 'Paul', 'Emma', 'Hannah', 'Mia', 'Sofia', 'Anna'],
    lastNames: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann'],
  },
  FR: {
    code: 'FR',
    name: 'France',
    ibanLength: 27,
    ibanBankCodeLength: 10,
    ibanAccountLength: 13,
    postcodeFormat: '99999',
    postcodeRegex: /^\d{5}$/,
    addressFormat: '{number} {street}, {postcode} {city}',
    cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    streets: ['Rue de la Paix', 'Avenue des Champs-Élysées', 'Boulevard Saint-Germain', 'Rue du Faubourg', 'Place de la République', 'Rue Victor Hugo', 'Avenue de la Liberté', 'Rue Nationale', 'Boulevard Pasteur', 'Rue Jean Jaurès'],
    firstNames: ['Gabriel', 'Louis', 'Raphaël', 'Jules', 'Adam', 'Emma', 'Louise', 'Jade', 'Alice', 'Chloé'],
    lastNames: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'],
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    ibanLength: 24,
    ibanBankCodeLength: 8,
    ibanAccountLength: 12,
    postcodeFormat: '99999',
    postcodeRegex: /^\d{5}$/,
    addressFormat: '{street} {number}, {postcode} {city}',
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Bilbao', 'Alicante'],
    streets: ['Calle Mayor', 'Calle Real', 'Avenida de la Constitución', 'Calle Nueva', 'Paseo del Prado', 'Gran Vía', 'Calle del Carmen', 'Avenida de España', 'Calle San Juan', 'Plaza Mayor'],
    firstNames: ['Hugo', 'Martín', 'Lucas', 'Daniel', 'Pablo', 'Lucía', 'Sofía', 'María', 'Martina', 'Paula'],
    lastNames: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres'],
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    ibanLength: 27,
    ibanBankCodeLength: 11,
    ibanAccountLength: 12,
    postcodeFormat: '99999',
    postcodeRegex: /^\d{5}$/,
    addressFormat: '{street} {number}, {postcode} {city}',
    cities: ['Roma', 'Milano', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna', 'Firenze', 'Bari', 'Venezia'],
    streets: ['Via Roma', 'Via Garibaldi', 'Via Dante', 'Via Mazzini', 'Via Nazionale', 'Corso Italia', 'Via Verdi', 'Via Milano', 'Via Cavour', 'Via Vittorio Emanuele'],
    firstNames: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia', 'Sofia', 'Aurora', 'Giulia', 'Giorgia', 'Alice'],
    lastNames: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco'],
  },
  PL: {
    code: 'PL',
    name: 'Poland',
    ibanLength: 28,
    ibanBankCodeLength: 8,
    ibanAccountLength: 16,
    postcodeFormat: '99-999',
    postcodeRegex: /^\d{2}-\d{3}$/,
    addressFormat: '{street} {number}, {postcode} {city}',
    cities: ['Warszawa', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
    streets: ['ul. Główna', 'ul. Polna', 'ul. Leśna', 'ul. Słoneczna', 'ul. Krótka', 'ul. Szkolna', 'ul. Ogrodowa', 'ul. Lipowa', 'ul. Brzozowa', 'ul. Kwiatowa'],
    firstNames: ['Antoni', 'Jakub', 'Jan', 'Szymon', 'Filip', 'Zuzanna', 'Julia', 'Maja', 'Zofia', 'Hanna'],
    lastNames: ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak'],
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    ibanLength: 18,
    ibanBankCodeLength: 4,
    ibanAccountLength: 10,
    postcodeFormat: '9999 AA',
    postcodeRegex: /^\d{4}\s?[A-Z]{2}$/,
    addressFormat: '{street} {number}, {postcode} {city}',
    cities: ['Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen'],
    streets: ['Kerkstraat', 'Hoofdstraat', 'Schoolstraat', 'Molenweg', 'Dorpsstraat', 'Nieuwstraat', 'Stationsweg', 'Marktstraat', 'Parkweg', 'Julianastraat'],
    firstNames: ['Noah', 'Daan', 'Levi', 'Sem', 'Lucas', 'Emma', 'Julia', 'Mila', 'Sophie', 'Zoë'],
    lastNames: ['De Jong', 'Jansen', 'De Vries', 'Van den Berg', 'Van Dijk', 'Bakker', 'Janssen', 'Visser', 'Smit', 'Meijer'],
  },
  US: {
    code: 'US',
    name: 'United States',
    ibanLength: 0, // US doesn't use IBAN
    ibanBankCodeLength: 0,
    ibanAccountLength: 0,
    postcodeFormat: '99999',
    postcodeRegex: /^\d{5}(-\d{4})?$/,
    addressFormat: '{number} {street}, {city}, {state} {postcode}',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
    streets: ['Main Street', 'Oak Avenue', 'Maple Drive', 'Cedar Lane', 'Pine Street', 'Elm Street', 'Washington Boulevard', 'Park Avenue', 'Lake Drive', 'Hill Road'],
    firstNames: ['Liam', 'Noah', 'Oliver', 'James', 'William', 'Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia'],
    lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'],
  },
  BE: {
    code: 'BE',
    name: 'Belgium',
    ibanLength: 16,
    ibanBankCodeLength: 3,
    ibanAccountLength: 9,
    postcodeFormat: '9999',
    postcodeRegex: /^\d{4}$/,
    addressFormat: '{street} {number}, {postcode} {city}',
    cities: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Mechelen'],
    streets: ['Rue de la Loi', 'Avenue Louise', 'Grote Markt', 'Meir', 'Groenplaats', 'Rue Neuve', 'Steenstraat', 'Hoogstraat', 'Veldstraat', 'Bondgenotenlaan'],
    firstNames: ['Lucas', 'Noah', 'Louis', 'Liam', 'Adam', 'Emma', 'Louise', 'Marie', 'Olivia', 'Charlotte'],
    lastNames: ['Peeters', 'Janssens', 'Maes', 'Jacobs', 'Willems', 'Claes', 'Goossens', 'Wouters', 'De Smedt', 'Dubois'],
  },
  LV: {
    code: 'LV',
    name: 'Latvia',
    ibanLength: 21,
    ibanBankCodeLength: 4,
    ibanAccountLength: 13,
    postcodeFormat: 'LV-9999',
    postcodeRegex: /^LV-\d{4}$/,
    addressFormat: '{street} {number}, {city}, {postcode}',
    cities: ['Rīga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils', 'Rēzekne', 'Valmiera', 'Jēkabpils', 'Ogre'],
    streets: ['Brīvības iela', 'Raiņa bulvāris', 'Čaka iela', 'Krišjāņa Barona iela', 'Elizabetes iela', 'Tērbatas iela', 'Dzirnavu iela', 'Lāčplēša iela', 'Stabu iela', 'Avotu iela'],
    firstNames: ['Jānis', 'Andris', 'Mārtiņš', 'Kārlis', 'Rihards', 'Anna', 'Līga', 'Ieva', 'Kristīne', 'Laura'],
    lastNames: ['Bērziņš', 'Kalniņš', 'Ozoliņš', 'Jansons', 'Liepiņš', 'Krūmiņš', 'Zeltiņš', 'Eglītis', 'Vītols', 'Zariņš'],
  },
  LT: {
    code: 'LT',
    name: 'Lithuania',
    ibanLength: 20,
    ibanBankCodeLength: 5,
    ibanAccountLength: 11,
    postcodeFormat: 'LT-99999',
    postcodeRegex: /^LT-\d{5}$/,
    addressFormat: '{street} {number}, {postcode} {city}',
    cities: ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Mažeikiai', 'Jonava', 'Utena'],
    streets: ['Gedimino prospektas', 'Vilniaus gatvė', 'Laisvės alėja', 'Savanorių prospektas', 'Vytauto gatvė', 'Kęstučio gatvė', 'Tilžės gatvė', 'Taikos prospektas', 'Dariaus ir Girėno gatvė', 'Šilutės plentas'],
    firstNames: ['Lukas', 'Matas', 'Jonas', 'Dominykas', 'Kajus', 'Emilija', 'Gabrielė', 'Austėja', 'Kamilė', 'Ugnė'],
    lastNames: ['Kazlauskas', 'Jankauskas', 'Petrauskas', 'Stankevičius', 'Vasiliauskas', 'Žukauskas', 'Butkus', 'Paulauskas', 'Urbonas', 'Kavaliauskas'],
  },
}

// Helper functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDigits(length: number): string {
  return Array.from({ length }, () => randomInt(0, 9)).toString().replace(/,/g, '')
}

function randomUpperLetters(length: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return Array.from({ length }, () => letters[randomInt(0, 25)]).join('')
}

// Name generator
export function generateName(countryCode: string): { firstName: string; lastName: string; fullName: string } {
  const country = countries[countryCode] || countries.GB
  const firstName = randomElement(country.firstNames)
  const lastName = randomElement(country.lastNames)
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
  }
}

// Email generator
export function generateEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'mail.com', 'proton.me']
  const separators = ['.', '_', '']
  const separator = randomElement(separators)
  const suffix = randomInt(0, 1) ? randomInt(1, 99).toString() : ''

  const namePart = `${firstName.toLowerCase()}${separator}${lastName.toLowerCase()}${suffix}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9._]/g, '')

  return `${namePart}@${randomElement(domains)}`
}

// Postcode generator
export function generatePostcode(countryCode: string): string {
  switch (countryCode) {
    case 'GB': {
      const areas = ['SW', 'NW', 'SE', 'NE', 'W', 'E', 'N', 'S', 'EC', 'WC', 'B', 'M', 'L', 'G', 'EH']
      const area = randomElement(areas)
      const district = randomInt(1, 20)
      const sector = randomInt(1, 9)
      const unit = randomUpperLetters(2)
      return `${area}${district} ${sector}${unit}`
    }
    case 'DE':
    case 'FR':
    case 'ES':
    case 'IT':
      return randomDigits(5)
    case 'PL':
      return `${randomDigits(2)}-${randomDigits(3)}`
    case 'NL':
      return `${randomDigits(4)} ${randomUpperLetters(2)}`
    case 'US':
      return randomDigits(5)
    case 'BE':
      return randomDigits(4)
    case 'LV':
      return `LV-${randomDigits(4)}`
    case 'LT':
      return `LT-${randomDigits(5)}`
    default:
      return randomDigits(5)
  }
}

// Address generator
export function generateAddress(countryCode: string): {
  street: string
  number: string
  city: string
  postcode: string
  fullAddress: string
  state?: string
} {
  const country = countries[countryCode] || countries.GB
  const street = randomElement(country.streets)
  const number = randomInt(1, 200).toString()
  const city = randomElement(country.cities)
  const postcode = generatePostcode(countryCode)

  // US states
  const usStates = ['NY', 'CA', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI']
  const state = countryCode === 'US' ? randomElement(usStates) : undefined

  let fullAddress = country.addressFormat
    .replace('{street}', street)
    .replace('{number}', number)
    .replace('{city}', city)
    .replace('{postcode}', postcode)

  if (state) {
    fullAddress = fullAddress.replace('{state}', state)
  }

  return { street, number, city, postcode, fullAddress, state }
}

// IBAN generator with correct checksum calculation
export function generateIBAN(countryCode: string): string | null {
  const country = countries[countryCode]

  if (!country || country.ibanLength === 0) {
    return null // Country doesn't use IBAN
  }

  // Generate bank code and account number
  const bankCode = randomDigits(country.ibanBankCodeLength)
  const accountNumber = randomDigits(country.ibanAccountLength)

  // Build BBAN (Basic Bank Account Number)
  const bban = bankCode + accountNumber

  // Calculate check digits using MOD-97 algorithm (ISO 7064)
  // 1. Move country code and check digits to end
  // 2. Replace letters with numbers (A=10, B=11, ..., Z=35)
  // 3. Calculate mod 97

  const countryCodeNumeric = countryCode
    .split('')
    .map(char => (char.charCodeAt(0) - 55).toString())
    .join('')

  // Temporary IBAN with 00 as check digits
  const tempIban = bban + countryCodeNumeric + '00'

  // Calculate mod 97 on the numeric string
  const checksum = 98 - mod97(tempIban)
  const checkDigits = checksum.toString().padStart(2, '0')

  return `${countryCode}${checkDigits}${bban}`
}

// MOD-97 calculation for large numbers (as strings)
function mod97(numStr: string): number {
  let remainder = 0
  for (let i = 0; i < numStr.length; i++) {
    remainder = (remainder * 10 + parseInt(numStr[i], 10)) % 97
  }
  return remainder
}

// Validate IBAN checksum
export function validateIBAN(iban: string): boolean {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase()

  if (cleanIban.length < 15) return false

  // Move first 4 characters to end
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4)

  // Replace letters with numbers
  const numeric = rearranged
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      if (code >= 65 && code <= 90) {
        return (code - 55).toString()
      }
      return char
    })
    .join('')

  // Check if mod 97 equals 1
  return mod97(numeric) === 1
}

// Format IBAN with spaces
export function formatIBAN(iban: string): string {
  const clean = iban.replace(/\s/g, '')
  return clean.match(/.{1,4}/g)?.join(' ') || clean
}

// Generate all data at once
export interface GeneratedData {
  name: { firstName: string; lastName: string; fullName: string }
  email: string
  address: {
    street: string
    number: string
    city: string
    postcode: string
    fullAddress: string
    state?: string
  }
  iban: string | null
  ibanFormatted: string | null
}

export function generateAllData(countryCode: string): GeneratedData {
  const name = generateName(countryCode)
  const email = generateEmail(name.firstName, name.lastName)
  const address = generateAddress(countryCode)
  const iban = generateIBAN(countryCode)

  return {
    name,
    email,
    address,
    iban,
    ibanFormatted: iban ? formatIBAN(iban) : null,
  }
}

// Generate multiple records
export function generateMultipleData(countryCode: string, count: number): GeneratedData[] {
  return Array.from({ length: count }, () => generateAllData(countryCode))
}

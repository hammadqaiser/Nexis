import { Pool } from 'pg';

// In-memory fallback database for local testing without Postgres
const mockDb = {
  shipments: {} as Record<string, any>,
  contacts: [] as any[],
  franchises: [] as any[],
  careers: [] as any[],
};

// Check if PostgreSQL URL is provided
const pgUrl = process.env.DATABASE_URL;
let pool: Pool | null = null;

if (pgUrl) {
  try {
    pool = new Pool({
      connectionString: pgUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });
    console.log('PostgreSQL client pool initialized.');
  } catch (err) {
    console.error('Failed to initialize PostgreSQL pool:', err);
  }
} else {
  console.log('DATABASE_URL is not set. Falling back to local in-memory store.');
}

// Helper to run queries
export async function dbQuery(text: string, params?: any[]) {
  if (pool) {
    const res = await pool.query(text, params);
    return res;
  }
  throw new Error('Database not connected');
}

// Self-healing database initializer
export async function initDb() {
  if (!pool) {
    console.log('Mock database initialized (no PostgreSQL).');
    return true;
  }

  try {
    console.log('Initializing PostgreSQL schemas...');

    // 1. Shipments Table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS shipments (
        awb VARCHAR(50) PRIMARY KEY,
        sender_name VARCHAR(100) NOT NULL,
        sender_phone VARCHAR(50) NOT NULL,
        sender_email VARCHAR(100),
        sender_city VARCHAR(50) NOT NULL,
        sender_address TEXT NOT NULL,
        recipient_name VARCHAR(100) NOT NULL,
        recipient_phone VARCHAR(50) NOT NULL,
        recipient_email VARCHAR(100),
        recipient_city VARCHAR(50) NOT NULL,
        recipient_address TEXT NOT NULL,
        weight DECIMAL(10, 2) NOT NULL,
        pieces INT NOT NULL DEFAULT 1,
        service_tier VARCHAR(50) NOT NULL,
        cod_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        declared_value DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        status VARCHAR(50) NOT NULL DEFAULT 'Booked',
        checkpoints JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Contacts Table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Franchises Table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS franchises (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        city VARCHAR(50) NOT NULL,
        location VARCHAR(200) NOT NULL,
        investment VARCHAR(100) NOT NULL,
        experience TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Careers Table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS careers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        city VARCHAR(50) NOT NULL,
        cv_url TEXT,
        cover_letter TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('PostgreSQL database schemas successfully verified/created.');
    return true;
  } catch (err) {
    console.error('Error initializing PostgreSQL tables:', err);
    return false;
  }
}

// Shipment DB Functions
export async function saveShipment(shipment: any) {
  const awb = shipment.awb;
  const initialCheckpoints = [
    {
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: shipment.senderCity + ' Hub',
      activity: 'Shipment Booked',
      description: 'Airway Bill generated. Package is ready for pickup by NEXIS Courier Rider.',
    }
  ];

  const dbShipment = {
    awb,
    sender_name: shipment.senderName,
    sender_phone: shipment.senderPhone,
    sender_email: shipment.senderEmail || '',
    sender_city: shipment.senderCity,
    sender_address: shipment.senderAddress,
    recipient_name: shipment.recipientName,
    recipient_phone: shipment.recipientPhone,
    recipient_email: shipment.recipientEmail || '',
    recipient_city: shipment.recipientCity,
    recipient_address: shipment.recipientAddress,
    weight: parseFloat(shipment.weight) || 0.5,
    pieces: parseInt(shipment.pieces) || 1,
    service_tier: shipment.serviceTier,
    cod_amount: parseFloat(shipment.codAmount) || 0.0,
    declared_value: parseFloat(shipment.declaredValue) || 0.0,
    status: 'Booked',
    checkpoints: initialCheckpoints,
  };

  if (pool) {
    try {
      await dbQuery(
        `INSERT INTO shipments (
          awb, sender_name, sender_phone, sender_email, sender_city, sender_address,
          recipient_name, recipient_phone, recipient_email, recipient_city, recipient_address,
          weight, pieces, service_tier, cod_amount, declared_value, status, checkpoints
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          dbShipment.awb,
          dbShipment.sender_name,
          dbShipment.sender_phone,
          dbShipment.sender_email,
          dbShipment.sender_city,
          dbShipment.sender_address,
          dbShipment.recipient_name,
          dbShipment.recipient_phone,
          dbShipment.recipient_email,
          dbShipment.recipient_city,
          dbShipment.recipient_address,
          dbShipment.weight,
          dbShipment.pieces,
          dbShipment.service_tier,
          dbShipment.cod_amount,
          dbShipment.declared_value,
          dbShipment.status,
          JSON.stringify(dbShipment.checkpoints),
        ]
      );
      console.log(`Shipment ${awb} saved to PostgreSQL.`);
      return dbShipment;
    } catch (err) {
      console.error(`Failed to save shipment ${awb} to Postgres, falling back to mock:`, err);
    }
  }

  // Fallback to local in-memory DB
  mockDb.shipments[awb] = dbShipment;
  console.log(`Shipment ${awb} saved to in-memory store.`);
  return dbShipment;
}

export async function getShipment(awb: string) {
  const cleanAwb = awb.trim().toUpperCase();

  if (pool) {
    try {
      const res = await dbQuery('SELECT * FROM shipments WHERE UPPER(awb) = $1', [cleanAwb]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        // Map postgres snake_case back to client camelCase
        return {
          awb: row.awb,
          status: row.status,
          service: row.service_tier,
          estDelivery: row.service_tier.includes('Express') ? 'Within 24 Hours' : '2-3 Business Days',
          origin: row.sender_city,
          destination: row.recipient_city,
          shipper: row.sender_name,
          consignee: row.recipient_name,
          weight: parseFloat(row.weight),
          pieces: row.pieces,
          codAmount: parseFloat(row.cod_amount),
          checkpoints: typeof row.checkpoints === 'string' ? JSON.parse(row.checkpoints) : row.checkpoints,
        };
      }
    } catch (err) {
      console.error(`Error querying shipment ${cleanAwb} from PostgreSQL:`, err);
    }
  }

  // Fallback to local in-memory DB
  if (mockDb.shipments[cleanAwb]) {
    const row = mockDb.shipments[cleanAwb];
    return {
      awb: row.awb,
      status: row.status,
      service: row.service_tier,
      estDelivery: row.service_tier.includes('Express') ? 'Within 24 Hours' : '2-3 Business Days',
      origin: row.sender_city,
      destination: row.recipient_city,
      shipper: row.sender_name,
      consignee: row.recipient_name,
      weight: row.weight,
      pieces: row.pieces,
      codAmount: row.cod_amount,
      checkpoints: row.checkpoints,
    };
  }

  return null;
}

// Contacts/Inquiries DB Functions
export async function saveContact(contact: { name: string; phone: string; email: string; subject: string; message: string }) {
  if (pool) {
    try {
      await dbQuery(
        'INSERT INTO contacts (name, phone, email, subject, message) VALUES ($1, $2, $3, $4, $5)',
        [contact.name, contact.phone, contact.email, contact.subject, contact.message]
      );
      console.log('Contact message saved to PostgreSQL.');
      return true;
    } catch (err) {
      console.error('Failed to save contact query to Postgres:', err);
    }
  }

  mockDb.contacts.push(contact);
  console.log('Contact message saved to in-memory store.');
  return true;
}

// Franchise Applications DB Functions
export async function saveFranchise(franchise: { name: string; phone: string; email: string; city: string; location: string; investment: string; experience: string }) {
  if (pool) {
    try {
      await dbQuery(
        'INSERT INTO franchises (name, phone, email, city, location, investment, experience) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [franchise.name, franchise.phone, franchise.email, franchise.city, franchise.location, franchise.investment, franchise.experience]
      );
      console.log('Franchise application saved to PostgreSQL.');
      return true;
    } catch (err) {
      console.error('Failed to save franchise application to Postgres:', err);
    }
  }

  mockDb.franchises.push(franchise);
  console.log('Franchise application saved to in-memory store.');
  return true;
}

// Careers / Job Applications DB Functions
export async function saveCareer(career: { name: string; phone: string; email: string; position: string; city: string; cvUrl?: string; coverLetter: string }) {
  if (pool) {
    try {
      await dbQuery(
        'INSERT INTO careers (name, phone, email, position, city, cv_url, cover_letter) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [career.name, career.phone, career.email, career.position, career.city, career.cvUrl || '', career.coverLetter]
      );
      console.log('Career application saved to PostgreSQL.');
      return true;
    } catch (err) {
      console.error('Failed to save career application to Postgres:', err);
    }
  }

  mockDb.careers.push(career);
  console.log('Career application saved to in-memory store.');
  return true;
}

// Try running the init script immediately upon load
if (pool) {
  initDb().then(ok => {
    if (ok) console.log('Database auto-initialization successful.');
  });
}

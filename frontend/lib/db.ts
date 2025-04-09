import { PrismaClient } from '@prisma/client'

// For handling type augmentation on the global object
const globalForPrisma = global as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  try {
    const client = new PrismaClient({
      log: ['error'],
      errorFormat: 'pretty',
    })
    
    // Test connection
    client.$connect().then(() => {
      console.log('✅ Database connection established successfully')
    }).catch((err) => {
      console.error('❌ Database connection failed:', err)
    })
    
    return client
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    // Return a mock client that won't crash the app
    return createMockPrismaClient()
  }
}

// Fallback mock client when database connection fails
function createMockPrismaClient() {
  console.warn('🚨 Using mock Prisma client - data will not be persisted')
  
  const mockData = {
    leads: [
      {
        id: 'mock-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        company: 'Acme Inc',
        message: 'Interested in your services',
        score: 8,
        category: 'HOT',
        reason: 'High intent lead',
        action: 'Contact immediately',
        createdAt: new Date()
      }
    ]
  }
  
  return {
    lead: {
      findMany: async () => mockData.leads,
      create: async ({ data }: any) => ({ id: 'mock-' + Date.now(), ...data, createdAt: new Date() }),
      findUnique: async ({ where }: any) => mockData.leads.find(l => l.id === where.id),
      update: async ({ where, data }: any) => ({ ...mockData.leads.find(l => l.id === where.id), ...data }),
      delete: async () => ({}),
      count: async () => mockData.leads.length
    },
    $on: () => {},
    $connect: async () => {},
    $disconnect: async () => {}
  } as unknown as PrismaClient
}

// Try to use existing prisma instance if available, otherwise create a new one
export const prisma = globalForPrisma.prisma || createPrismaClient()

// Save the client for reuse in development to avoid too many client instances
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 
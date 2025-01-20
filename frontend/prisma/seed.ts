const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const testLeads = [
    {
      name: 'John Smith',
      email: 'john@enterprise.com',
      phone: '555-0123',
      company: 'Enterprise Co',
      message: 'Interested in AI solutions',
      score: 8,
      category: 'HOT',
      reason: 'Decision maker with clear budget',
      action: 'Follow up within 24 hours'
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@startup.io',
      phone: '555-0456',
      company: 'Startup Inc',
      message: 'Looking for automation',
      score: 6,
      category: 'WARM',
      reason: 'Shows interest but no timeline',
      action: 'Schedule discovery call'
    }
  ]

  for (const lead of testLeads) {
    await prisma.lead.create({ data: lead })
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
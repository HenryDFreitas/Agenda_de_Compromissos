import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.compromisso.deleteMany({});
  console.log(`Deletados TODOS os ${result.count} compromissos do banco.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

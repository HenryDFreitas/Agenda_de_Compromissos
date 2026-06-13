import supertest from 'supertest';
import server from '../app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
    // Agora o Prisma vai ler o DATABASE_URL do .env automaticamente!
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

export const testServer = supertest(server);
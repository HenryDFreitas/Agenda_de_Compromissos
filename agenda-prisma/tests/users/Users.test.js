import { describe, beforeAll, it, expect } from '@jest/globals';
import { testServer } from '../jest.setup';

describe('Create - Users', () => {

    let accessToken = '';
    let createdUserId = '';
    let adminEmail = `admin_${Date.now()}@example.com`;

    beforeAll(async () => {
        // Cria um admin para os testes
        await testServer
            .post('/api/user')
            .send({ name: 'Admin User', email: adminEmail, password: '123456' });
            
        // Faz login para obter o token
        const signInRes = await testServer
            .post('/api/user/login')
            .send({ email: adminEmail, password: '123456' });

        accessToken = signInRes.body.token;
    });


    describe('Criação de Usuário (POST /api/user)', () => {
        it('Cria usuario', async () => {
            const dynamicEmail = `testuser_${Date.now()}@example.com`;
            const res = await testServer
                .post('/api/user') 
                .send({ name: 'Test User', 
                        email: dynamicEmail, 
                        password: '123456' })
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(201); 
            expect(res.body).toHaveProperty('id'); 

            
            createdUserId = res.body.id; // Guarda o ID para testes futuros
        });

        it('Cria usuario com nome pequeno', async () => {
            const dynamicEmail = `testuser_inv_${Date.now()}@example.com`;
            const res = await testServer
                .post('/api/user')
                .send({ 
                    name: 'ba', // Nome < 3 caracteres
                    email: dynamicEmail,  
                    password: '123456' })
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toHaveProperty('name');
        });

        it('Cria usuario com email ja existente', async () => {
            const res = await testServer
                .post('/api/user')
                .send({ 
                    name: 'Duplicate User', 
                    email: adminEmail,
                    password: '123456' })
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toHaveProperty('email');
        });

                it('Cria usuario sem email', async () => {
            const res = await testServer
                .post('/api/user')
                .send({ 
                    name: 'Duplicate User', 
                    password: '123456' })
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toHaveProperty('email');
        });

                        it('Cria usuario com email errado', async () => {
            const res = await testServer
                .post('/api/user')
                .send({ 
                    name: 'Duplicate User', 
                    email: 'invalid-email',
                    password: '123456' })
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toHaveProperty('email');
        });

                it('Cria usuario com senha errada', async () => {
            const res = await testServer
                .post('/api/user/login')
                .send({ email: adminEmail, password: 'wrongpassword' });

            expect(res.statusCode).toBe(400);
            expect(res.body.errors.default).toBe('E-mail ou senha inválidos.');
        });

                it('Cria usuario com senha curta', async () => {
            const res = await testServer
                .post('/api/user/login')
                .send({ email: adminEmail, password: '12345' });

            expect(res.statusCode).toBe(400);
            expect(res.body.errors.default).toBe('E-mail ou senha inválidos.');
        });
    });








});

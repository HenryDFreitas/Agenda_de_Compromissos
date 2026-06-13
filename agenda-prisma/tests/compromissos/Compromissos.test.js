import { describe, beforeAll, it, expect } from '@jest/globals';
import { testServer } from '../jest.setup';

describe('Create - Compromissos', () => {

    let accessToken = '';

    beforeAll(async () => {
        const email = `admin_comp_${Date.now()}@example.com`;

        // Cria o usuário para os testes
        await testServer
            .post('/api/user')
            .send({ name: 'Admin Compromisso', email, password: '123456' });
            
        // Faz login para obter o token
        const signInRes = await testServer
            .post('/api/user/login')
            .send({ email, password: '123456' });

        accessToken = signInRes.body.token;
    });

    const getDatasValidas = () => {
        const base = Date.now() + Math.floor(Math.random() * 10000000000) + 86400000;
        return {
            inicio: new Date(base).toISOString(),
            fim: new Date(base + 3600000).toISOString() // 1 hora de duração
        };
    };

    it('Criando compromisso', async () => {
        const { inicio, fim } = getDatasValidas();
        const res = await testServer
            .post('/api/compromissos')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                titulo: 'Reunião de Alinhamento',
                status: 'AGENDADO',
                inicio,
                fim
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
    });

    it('Criando compromisso sem token)', async () => {
        const { inicio, fim } = getDatasValidas();
        const res = await testServer
            .post('/api/compromissos')
            .send({
                titulo: 'Reunião',
                inicio,
                fim
            });

        expect(res.statusCode).toBe(401);
    });

    it('Criando compromisso sem título', async () => {
        const { inicio, fim } = getDatasValidas();
        const res = await testServer
            .post('/api/compromissos')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                inicio,
                fim
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toMatch(/título é obrigatório/i);
    });

    it('Criando compromisso sem data de inicio', async () => {
        const { inicio, fim } = getDatasValidas();
        const res = await testServer
            .post('/api/compromissos')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                titulo: 'Reunião',
                fim
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toMatch(/início deve ser uma data válida|inicio deve ser uma data válida/i);
    });

    it('Criando compromisso sem data de fim', async () => {
        const { inicio } = getDatasValidas();
        const res = await testServer
            .post('/api/compromissos')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                titulo: 'Reunião',
                inicio
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toMatch(/fim deve ser uma data válida/i);
    });
    
    it('Criando compromisso com a data de fim menor que a data de início', async () => {
        const { inicio, fim } = getDatasValidas();
        const res = await testServer
            .post('/api/compromissos')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                titulo: 'Reunião Invertida',
                inicio: fim, // fim é maior que inicio
                fim: inicio  // inicio é menor que fim
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toMatch(/fim deve ser maior que inicio/i);
    });

    it('Criando compromisso com status inválido', async () => {
        const { inicio, fim } = getDatasValidas();
        const res = await testServer
            .post('/api/compromissos')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                titulo: 'Reunião',
                inicio,
                fim,
                status: 'INVALIDO'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toMatch(/Status inválido/i);
    });
});
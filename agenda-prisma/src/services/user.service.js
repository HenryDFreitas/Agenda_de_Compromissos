import {prisma} from '../config/prisma.js';
import {AppError} from '../errors/AppError.js';



function validarPayLoad(dados) {

    if (!dados.nome || dados.nome.trim() === '') {
        throw new AppError('O nome é obrigatório', 400);
    }
    
    if (!dados.email || dados.email.trim() === '') {
        throw new AppError('O email é obrigatório', 400);
    }

    if (!dados.password || dados.password.trim() === '') {
        throw new AppError('A senha é obrigatória', 400);
    }
}

export async function listarTodos(filtros = {}) {
    const where = {};

    if (filtros.name) {
        where.name = filtros.name;
    }

    if (filtros.email) {
        where.email = filtros.email;
    }

    return prisma.user.findMany({
        where,
        orderBy: { name: 'asc' }
    });
}

export async function buscarPorId(id){
    const item = await prisma.user.findUnique({
        where: {id}
    });

    if (!item) {
        throw new AppError('User não encontrado', 404);
    }

    return item;
}

export async function getByEmail(email) {
    return await prisma.user.findUnique({
        where: { email }
    });
}

export async function registrar(dados) {
    return prisma.user.create({
        data:{
            name: dados.name.trim(),
            email: dados.email.trim(),
            password: dados.password.trim()
        }
    });
}

export async function login(email){
    return await prisma.user.findUnique({
        where: {email}
    });
}

export async function atualizar(id, dados) {
    const atual = await prisma.user.findUnique({
        where: {id}
    });

    if(!atual) {
        throw new AppError('User não encontrado', 404);
    }

    const payload = {
        name: dados.name ?? atual.name,
        email: dados.email ?? atual.email,
        password: dados.password ?? atual.password
    };

    return prisma.user.update({
        where: {id},
        data: {
            name: payload.name.trim(),
            email: payload.email.trim(),
            password: payload.password.trim()
        }
    });
}

export async function excluir(id){
    const atual = await prisma.user.findUnique({
        where: {id}
    });

    if (!atual) {
        throw new AppError('User não encontrado', 404);
    }

    await prisma.user.delete({
        where: {id}
    });

    return {
        mensagem: 'User excluido com sucesso',
        item: atual
    };
}

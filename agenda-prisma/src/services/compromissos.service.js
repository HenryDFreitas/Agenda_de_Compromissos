import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/AppError.js';

const STATUS_VALIDOS = ['AGENDADO', 'CONCLUIDO', 'CANCELADO'];

// Validação de datas e status: Inserção e validação dos dados inseridos (Part 1)
function paraData(valor, nomeCampo) {
    const data = new Date(valor);

    // o isNaN (is Not a Number) é uma função que verifica se o valor é um número ou não
    if (Number.isNaN(data.getTime())){
        throw new AppError(`O campo ${nomeCampo} deve ser uma data válida`, 400);
    }
    return data;
}

// Validação de datas e status: resto da Inserção (Part 2)
function validarPayload(dados) {
    if (!dados.titulo || !dados.titulo.trim()){
        throw new AppError('O campo título é obrigatório', 400);
    }

    const inicio = paraData(dados.inicio, 'inicio');
    const fim = paraData(dados.fim, 'fim');

    if (fim <= inicio) {
        throw new AppError('O campo fim deve ser maior que inicio', 400);
    }

    if (dados.status && !STATUS_VALIDOS.includes(dados.status)) {
        throw new AppError('Status inválido', 400);
    }
    return { inicio, fim };
}

// Valida o Conflito do Horário inicio e fim
async function validarConflitoHorario({ inicio, fim, idIgnorado, userId }) {
    const where = {
        userId,
        status: { not: 'CANCELADO' },
        inicio: { lt: fim },
        fim: { gt: inicio }
    };

    if (idIgnorado) {
        where.NOT = { id: idIgnorado };
    }

    const conflito = await prisma.compromisso.findFirst({ where });

    if (conflito) {
        throw new AppError('Já existe compromisso nesse intervalo de horário', 409);
    }
}

// Listar Todos (filtros)
export async function listarTodos(userId, filtros = {}) {
    const where = { userId };

    if(filtros.status) {
        where.status = filtros.status.toUpperCase();
    }

    if (filtros.data) {
        const inicioDia = new Date(`${filtros.data}T00:00:00.000Z`);
        const fimDia = new Date(`${filtros.data}T23:59:59.999Z`);

        if(Number.isNaN(inicioDia.getTime()) || Number.isNaN(fimDia.getTime())) {
            throw new AppError('Filtro de data inválido. Use o formato YYYY-MM-DD', 400);
        }

        //Greater Than or Equal | Less Than or Equal | operadores do Prisma.
        where.inicio = {
            gte: inicioDia,
            lte: fimDia
        };
    }

    const page = parseInt(filtros.page) || 1;
    const limit = parseInt(filtros.limit) || 10;
    const skip = (page - 1) * limit;

    return prisma.compromisso.findMany({
        where,
        orderBy: { inicio: 'asc' },
        skip,
        take: limit
    });
}

// Busca por ID (Corrigido para bater com o import do controller)
export async function buscarPorId(userId, id) {
    const item = await prisma.compromisso.findUnique({
        where: { id }
    });

    if (!item || item.userId !== userId) {
        throw new AppError('Compromisso não encontrado', 404);
    }

    return item;
}

// Criar (dados)
export async function criar(userId, dados) {
    const { inicio, fim } = validarPayload(dados);

    await validarConflitoHorario({ inicio, fim, userId });

    // O trim() remove os espaços extras
    return prisma.compromisso.create({
        data: {
            userId,
            titulo: dados.titulo.trim(),
            descricao: dados.descricao?.trim() || null,
            local: dados.local?.trim() || null,
            observacoes: dados.observacoes?.trim() || null,
            inicio,
            fim,
            status: (dados.status || 'AGENDADO').toUpperCase()
        }
    });
}

// Atualizar (id, dados)
export async function atualizar(userId, id, dados) {
    const atual = await prisma.compromisso.findUnique({ where: { id } });

    if (!atual || atual.userId !== userId) {
        throw new AppError('Compromisso não encontrado', 404);
    }

    const payload = {
        titulo:      dados.titulo ?? atual.titulo,
        descricao:   dados.descricao ?? atual.descricao,
        local:       dados.local ?? atual.local,
        observacoes: dados.observacoes ?? atual.observacoes,
        inicio:      dados.inicio ?? atual.inicio,
        fim:         dados.fim ?? atual.fim,
        status:      (dados.status ?? atual.status).toUpperCase()
    };

    const { inicio, fim } = validarPayload(payload);
    const status = payload.status;

    await validarConflitoHorario({
        inicio,
        fim,
        idIgnorado: id,
        userId
    });

    return prisma.compromisso.update({
        where: { id },
        data: {
            titulo:      payload.titulo.trim(),
            descricao:   payload.descricao?.trim() || null,
            local:       payload.local?.trim() || null,
            observacoes: payload.observacoes?.trim() || null,
            inicio,
            fim,
            status
        }
    });
}

// atualizarStatus(id, status)
export async function atualizarStatus(userId, id, status) {
    if (!status) {
        throw new AppError('O campo status é obrigatório', 400);
    }

    const statusNormalizado = status.toUpperCase();

    if (!STATUS_VALIDOS.includes(statusNormalizado)) {
        throw new AppError('Status inválido', 400);
    }

    const atual = await prisma.compromisso.findUnique({
        where: { id }
    });

    if (!atual || atual.userId !== userId) {
        throw new AppError('Compromisso não encontrado', 404);
    }

    return prisma.compromisso.update({
        where: { id },
        data: { status: statusNormalizado }
    });
}

// remover(id) 
export async function remover(userId, id) {
    const atual = await prisma.compromisso.findUnique({
        where: { id }
    });

    if (!atual || atual.userId !== userId) {
        throw new AppError('Compromisso não encontrado', 404);
    }

    await prisma.compromisso.delete({
        where: { id }
    });

    return {
        mensagem: 'Compromisso removido com sucesso',
    };
}
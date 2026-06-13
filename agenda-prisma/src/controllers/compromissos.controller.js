import * as compromissosService from '../services/compromissos.service.js';

// Lista todas as tarefas no banco de dados, com suporte a filtros de data e status
export async function listar(req, res, next) {
    try {
        const userId = req.headers.idUsuario;
        const dados = await compromissosService.listarTodos(userId, req.query);
        res.status(200).json(dados);
    } catch (error) {next(error);}
}

// Busca a tarefa por ID
export async function buscarPorId(req, res, next) {
    try {
        const userId = req.headers.idUsuario;
        const item = await compromissosService.buscarPorId(userId, req.params.id);
        res.status(200).json(item);
    } catch (error) {next(error);}
}

// Cria a tarefa no banco de dados, validando os dados de entrada e verificando conflitos de horário
export async function criar(req, res, next) {
    try {
        const userId = req.headers.idUsuario;
        const novo = await compromissosService.criar(userId, req.body);
        res.status(201).json(novo);
    }catch (error) {next(error);}
}

// Atualiza os dados da tarefa cadastrado no banco de dados
export async function atualizar(req, res, next) {
    try{
        const userId = req.headers.idUsuario;
        const at = await compromissosService.atualizar(userId, req.params.id, req.body);
        res.status(200).json(at);
    } catch (error) {next(error);}
}

// atualiza os status da tarefa
export async function atualizarStatus(req, res, next) {
    try {
        const userId = req.headers.idUsuario;
        const at = await compromissosService.atualizarStatus(userId, req.params.id, req.body.status);
        res.status(200).json(at);
    } catch (error) {next(error);}
}

// Deleta a tarefa do banco de dados, mas só deixa os status como ("removido") para manter o histórico
export async function remover(req, res, next) {
    try {
        const userId = req.headers.idUsuario;
        const r = await compromissosService.remover(userId, req.params.id);
        res.status(200).json(r);
    } catch (error) {next(error);}
}

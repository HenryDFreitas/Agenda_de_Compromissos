import {JWTService} from '../services/jwt.service.js';
import * as userService from '../services/user.service.js';

// Lista todas as tarefas no banco de dados, com suporte a filtros de data e status
export async function listar(req, res, next) {
    try {
        const dados = await userService.listarTodos(req.query);
        res.status(200).json(dados);
    } catch (error) {
        next(error);
    }
}

// Busca a tarefa por ID
export async function buscarPorId(req, res, next) {
    try {
        const item = await userService.buscarPorId(req.params.id);
        res.status(200).json(item);
    } catch (error) {next(error);}
}



// Cria a tarefa no banco de dados, validando os dados de entrada e verificando conflitos de horário
export async function registrar(req, res, next) {
    try {
        const { name, email, password } = req.body;

        /* === SUA VALIDAÇÃO MANUAL BEM AQUI === */
        const erros = {};

        if (!name || name.trim().length < 3) {
            erros.name = 'O nome é obrigatório e deve ter pelo menos 3 caracteres.';
        }
        
        if (!email || !email.includes('@')) {
            erros.email = 'Insira um e-mail válido.';
        }

        if (!password || password.length < 6) {
            erros.password = 'A senha é obrigatória e deve ter pelo menos 6 caracteres.';
        }

        // Se tiver preenchido qualquer erro, responde 400 e para o código aqui
        if (Object.keys(erros).length > 0) {
            return res.status(400).json({ errors: erros });
        }
        /* ===================================== */

        const emailExistente = await userService.getByEmail(email.trim());

        if (emailExistente) {
            return res.status(400).json({
                errors: { email: 'Este e-mail já está cadastrado no sistema.' }
            });
        }
        
        // Se os dados passaram pelos testes acima, ele segue o seu fluxo original:
        const novo = await userService.registrar(req.body);
        return res.status(201).json(novo);

    } catch (error) {
        next(error);
    }
}

// 2. LOGIN (SignIn)
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ errors: { default: 'E-mail e senha são obrigatórios.' } });
        }

        const usuario = await userService.getByEmail(email.trim());

        if (!usuario || usuario.password !== password) {
            return res.status(400).json({ errors: { default: 'E-mail ou senha inválidos.' } });
        }

        const token = JWTService.sign({ uid: usuario.id });

        if (token === 'JWT_SECRET_NOT_FOUND') {
            return res.status(500).json({ errors: { default: 'Erro interno: Chave JWT sumiu.' } });
        }

        return res.status(200).json({
            user: { id: usuario.id, name: usuario.name, email: usuario.email },
            token: token
        });

    } catch (error) {
        next(error);
    }
}

// Atualiza os dados da tarefa cadastrado no banco de dados
export async function atualizar(req, res, next) {
    try{
        const at = await userService.atualizar(req.params.id, req.body);
        res.status(200).json(at);
    } catch (error) {next(error);}
}

// Deleta a tarefa do banco de dados, mas só deixa os status como ("removido") para manter o histórico
export async function excluir(req, res, next) {
    try {
        const r = await userService.excluir(req.params.id);
        res.status(200).json(r);
    } catch (error) {next(error);}
}


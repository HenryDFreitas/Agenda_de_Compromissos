import { JWTService } from '../services/jwt.service.js'; // Ajuste o caminho para o seu serviço de JWT


export const ensureAuthenticated = async (req, res, next) => {
    // 1. Pega o cabeçalho de autorização da requisição
    const { authorization } = req.headers;

    // 2. Verifica se o cabeçalho foi enviado
    if (!authorization) {
        return res.status(401).json({
            errors: { default: 'Não autenticado. Token não fornecido.' }
        });
    }

    // 3. O cabeçalho costuma vir no formato: "Bearer <token>". Vamos separar a palavra do token real.
    const parts = authorization.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({
            errors: { default: 'Erro no formato do token.' }
        });
    }

    const [scheme, token] = parts;

    // Verifica se a primeira parte é a palavra "Bearer" (ignorando maiúsculas/minúsculas)
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({
            errors: { default: 'Token mal formatado.' }
        });
    }

    // 4. Usa o seu serviço convertida de JWT para validar o token
    const jwtData = JWTService.verify(token);

    // Se o serviço retornar as strings de erro que mapeamos antes:
    if (jwtData === 'JWT_SECRET_NOT_FOUND') {
        return res.status(500).json({
            errors: { default: 'Erro interno ao validar as credenciais.' }
        });
    }

    if (jwtData === 'INVALID_TOKEN') {
        return res.status(401).json({
            errors: { default: 'Não autenticado.' }
        });
    }

    // 5. Se o token for válido, salva o ID do usuário (uid) dentro da requisição (req)
    // Assim, qualquer controller que venha depois desse middleware saberá quem está logado!
    req.headers.idUsuario = jwtData.uid.toString();

    // Segue para a rota/controller principal
    return next();
};
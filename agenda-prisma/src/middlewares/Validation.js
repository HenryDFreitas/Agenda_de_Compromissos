// Middleware de Validação genérico usando Yup em JavaScript
export const validation = (schemaConfig) => async (req, res, next) => {
    try {
        // Criamos uma função fake para simular o 'getSchema' que o código em TS usava,
        // garantindo que você não precise mudar a estrutura visual dos seus controllers!
        const fakeGetSchema = (schema) => schema;
        const schemas = schemaConfig(fakeGetSchema);

        // 1. Valida o BODY (corpo da requisição), se houver um schema definido
        if (schemas.body) {
            req.body = await schemas.body.validate(req.body, {
                abortEarly: false, // Captura TODOS os erros de uma vez só
                stripUnknown: true // Remove campos que não foram definidos no schema (segurança)
            });
        }

        // 2. Valida os PARAMS (parâmetros da URL, ex: /:id), se houver um schema definido
        if (schemas.params) {
            req.params = await schemas.params.validate(req.params, {
                abortEarly: false,
                stripUnknown: true
            });
        }

        // 3. Valida a QUERY (filtros da URL, ex: ?page=1), se houver um schema definido
        if (schemas.query) {
            req.query = await schemas.query.validate(req.query, {
                abortEarly: false,
                stripUnknown: true
            });
        }

        // Se tudo estiver correto e nenhum erro for lançado, vai para o controller
        return next();

    } catch (error) {
        // Se o Yup pegar algum erro de validação, ele cai aqui
        const yupErrors = {};

        // Organiza os erros em um objeto amigável para o front-end (ex: { email: 'E-mail inválido' })
        if (error.inner) {
            error.inner.forEach((err) => {
                if (!err.path) return;
                yupErrors[err.path] = err.message;
            });
        } else {
            // Caso aconteça um erro genérico do Yup fora do inner
            yupErrors['default'] = error.message;
        }

        // Retorna o status 400 (Bad Request) com a lista de erros de validação
        return res.status(400).json({
            errors: yupErrors
        });
    }
};
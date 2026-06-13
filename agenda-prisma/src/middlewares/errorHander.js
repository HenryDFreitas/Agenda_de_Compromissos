export function errorHandler(error, req, res, next) {
    console.error(error);

    res.status(error.statusCode || 500).json({
        erro: error.message || 'Erro interno do servidor'
    });
}
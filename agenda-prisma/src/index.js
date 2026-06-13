/* Arquivo principal da aplicação */
import server from './server/Servidor';

server.listen(3333, '0.0.0.0', () => {
    console.log(`App rodando na porta ${process.env.PORT || 3333}`);
});
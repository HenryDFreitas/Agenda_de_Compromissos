import express from 'express';
import cors from 'cors';
import compromissosRouter from './src/routes/compromissos.routes.js';
import userRouter from './src/routes/user.routes.js';
import {errorHandler} from './src/middlewares/errorHander.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) =>{
console.log(
    `${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
next();
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        mensagem: 'API com Prisma + PostgreSQL funcionando',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/compromissos', compromissosRouter);

app.use('/api/user', userRouter);

app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use(errorHandler);

export default app;
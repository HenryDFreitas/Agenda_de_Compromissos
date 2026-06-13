import {Router} from 'express';
import {ensureAuthenticated} from '../middlewares/EnsureAuthenticated.js';
import{
    listar,
    buscarPorId,
    registrar,
    login,
    atualizar,
    excluir
} from '../controllers/user.controller.js';


const router = Router();

router.get ('/', ensureAuthenticated, listar);
router.get ('/:id', ensureAuthenticated, buscarPorId);
router.post ('/', registrar);
router.post ('/login', login);
router.put ('/:id', ensureAuthenticated, atualizar);
router.delete ('/:id', ensureAuthenticated, excluir);

export default router;
import {Router} from 'express';
import {ensureAuthenticated} from '../middlewares/EnsureAuthenticated.js';
import{
    listar,
    buscarPorId,
    criar,
    atualizar,
    atualizarStatus,
    remover
} from '../controllers/compromissos.controller.js';

const router = Router();

router.get ('/', ensureAuthenticated, listar);
router.get ('/:id', ensureAuthenticated, buscarPorId);
router.post ('/', ensureAuthenticated, criar);
router.put ('/:id', ensureAuthenticated, atualizar);
router.patch ('/:id/status', ensureAuthenticated, atualizarStatus);
router.delete ('/:id', ensureAuthenticated, remover);

export default router;
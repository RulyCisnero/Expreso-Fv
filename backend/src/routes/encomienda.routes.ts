import express from 'express';
import encomiendaController from '../controllers/encomienda/encomienda.controller.ts';
import { validarUpdateEncomienda, validarCamposEncomiendaPut } from '../middlewares/encomienda/validarUpdateEncomienda.ts';


const router = express.Router();

router.post('/', encomiendaController.createEncomienda);
router.get('/:id', encomiendaController.getEncomiendaById);
router.get('/', encomiendaController.getAllEncomiendas);
//router.get('/', encomiendaController.getFilteredEncomiendas);
router.put('/:id',validarCamposEncomiendaPut, encomiendaController.updateEncomienda);
router.put('/:id/estado', encomiendaController.actualizarEstadoEncomienda);
router.delete('/:id', encomiendaController.deleteEncomienda);

export default router;
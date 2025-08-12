import { Router } from "express";
import choferController from "../controllers/chofer/choferController.ts";
import { validarCamposChofer, validarIdParam,checkChoferExists,checkDestinoExiste } from "../middlewares/chofer/choferValidation.ts";

const router = Router();

//agregar a las rutas http://localhost:5100/api/chofer
router.post('/', validarCamposChofer, checkDestinoExiste, choferController.createChofer);
//router.get('/:id', validarIdParam, checkChoferExists, choferController.getChoferById);
router.get('/:id', choferController.getChoferById);
router.get('/', choferController.getAllChoferes);
router.put('/:id', validarIdParam, validarCamposChofer, checkDestinoExiste, choferController.updateChofer);
router.delete('/:id', validarIdParam, checkChoferExists, choferController.deleteChofer);

export default router;

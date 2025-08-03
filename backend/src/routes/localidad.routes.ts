import { Router } from "express";
import LocalidadController from "../controllers/localidad/localidad.controller.ts";
import {validateLocalidadData} from '../middlewares/localidad/validateLocalidad.ts';
import {checkLocalidadExists} from '../middlewares/localidad/checkLocalidadExists.ts';
import {validateLocalidadId} from '../middlewares/localidad/validateLocalidadId.ts';
import { checkLocalidadNombreDuplicado } from "../middlewares/localidad/checkLocalidadExists.ts";
const router = Router();
//agregar a las rutas http://localhost:5100/api/localida

router.get('/', LocalidadController.getAllLocalidades);
router.get('/:id',validateLocalidadId, checkLocalidadExists, LocalidadController.getLocalidadById);
router.post('/', validateLocalidadData,checkLocalidadNombreDuplicado, LocalidadController.createLocalidad);
router.put('/:id',validateLocalidadId, checkLocalidadExists, validateLocalidadData,checkLocalidadNombreDuplicado, LocalidadController.updateLocalidad);
router.delete('/:id',validateLocalidadId, checkLocalidadExists, LocalidadController.deleteLocalidad);

export default router;

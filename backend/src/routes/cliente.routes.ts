import { Router } from 'express';
import clienteController from '../controllers/cliente/clienteController.ts';
import { validateCreateCliente, validateIdParam, validateSearchCliente } from '../middlewares/cliente/clienteValidations.ts';
const router = Router();

//agregar a las rutas http://localhost:5100/api/clientes
router.post('/', validateCreateCliente, clienteController.createCliente);
router.get('/buscar', validateSearchCliente, clienteController.searchCliente); ///clientes?nombre=Juan
router.get('/:id', validateIdParam, clienteController.getClienteById);
router.get('/', clienteController.getAllClientes);
router.put('/:id', validateIdParam, validateCreateCliente, clienteController.updateCliente);
router.delete('/:id', validateIdParam, clienteController.deleteCliente);

export default router;
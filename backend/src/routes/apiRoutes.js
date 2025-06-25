import express from 'express';
import clienteController from '../controllers/cliente/clienteController.js';
import choferController from '../controllers/chofer/choferController.js';
import encomiendaController from '../controllers/encomienda/encomienda.controller.js';

const router = express.Router();

// Rutas para manejar clientes
//agregar a las rutas http://localhost:5100/api/clientes
router.post('/clientes', clienteController.createCliente);
router.get('/clientes/search', clienteController.searchCliente);
router.get('/clientes/:id', clienteController.getClienteById);
router.get('/clientes', clienteController.getAllClientes);
router.put('/clientes/:id', clienteController.updateCliente);
router.delete('/clientes/:id', clienteController.deleteCliente);

router.post('/chofer', choferController.createChofer);
router.get('/chofer/:id', choferController.getChoferById);
router.get('/choferes', choferController.getAllChoferes);
router.put('/chofer/:id', choferController.updateChofer);
router.delete('/chofer/:id', choferController.deleteChofer);

router.post('/encomienda', encomiendaController.createEncomienda);
router.get('/encomienda/:id', encomiendaController.getEncomiendaById);
router.get('/encomiendas', encomiendaController.getFilteredEncomiendas);
router.get('/encomiendas', encomiendaController.getAllEncomiendas);
router.put('/encomienda/:id', encomiendaController.updateEncomienda);
router.delete('/encomienda/:id', encomiendaController.deleteEncomienda);
export default router;
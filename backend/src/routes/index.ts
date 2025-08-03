import { Router } from 'express';
import localidadRoutes from './localidad.routes.ts';
import encomiendaRoutes from './encomienda.routes.ts';
import choferRoutes from './chofer.routes.ts';
import clienteRoutes from './cliente.routes.ts';

const router = Router();
router.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});


router.use('/localidades', localidadRoutes);
router.use('/encomiendas', encomiendaRoutes);
router.use('/choferes', choferRoutes);
router.use('/clientes', clienteRoutes);

export default router;

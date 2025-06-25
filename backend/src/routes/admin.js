import express from 'express';
import adminController from '../controllers/admin.js';
const route = express.Router();


route.post('/',adminController.create);
route.get('/:id', adminController.getOne);
route.get('/', adminController.get);
route.put('/:id',adminController.update);
route.delete('/:id',adminController.delete);

export default route;
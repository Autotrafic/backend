import express from 'express';
import {
  getOrderById,
  registerOrder,
  updateOrderWithDocumentsDetails,
  updateOrder,
  createTotalumOrderById,
  updateTotalumOrderByDocumentsDetails,
  updateDriveDocumentsOfTotalumOrder,
  registerWhatsappOrder,
} from '../controllers/orderController';

const orderRouter = express.Router();

orderRouter.post('/register', registerOrder);

orderRouter.post('/register-whatsapp', registerWhatsappOrder);
orderRouter.post('/totalum/create', createTotalumOrderById);
orderRouter.post('/totalum/update-with-documents-details', updateTotalumOrderByDocumentsDetails);

orderRouter.post('/totalum/update-documents-url', updateDriveDocumentsOfTotalumOrder);

orderRouter.post('/documentsDetails/:orderId', updateOrderWithDocumentsDetails);
orderRouter.post('/:orderId', updateOrder);
orderRouter.get('/:orderId', getOrderById);

export default orderRouter;

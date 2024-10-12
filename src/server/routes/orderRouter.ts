import express from 'express';
import {
  getOrderById,
  registerOrder,
  updateOrderWithDocumentsDetails,
  updateOrder,
  createTotalumOrderById,
  updateTotalumOrderByDocumentsDetails,
  updateDriveDocumentsOfTotalumOrder,
  createTotalumOrder,
} from '../controllers/orderController';

const orderRouter = express.Router();

orderRouter.post('/register', registerOrder);
orderRouter.post('/documentsDetails/:orderId', updateOrderWithDocumentsDetails);

orderRouter.post('/totalum/new', createTotalumOrder);
orderRouter.post('/totalum/create', createTotalumOrderById);
orderRouter.post('/totalum/update-with-documents-details', updateTotalumOrderByDocumentsDetails);

orderRouter.post('/totalum/update-documents-url', updateDriveDocumentsOfTotalumOrder);

orderRouter.post('/:orderId', updateOrder);
orderRouter.get('/:orderId', getOrderById);

export default orderRouter;

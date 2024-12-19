import express from 'express';
import {
  getOrderById,
  registerOrder,
  updateOrderWithDocumentsDetails,
  updateOrder,
  registerWebOrder,
  extendTotalumOrderByDocumentsDetails,
  updateDriveDocumentsOfTotalumOrder,
  registerWhatsappOrder,
  getTotalumOrderById,
} from '../controllers/orderController';
import multer from 'multer';

const orderRouter = express.Router();

const upload = multer({ limits: { fileSize: 25000000 }, dest: 'uploads/' });

orderRouter.post('/register', registerOrder);

orderRouter.post('/register-whatsapp', upload.any(), registerWhatsappOrder);
orderRouter.post('/totalum/create', registerWebOrder);
orderRouter.post('/totalum/update-with-documents-details', extendTotalumOrderByDocumentsDetails);

orderRouter.post('/totalum/update-documents-url', updateDriveDocumentsOfTotalumOrder);

orderRouter.post('/documentsDetails/:orderId', updateOrderWithDocumentsDetails);
orderRouter.post('/:orderId', updateOrder);
orderRouter.get('/:orderId', getOrderById);
orderRouter.get('/totalum/:orderId', getTotalumOrderById);

export default orderRouter;

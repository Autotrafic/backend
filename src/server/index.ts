import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { generalError, notFoundError } from '../errors/generalError';
import vehicleRouter from './routes/vehicleRouter';
import paymentRouter from './routes/paymentRouter';
import filesRouter from './routes/filesRouter';
import logRouter from './routes/logRouter';
import orderRouter from './routes/orderRouter';
import messagesRouter from './routes/messagesRouter';
import invoiceRouter from './routes/invoiceRouter';
import referralRouter from './routes/referralRouter';
import shipmentRouter from './routes/shipmentRouter';
import totalumRouter from './routes/totalumRouter';
import scriptRouter from './routes/scriptRouter';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
});

app.use(limiter);
app.use(hpp());
app.use(cors());
app.use(bodyParser.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://trusted.cdn.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use((req, res, next) => {
  const contentLength = req.headers['content-length'];
  console.log(`Content Length: ${contentLength} bytes`);
  next();
});

app.use(
  express.json({
    limit: '200mb',
  })
);
app.use(
  express.urlencoded({
    limit: '200mb',
    parameterLimit: 100000000,
    extended: true,
  })
);

app.get('/', (req, res) => res.send('Working!'));

app.use('/vehicles', vehicleRouter);
app.use('/payment', paymentRouter);
app.use('/files', filesRouter);
app.use('/logs', logRouter);
app.use('/order', orderRouter);
app.use('/messages', messagesRouter);
app.use('/invoice', invoiceRouter);
app.use('/referral', referralRouter);
app.use('/shipment', shipmentRouter);
app.use('/totalum', totalumRouter);
app.use('/script', scriptRouter);

app.use(notFoundError);
app.use(generalError);

export default app;

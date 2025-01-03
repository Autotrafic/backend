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
import scriptRouter from './routes/scriptRouter';
import { addSseClient } from '../sse/controllers';
import totalumRouter from './routes/totalumRouter';
import whatsappRouter from './routes/whatsappRouter';

const app = express();

const server = app.listen(3000, () => {});

server.timeout = 600000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: 'too many requests sent by this ip, please try again later',
});

app.use(limiter);
app.use(hpp());
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => res.send('Working!'));
app.get('/connect', addSseClient);

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
app.use('/whatsapp', whatsappRouter);

app.use('/script', scriptRouter);

app.use(notFoundError);
app.use(generalError);

export default app;

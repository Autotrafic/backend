import express from 'express';
import { runScript, runSecondScript } from '../controllers/scriptController';

const scriptRouter = express.Router();

scriptRouter.post('/', runScript);
scriptRouter.get('/2', runSecondScript);



export default scriptRouter;

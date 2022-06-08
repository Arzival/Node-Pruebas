import express from 'express';
import morgan from 'morgan';
import { ppid } from 'process';
//rutas
import languageRoutes from './routes/lenguage.routes.js';

const app = express();

//settings
app.set('port', process.env.PORT || 3000);
//middlewares
app.use(morgan('dev'));
app.use(express.json());

//rutas
app.use(languageRoutes);
export default app;
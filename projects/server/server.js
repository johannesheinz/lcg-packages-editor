import { resolve } from 'path';
import express, { static } from 'express';
import compression from 'compression';

const CONTEXT = `/${process.env.CONTEXT || 'lcg-packages-editor'}`;
const PORT = process.env.PORT || 4000;

const app = express();

app.use(compression());
app.use(CONTEXT, static(resolve(__dirname, '../../dist/lcg-packages-editor')));
app.use('/', static(resolve(__dirname, '../../dist/lcg-packages-editor')));
app.listen(PORT, () =>
  console.log(`App running on http://localhost:${PORT}${CONTEXT}`)
);

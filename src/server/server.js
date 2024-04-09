import expressSession from 'express-session';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { addRoutes } from './routes/add-routes.js';

const app = express();

app.user(expressSession({
  secret: 'foo bar baz',
  cookie: {
    name: 'don\'t use this name',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    signed: false
  }
}));

app.use(bodyParser.json());

addRoutes(app);

app.use(express.static('../web'));

app.listen(3000);

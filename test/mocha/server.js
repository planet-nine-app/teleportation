import express from 'express';
import path from 'path';

const app = express();

app.use((req, res, next) => {
console.log('got req');
console.log(req.url);
next();
});

app.use(express.static(path.resolve('./')));

app.listen(2970);

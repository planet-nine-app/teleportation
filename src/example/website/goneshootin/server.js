//const express = require("express");
import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.resolve('./')));

app.listen(3000);

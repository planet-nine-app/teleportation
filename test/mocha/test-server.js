import express from 'express';
import path from 'path';
import safeTeleportationParser from 'teleportation-js';

console.log(safeTeleportationParser);

const app = express();

app.use((req, res, next) => {
console.log('got req');
console.log(req.url);
next();
});

app.get('/teleport/:url', async (req, res) => {
  const teleportTag = await safeTeleportationParser.getTeleportTag(req.params.url);
console.log(teleportTag);
  const isValid = await safeTeleportationParser.isValidTag(teleportTag);
console.log(isValid);
});

app.use(express.static(path.resolve('./')));

app.listen(2970);

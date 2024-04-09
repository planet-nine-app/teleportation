import { createOrUpdateTeleportal } from '../../persistence/teleportal.js';
import { getTeleportations } from '../../persistence/teleportations.js';
import { register, associate } from '../../user/user.js';

export const addRoutes = (app) => {
  app.post('/teleportal', createOrUpdateTeleportal);

  app.get('/teleportations', getTeleportations);

  app.post('/register', register);
 
  app.post('/associate', associate);
};

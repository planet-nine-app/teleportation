import { Web5 as web5 } from '@web5/api';
import { configureTeleportalProtocol } from '../../protocols/teleportal.protocol.js';

web5.password = 'Ihatepasswordssomuch';

const { connection, did: me } = await web5.connect();

const dwn = connection.dwn;

await configureTeleportalProtocol(dwn);

export const createOrUpdateTeleportal = async (req, res) => {
  const did = req.body.did;
  const teleportationCategories = req.body.teleportationCategories;

  if(!did) {
    res.send(403);
  }

  const { records } = await dwn.records.query({
    message: {
      filter: {
        protocol: "https://sessionless.org/teleportal",
	dataFormat: "application/json",
      },
    },
  });
  
  if(records.length === 0) {
    const { record } = await dwn.records.create({
      data: {
        did,
        teleportationCategories
      },
      message: {
        dataFormat: "application/json"
      }
    });
    res.send(200);
  } else {
    // TODO how to update?
  }
};

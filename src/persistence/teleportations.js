import { Web5 as web5 } from '@web5/api';

web5.password = 'Ihatepasswordssomuch';

const { connection, did: me } = await web5.connect();

const dwn = connection.dwn;

await configureTeleportalProtocol(dwn);

export const getTeleportations = async (req, res) => {
  const teleportationCategory = req.query.telcat;

  const did = req.body.did;

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
  
  const didsWithTeleportationCategory = records.filter(async () => { 
    const content = record.data.json();
    return content.teleportationCategory === teleportationCategory;
  }).map((content) => content.did);
  
  // TODO query other teleportals by did
};

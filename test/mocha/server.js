import { should } from 'chai';
should();
import sessionless from 'sessionless-node';
import superAgent from 'superagent';

const baseURL = process.env.SUB_DOMAIN ? `https://${process.env.SUB_DOMAIN}.fount.allyabase.com/` : 'http://127.0.0.1:3006/';

const get = async function(path) {
  console.info("Getting " + path);
  return await superAgent.get(path).set('Content-Type', 'application/json');
};

const put = async function(path, body) {
  console.info("Putting " + path);
  return await superAgent.put(path).send(body).set('Content-Type', 'application/json');
};

const post = async function(path, body) {
  console.info("Posting " + path);
console.log(body);
  return await superAgent.post(path).send(body).set('Content-Type', 'application/json');
};

const _delete = async function(path, body) {
  //console.info("deleting " + path);
  return await superAgent.delete(path).send(body).set('Content-Type', 'application/json');
};

it('should grab a teleported tag', async () => {
  const res = await get('http://127.0.0.1:2970/teleport/https%3A%2F%2Fpeaceloveandredistribution.com%2Fa-brief-history-of-teleportation%3FpubKey%3D023031231f669c6504ef5939b6b5e22d2d8be76cf46e98297b810138933de2494f');
console.log(res.body);

  res.body.valid.should.equal(true);
});

it('should tell when a teleported tag is invalid', async () => {
  const res = await get('http://127.0.0.1:2970/teleport/https%3A%2F%2Fpeaceloveandredistribution.com%2Fa-brief-history-of-teleportation%3FpubKey%3D023031231f669c6504ef5939b6b5e22d2d8be76cf46e98297b810138933de2494e');
console.log(res.body);

  res.body.valid.should.equal(false);
});

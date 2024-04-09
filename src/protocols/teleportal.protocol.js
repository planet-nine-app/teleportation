
export const configureTeleportalProtocol = async (dwn) => {
  await dwn.protocols.configure({
    message: {
      definition: {
	protocol: "https://sessionless.org/teleportal",
	published: false,
	types: {
	  did: {
	    schema: "https://sessionless.org/teleportal/did",
	    dataFormats: ["application/json"],
	  },
          teleportationCategories: {
            schema: "https://sessionless.org/teleportal/telcat",
            dataFormats: ["application/json"],
          },
        },
	structure: {
	  did: {
	    $actions: [
	      {
		who: "recipient",
		can: "read",
	      },
	    ],
	  },
          teleportationCategories: {
            $actions: [
              {
                who: "recipient",
                can: "read",
              },
            ],
          },
	},
      },
    },
  });
};
//protocol.send(myDid); // sends the protocol configuration to the user's other DWeb Nodes.

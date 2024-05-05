import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://192.168.1.17:8002/auth",
  realm: "Banbeis",
  clientId: "IEIMS",
  clientSecret: "065386f3-38da-4099-99cd-ec66c17d2e89",
});

// const keycloak = new Keycloak({
//     realm: "banbeis",
//     clientId: "IEIMS",
//     "auth-server-url": "http://192.168.1.17:8002/auth/",
//     "ssl-required": "none",
//     resource: "IEIMS",
//     "verify-token-audience": true,
//     credentials: {
//       secret: "065386f3-38da-4099-99cd-ec66c17d2e89",
//     },
//     "confidential-port": 0,
//     "policy-enforcer": {},
//   });

export default keycloak;

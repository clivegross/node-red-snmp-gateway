const snmp = require("net-snmp");

// SNMP v3 options
let options = {
  port: 161,
  retries: 1,
  timeout: 5000,
  transport: "udp4",
  trapPort: 162,
  version: snmp.Version3,
  idBitsSize: 32,
  context: "",
};

let user = {
  name: "test",
  level: snmp.SecurityLevel.authNoPriv,
  authProtocol: snmp.AuthProtocols.md5,
  authKey: "test",
  // privProtocol: snmp.PrivProtocols.des,
  // privKey: "Mix#Sword#Appear.8",
};

// let session = snmp.createV3Session("10.1.1.112", user, options);
let session = snmp.createSession("10.1.1.112", "public");

let oids = ["1.3.6.1.2.1.1.3.0"]; // sysUpTime OID

session.get(oids, function (error, varbinds) {
  if (error) {
    console.error("Failed to fetch the OID.", error);
  } else {
    for (let i = 0; i < varbinds.length; i++) {
      if (snmp.isVarbindError(varbinds[i])) {
        console.error(snmp.varbindError(varbinds[i]));
      } else {
        console.log(varbinds[i].oid + " = " + varbinds[i].value);
      }
    }
  }
  session.close();
});

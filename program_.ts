'use strict';
import StartUp from "./startUp";
//const swaggerUi = require('swagger-ui-express');
//const swaggerFile = require('./swagger_output.json');

///let port = process.env.PORT || "3050";
let port = process.env.PORT || "3000";

/*
var fs = require("fs");
var https = require("https");
var privateKey = fs.readFileSync("localhost.key", "utf8");
var certificate = fs.readFileSync("localhost.cert", "utf8");
var credentials = { key: privateKey, cert: certificate };
var httpsServer = https.createServer(credentials, StartUp.app);

httpsServer.listen(port, function(){
        console.log('servidor executando na porta '+port);
});
*/
StartUp.app.listen(port, function (){
        console.log('servidor executando na porta '+port);
});

 

//StartUp.app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

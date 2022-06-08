import StartUp from "./startUp";
///let port = process.env.PORT || "3050";
let port = process.env.PORT || "3000";
/*
const https         =   require('https')
const http          =   require('http')
const http_port     =   process.env.HTTP_SERVER_PORT
const https_port    =   process.env.HTTPS_SERVER_PORT
const fs            =   require('fs')
const path          =   require('path')
    
try {
        var certificate = fs.readFileSync('/etc/letsencrypt/live/api.decn.org.br/cert.pem', 'utf8')
        var ca          = fs.readFileSync('/etc/letsencrypt/live/api.decn.org.br/chain.pem', 'utf8')
        var privateKey  = fs.readFileSync('/etc/letsencrypt/live/api.decn.org.br/privkey.pem', 'utf8')
      } catch(e) {
        var certificate = fs.readFileSync(path.resolve(__dirname, '.', 'certs', 'cert.pem'))
        var ca          = fs.readFileSync(path.resolve(__dirname, '.', 'certs', 'chain.pem'))
        var privateKey  = fs.readFileSync(path.resolve(__dirname, '.', 'certs', 'privkey.pem'))
      }
    
      const credentials = {
          key: privateKey,
          cert: certificate,
          ca: ca
      }
    
      const httpServer = http.createServer(StartUp.app)
      const httpsServer = https.createServer(credentials, StartUp.app)
      httpServer.listen(http_port, () => console.log(`Server is running on port ${http_port}`))
      httpsServer.listen(https_port, () => console.log(`Server with SSL is running on port ${https_port}`))
*/
      StartUp.app.listen(port, function (){
        console.log('servidor executando na porta '+port);
});

//StartUp.app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

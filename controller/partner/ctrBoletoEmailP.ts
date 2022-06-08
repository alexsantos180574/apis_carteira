import Helper from "../../infra/helper";

async function obterTokenP(){
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
     'grant_type': 'client_credentials' 
    });
    var config = {
      method: 'post',
      url: 'https://hml.auth.blupay-apps.com.br/auth/realms/payment-bus/protocol/openid-connect/token',
      headers: { 
        'Authorization': 'Basic YXRsYW50aWMuYmFuazo3NGQwZmE4NC03NzZjLTQ5YTYtYjMzNy0wMDFjYWJkNDAzMjI=', 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
    
    return axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
      return response.data.access_token;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });    
}

async function dadosBoletoP(res, token, obj) {
    var axios = require('axios');
    var config = {
        method: 'get',
        responseType: "stream",
        url: 'https://api.hml.pb.blupay-apps.com.br/api/invoices/'+obj.codigo+'/pdf',
        headers: { 
            'Authorization': 'Bearer '+token
        }
    };
//console.log(config);
    return axios(config)
    .then(function (response) {
        //console.log(JSON.stringify(response.data));
        const fs = require('fs');
        const fileName = obj.codigo+".pdf";
        response.data.pipe(fs.createWriteStream("./uploads/" + fileName));
        return "./uploads/" + fileName;///response.data;
    })
    .catch(function (error) {
        console.log(error);
        return error;
    });

}

class ctrBoletoEmailP{ 
    gerarBoletoEmailP(req, res){
        let obj = req.body; 
        obterTokenP()
        .then(token =>{
            if(token != ''){
                dadosBoletoP(res, token, obj)
                .then(arquivo => {
                    //console.log(arquivo);
                    /* inicio do envio do email */
                    const nodemailer = require('nodemailer');
                    var transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: 'alexmello180574@gmail.com',
                        pass: 'ale775569!',
                      }
                    });
            
                    //console.log('passou por email');
                    let texto = ' <html> Boleto encaminhado em anexo.  </html>';
                    const mailOptions = {
                        from: 'alexmello180574@gmail.com',
                        to: obj.email,
                        subject: 'Atlantic Bank - Boleto',
                        html: texto,
                        attachments: [{ // Basta incluir esta chave e listar os anexos
                            filename: 'boleto.pdf', // O nome que aparecerá nos anexos
                            path: arquivo // O arquivo será lido neste local ao ser enviado
                          }]                    
                      };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                        Helper.sendResponse(res, 500, {erro:error});
                      } else {
                        //console.log('Email sent: ' + info.response);
                        Helper.sendResponse(res, 200, 'Email enviado com sucesso!');
                      }
                    });
                    /* fim do envio do email */
                })
                .catch(error => console.error.bind(console, "Erro: "+error))
            }else{
                Helper.sendErro(res, 401, 'Um token é necessário!');
            }
        }) 

    }
}

export default new ctrBoletoEmailP();
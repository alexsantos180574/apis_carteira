import Helper from "../../infra/helper";

class ctrEnviarEmail{ 
    enviarEmails(req, res){
        const email = req.params.email;
        let obj = req.body;

        let vhtml = obj.html;

        const nodemailer = require('nodemailer');
        //console.log(obj);
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'alexmello180574@gmail.com',
            pass: 'ale775569!',
          }
        });
        
        const mailOptions = {
            from: 'alexmello180574@gmail.com',
            to: email,
            subject: 'Atlantic Bank - Recuperação de senha',
            html: vhtml
            };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                Helper.sendErro(res, 500, 'Sistema indisponivel no momento, por favor, tente mais tarde!');
            } else {
                //console.log('Email enviado: ' + info.response);
                Helper.sendResponse(res, 201, {mensagem:'Email enviado com sucesso!',email:email});
            }
        });
    }
}

export default new ctrEnviarEmail();
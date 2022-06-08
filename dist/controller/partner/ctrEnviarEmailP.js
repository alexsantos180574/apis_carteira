"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
class ctrEnviarEmailP {
    enviarEmailsP(req, res) {
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
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                helper_1.default.sendErro(res, 500, 'Sistema indisponivel no momento, por favor, tente mais tarde!');
            }
            else {
                //console.log('Email enviado: ' + info.response);
                helper_1.default.sendResponse(res, 201, { mensagem: 'Email enviado com sucesso!', email: email });
            }
        });
    }
}
exports.default = new ctrEnviarEmailP();

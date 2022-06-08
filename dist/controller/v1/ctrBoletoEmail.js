"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
function obterToken() {
    return __awaiter(this, void 0, void 0, function* () {
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
            data: data
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
    });
}
function dadosBoleto(res, token, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var config = {
            method: 'get',
            responseType: "stream",
            url: 'https://api.hml.pb.blupay-apps.com.br/api/invoices/' + obj.codigo + '/pdf',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        //console.log(config);
        return axios(config)
            .then(function (response) {
            //console.log(JSON.stringify(response.data));
            const fs = require('fs');
            const fileName = obj.codigo + ".pdf";
            response.data.pipe(fs.createWriteStream("./uploads/" + fileName));
            return "./uploads/" + fileName; ///response.data;
        })
            .catch(function (error) {
            console.log(error);
            return error;
        });
    });
}
class ctrBoletoEmail {
    gerarBoletoEmail(req, res) {
        let obj = req.body;
        obterToken()
            .then(token => {
            if (token != '') {
                dadosBoleto(res, token, obj)
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
                        attachments: [{
                                filename: 'boleto.pdf',
                                path: arquivo // O arquivo será lido neste local ao ser enviado
                            }]
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            helper_1.default.sendResponse(res, 500, { erro: error });
                        }
                        else {
                            //console.log('Email sent: ' + info.response);
                            helper_1.default.sendResponse(res, 200, 'Email enviado com sucesso!');
                        }
                    });
                    /* fim do envio do email */
                })
                    .catch(error => console.error.bind(console, "Erro: " + error));
            }
            else {
                helper_1.default.sendErro(res, 401, 'Um token é necessário!');
            }
        });
    }
}
exports.default = new ctrBoletoEmail();

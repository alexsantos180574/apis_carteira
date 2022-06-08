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
////import mdlExtrato from "../models/mdlExtrato";
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
function geraBoleto(res, token, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var data = JSON.stringify({ "externalId": "1000",
            "value": 10,
            "dueDate": "2021-02-22",
            "debtor": { "taxId": "41250888883",
                "name": "Saul Santana Cortes",
                "email": "alexsantos@atlanticbank.com.br",
                "phone": "21993039634",
                "address": { "zipCode": "22041011",
                    "state": "RJ",
                    "city": "Rio de Janeiro",
                    "neighborhood": "Copacabana",
                    "street": "R. Santa Clara",
                    "number": "115",
                    "complement": "Apt 1001"
                }
            },
            "penalty": { "value": 1,
                "date": "2021-02-23",
                "interestRate": 0.05
            },
            "discount": { "percentage": 15,
                "dailyValue": 0,
                "limitDate": "2021-02-22"
            },
            "type": "BILL_SLIP"
        });
        var config = {
            method: 'post',
            url: 'https://api.hml.pb.blupay-apps.com.br/api/invoices',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        /*
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                const sql = require('mssql');
                var request = new sql.Request();
                // CRÉDITO EM CONTA DESTINO
                let strSql  = `INSERT INTO dbo.TB_MOV_CONTA_BANCARIA
                (NUM_CONTA, VALOR ,TIPO_TRANSACAO ,ID_ORIGEM_TRANSACAO ,NOME_DESTINO ,DOCUMENTO_DESTINO
                ,INSTITUICAO_DESTINO ,AGENCIA_DESTINO ,CONTA_DESTINO ,TIPO_CONTA_DESTINO ,ID_STATUS_TRANSACAO, TEXTO_LIVRE, TOKEN_TRANSACIONAL)
                VALUES(${conta_origem} ,${valor} ,'${tipoTransacao}' ,${id_origem_transacao} ,'${nome_destino}'
                ,'${documento_destino}' ,'${banco_destino}' ,'${agencia_destino}' ,'${conta_destino}' ,'${tipo_conta_destino}', 1,'${campo_livre}', '${token}' )`;
                ///console.log(strSql);
                request.query(strSql, function (err, data) {
                    if (err){retorno = err}else{retorno = 'TEF Efetuado'}
                });
                
            })
            .catch(function (error) {
                console.log(error);
        });*/
    });
}
class ctrBoleto {
    gerarBoleto(req, res) {
        let obj = req.body;
        //console.log(obj.client_id);
        helper_1.default.sendResponse(res, 200, { codigobarra: '00190000090312855700000001000173185390000001000', datavencimento: '2021-02-25', codigo: 'PqWfco448RvzsXP62h4vRCjG7TF' });
        /*
            obterToken()
            .then(token =>{
                if(token != ''){
                    geraBoleto(res, token, obj)
                    .then(msg => {
                        Helper.sendResponse(res, HttpStatus.OK, 'TEF efetuado com sucesso!');
                    })
                    .catch(error => console.error.bind(console, "Erro: "+error))
                }else{
                    Helper.sendErro(res, HttpStatus.OK, 'Saldo insuficiente!');
                }
            })
            */
    }
}
exports.default = new ctrBoleto();

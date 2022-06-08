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
const HttpStatus = require("http-status");
function obterSaldo(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var data = JSON.stringify({ "token": 0 });
        var resultado;
        var config = {
            method: 'get',
            url: 'http://apis.atlanticbank.com.br/contas/v1/saldocliente/' + _id,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        return axios(config)
            .then(function (response) {
            //return JSON.stringify(response.data);
            const objeto = JSON.parse(JSON.stringify(response.data));
            resultado = objeto.saldo[0].saldo;
            return resultado;
        })
            .catch(function (error) {
            return error;
        });
    });
}
function EmitirTEF(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const cliente = obj.client_id;
        const valor = obj.valor;
        const conta_origem = obj.conta_origem;
        const tipoTransacao = "S";
        const id_origem_transacao = 3; //TEF
        const nome_destino = obj.nome_destino;
        const campo_livre = obj.campo_livre;
        const documento_destino = obj.documento_destino;
        const banco_destino = obj.banco_destino;
        const agencia_destino = obj.agencia_destino;
        const conta_destino = obj.conta_destino;
        const tipo_conta_destino = obj.tipo_conta_destino;
        const token = obj.token;
        const sql = require('mssql');
        var retorno;
        let codehash = helper_1.default.getHash();
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            // CRÉDITO EM CONTA DESTINO
            let strSql = `INSERT INTO dbo.TB_MOV_CONTA_BANCARIA
        (NUM_CONTA, VALOR ,TIPO_TRANSACAO ,ID_ORIGEM_TRANSACAO ,NOME_DESTINO ,DOCUMENTO_DESTINO
        ,INSTITUICAO_DESTINO ,AGENCIA_DESTINO ,CONTA_DESTINO ,TIPO_CONTA_DESTINO ,ID_STATUS_TRANSACAO, TEXTO_LIVRE, TOKEN_TRANSACIONAL, CLIENT_ID, CODIGO_VALIDADOR)
        VALUES(${conta_origem} ,${valor} ,'${tipoTransacao}' ,${id_origem_transacao} ,'${nome_destino}'
        ,'${documento_destino}' ,'${banco_destino}' ,'${agencia_destino}' ,'${conta_destino}' ,'${tipo_conta_destino}', 1,'${campo_livre}', '${token}', '${cliente}', '${codehash}' )`;
            ////console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err) {
                    retorno = err;
                }
                else {
                    retorno = 'TEF Efetuado';
                }
            });
        });
    });
}
class ctrTEF {
    setEmitirTEF(req, res) {
        let obj = req.body;
        //console.log(obj.client_id);
        let continua = (obj.banco_destino != '213') ? false : true;
        if (continua) {
            obterSaldo(obj.conta_origem)
                .then(saldo => {
                if (saldo >= obj.valor) {
                    EmitirTEF(res, obj)
                        .then(msg => {
                        helper_1.default.sendResponse(res, HttpStatus.OK, 'TEF efetuado com sucesso!');
                    })
                        .catch(error => console.error.bind(console, "Erro: " + error));
                }
                else {
                    helper_1.default.sendErro(res, HttpStatus.OK, 'Saldo insuficiente!');
                }
            });
        }
        else {
            helper_1.default.sendErro(res, HttpStatus.OK, 'TEF somente é permitido entre contas Atlantic Bank!');
        }
    }
}
exports.default = new ctrTEF();

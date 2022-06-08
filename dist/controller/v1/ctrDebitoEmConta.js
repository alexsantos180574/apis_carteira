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
const HttpStatus = require("http-status");
function obterSaldo(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var resultado;
        var config = {
            method: 'get',
            url: 'http://apis.atlanticbank.com.br/contas/v1/saldocliente/' + _id,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return axios(config)
            .then(function (response) {
            const objeto = JSON.parse(JSON.stringify(response.data));
            resultado = objeto.saldo[0].saldo;
            //console.log(resultado);
            return resultado;
        })
            .catch(function (error) {
            console.log(error);
        });
    });
}
function inserirDadosDebitoEmConta(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const conta = obj.conta;
        const documento = obj.documento;
        const nome = obj.nome;
        const valor = obj.valor;
        const descricao = obj.descricao;
        const sql = require('mssql');
        var retorno;
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            let codehash = helper_1.default.getHash();
            // CRÉDITO EM CONTA DESTINO
            let strSql = `INSERT INTO TB_MOV_CONTA_BANCARIA
                        (NUM_CONTA
                        ,VALOR
                        ,DOCUMENTO_DESTINO
                        ,NOME_DESTINO
                        ,TIPO_TRANSACAO
                        ,ID_ORIGEM_TRANSACAO
                        ,ID_STATUS_TRANSACAO
                        ,DESCRICAO
                        ,CODIGO_VALIDADOR)
                      VALUES
                        ('${conta}'
                        ,${valor}
                        ,'${documento}'
                        ,'${nome}'
                        ,'S'
                        ,'6'
                        ,'12'
                        ,'${descricao}'
                        ,'${codehash}')`;
            request.query(strSql, function (err, data) {
                if (err) {
                    retorno = err;
                }
                else {
                    retorno = 'Débito efetuado!';
                }
            });
        });
    });
}
class CtrDebitoEmConta {
    emitirDebitoEmConta(req, res) {
        let obj = req.body;
        obterSaldo(obj.conta)
            .then(saldo => {
            if (saldo >= obj.valor) {
                inserirDadosDebitoEmConta(res, obj)
                    .then(msg => {
                    helper_1.default.sendExtrato(res, HttpStatus.OK, 'Débito efetuado com sucesso!');
                })
                    .catch(error => console.error.bind(console, "Erro: " + error));
            }
            else {
                helper_1.default.sendExtrato(res, HttpStatus.OK, 'Saldo insuficiente!');
            }
        });
    }
}
exports.default = new CtrDebitoEmConta();

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
            const objeto = JSON.parse(JSON.stringify(response.data));
            resultado = objeto.saldo[0].saldo;
            return resultado;
        })
            .catch(function (error) {
            return error;
        });
    });
}
function inserirDadosTED(res, obj, nossoNumero) {
    return __awaiter(this, void 0, void 0, function* () {
        const valor = obj.valor;
        const codigo_banco_favorecido = obj.codigo_banco_favorecido;
        const agencia_favorecido = obj.agencia_favorecido;
        const conta_favorecido = obj.conta_favorecido;
        const tipo_conta_favorecido = obj.tipo_conta_favorecido;
        const nome_favorecido = obj.nome_favorecido;
        const documento_favorecido = obj.documento_favorecido;
        const conta = obj.conta;
        const descricao = obj.descricao;
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            let codehash = helper_1.default.getHash();
            // query to the database and get the records
            let strSql = (`INSERT INTO dbo.TB_MOV_CONTA_BANCARIA
                        (NUM_CONTA
                        ,VALOR
                        ,TIPO_TRANSACAO
                        ,ID_ORIGEM_TRANSACAO
                        ,NOME_DESTINO
                        ,DOCUMENTO_DESTINO
                        ,INSTITUICAO_DESTINO
                        ,ID_STATUS_TRANSACAO
                        ,AGENCIA_DESTINO
                        ,CONTA_DESTINO
                        ,TIPO_CONTA_DESTINO
                        ,DESCRICAO
                        ,NOSSO_NUMERO
                        ,CODIGO_VALIDADOR)
                    VALUES
                        (${conta}
                        ,${valor}
                        ,'S'
                        ,2
                        ,'${nome_favorecido}'
                        ,'${documento_favorecido}'
                        ,'${codigo_banco_favorecido}'
                        ,1
                        ,'${agencia_favorecido}'
                        ,'${conta_favorecido}'
                        ,'${tipo_conta_favorecido}'
                        ,'${descricao}'
                        ,'${nossoNumero}','${codehash}' )`);
            return request.query(strSql, function (err, data) {
                if (err) {
                    return err;
                }
            });
        });
    });
}
function emitirTED(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var nome;
        var email;
        var celular;
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            let strSql = `SELECT NOME AS nome
                            ,NUM_CPF_CNPJ AS documento
                            ,CONCAT(NUM_DDD_TELEFONE, NUM_TELEFONE) AS celular
                            ,EMAIL AS email
                      FROM TB_CLIENTES_TITULAR
                      WHERE NUM_CPF_CNPJ = '${obj.documento}'`;
            sql.query(strSql, function (err, results) {
                nome = results.recordset[0].nome;
                email = results.recordset[0].email;
                celular = results.recordset[0].celular;
                var tid = helper_1.default.getHash();
                var axios = require('axios');
                var data = JSON.stringify({
                    "Tid": tid,
                    "Pid": 20914,
                    "ProdId": 7374,
                    "Amount": obj.valor,
                    "DueDate": Date(),
                    "Bank": obj.codigo_banco_favorecido,
                    "BankAgency": obj.agencia_favorecido,
                    "BankAccount": obj.conta_favorecido,
                    "BankAccountType": obj.tipo_conta_favorecido,
                    "BankAccountHolder": obj.nome_favorecido,
                    "BankAccountHolderDoc": obj.documento_favorecido,
                    "BankAccountFgSavings": false,
                    "Name": nome,
                    "Email": email,
                    "Document": obj.documento,
                    "MobilePhone": celular,
                    "Description": obj.descricao
                });
                var config = {
                    method: 'post',
                    url: 'https://dev.meu.cash/apiv10Sandbox/transaction/out/transfer',
                    headers: {
                        'b189160e-59aa-406c-be9e-907ce515634f': '',
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                axios(config)
                    .then(function (response) {
                    const objeto = JSON.parse(JSON.stringify(response.data));
                    const resultado = objeto; //.Success;
                    inserirDadosTED(res, obj, tid)
                        .then(msg => {
                        ///Service.create(obj);
                        helper_1.default.sendSaldo(res, 201, 'TED efetuado com sucesso!');
                    })
                        .catch(error => console.error.bind(console, 'Erro:' + error));
                })
                    .catch(function (error) {
                    return 'Erro: ' + error;
                });
            });
        });
    });
}
class CtrTed1 {
    create(req, res) {
        let obj = req.body;
        obterSaldo(obj.conta)
            .then(saldo => {
            if (saldo >= obj.valor) {
                emitirTED(res, obj);
            }
            else {
                helper_1.default.sendSaldo(res, 401, 'Saldo insuficiente!');
            }
        });
    }
}
exports.default = new CtrTed1();

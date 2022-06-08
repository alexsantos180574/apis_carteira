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
function efetuarRecarga(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var nome = '';
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
                nome = helper_1.default.retirarAcentos(results.recordset[0].nome);
                email = results.recordset[0].email;
                celular = results.recordset[0].celular;
                var tid = helper_1.default.getHash();
                var axios = require('axios');
                var data = JSON.stringify({
                    "Tid": tid,
                    "Pid": 20914,
                    "ProdId": 7374,
                    "Product": "PhoneRecharge",
                    "RechargeOptionName": obj.nome_produto,
                    "CustomerIdentifier": obj.numero_telefone,
                    "Amount": obj.valor,
                    "Name": nome,
                    "Email": email,
                    "Document": obj.documento,
                    "MobilePhone": celular,
                    "Description": obj.descricao
                });
                var config = {
                    method: 'post',
                    url: 'https://dev.meu.cash/apiv10Sandbox/transaction/out/recharge/create',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                return axios(config)
                    .then(function (response) {
                    const objeto = JSON.parse(JSON.stringify(response.data));
                    const resultado = objeto;
                    inserirDadosRecarga(res, obj).then(() => helper_1.default.sendResponse(res, 201, 'Sua recarga foi efetuada com sucesso! Em breve você receberá uma mensagem de confirmação da operadora.'));
                })
                    .catch(error => console.error.bind(console, `Erro: ${error}`));
            });
        });
    });
}
function inserirDadosRecarga(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var valor = obj.valor;
        var conta = obj.conta;
        var descricao = "Recarga de celular";
        var giftcard = obj.nome_produto;
        var numero_telefone = obj.numero_telefone;
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            var request = new sql.Request();
            let strSql = (`INSERT INTO TB_MOV_CONTA_BANCARIA
                        (NUM_CONTA
                        ,VALOR
                        ,TIPO_TRANSACAO
                        ,ID_ORIGEM_TRANSACAO
                        ,ID_STATUS_TRANSACAO
                        ,DESCRICAO)
                       VALUES
                        (${conta}
                        ,${valor}
                        ,'S'
                        ,6
                        ,12
                        ,'${descricao} ${giftcard} para o número ${numero_telefone}')`);
            return request.query(strSql, function (err, data) {
                if (err) {
                    return err;
                }
            });
        });
    });
}
class CtrComprarGiftCard {
    emitirCompra(req, res) {
        let obj = req.body;
        efetuarRecarga(res, obj);
    }
}
exports.default = new CtrComprarGiftCard();

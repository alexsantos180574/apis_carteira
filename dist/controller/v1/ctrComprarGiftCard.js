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
function comprarGiftCard(res, obj) {
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
                    "Product": obj.id_produto,
                    "RechargeOptionName": obj.nome_produto,
                    "CustomerIdentifier": celular,
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
                    //console.log(objeto);
                    if (objeto.StatusCode == 200) {
                        obtemCodigoGiftCard(tid)
                            .then(cod => {
                            let codigoGift = (obj.nome_produto != "GOOGLE PLAY RECARGA") ? ((cod == "Payout") ? '00000000000' : cod) : '';
                            let msg = (codigoGift == '') ? 'Você receberá um email ou SMS da operadora em breve!' : '';
                            inserirDadosCompra(res, obj).then(() => helper_1.default.sendResponse(res, 201, { mensagem: 'Compra do GiftCard efetuada com sucesso! ' + msg, codigo: codigoGift }));
                        });
                    }
                    else {
                        helper_1.default.sendErro(res, 401, objeto.Message);
                    }
                })
                    .catch(error => console.error.bind(console, `Erro: ${error}`));
            });
        });
    });
}
function obtemCodigoGiftCard(Tid) {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var config = {
            method: 'get',
            url: 'https://dev.meu.cash/apiv10Sandbox/transaction/getByTid/' + Tid + '/pid/20914',
            headers: {}
        };
        //console.log(Tid);
        return axios(config)
            .then(function (response) {
            //console.log(JSON.stringify(response.data));
            let rest = JSON.parse(JSON.stringify(response.data));
            //console.log(rest);
            return rest.Result.Transaction.Custom;
        })
            .catch(function (error) {
            console.log(error);
            return error;
        });
    });
}
function inserirDadosCompra(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var valor = obj.valor;
        var conta = obj.conta;
        var descricao = 'Compra do GiftCard';
        var giftcard = obj.nome_produto;
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
                        ,'${descricao} ${giftcard}')`);
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
        comprarGiftCard(res, obj);
    }
}
exports.default = new CtrComprarGiftCard();

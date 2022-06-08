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
function inserirDadosDeposito(res, obj, arr) {
    return __awaiter(this, void 0, void 0, function* () {
        const client_id = obj.client_id;
        const token_hash = obj.token;
        const valor = obj.valor;
        const descricao = obj.descricao;
        const nome = obj.nome;
        const email = obj.email;
        const celular = obj.celular;
        const documento = obj.documento;
        const num_banco_origem = obj.num_banco_origem;
        let arrDadosBancarios = [];
        let agencia_banco_fastcash = '';
        let num_conta_fastcash = '';
        let nome_fastcash = '';
        let url_img_fastcash = '';
        let documento_fastcash = '';
        let nome_banco_fastcash = '';
        let num_banco_fastcash = '';
        for (var i in arr) {
            nome_banco_fastcash = (arr[i].Id == 'bank') ? arr[i].Value : nome_banco_fastcash;
            agencia_banco_fastcash = (arr[i].Id == 'agency') ? arr[i].Value : agencia_banco_fastcash;
            num_conta_fastcash = (arr[i].Id == 'account') ? arr[i].Value : num_conta_fastcash;
            nome_fastcash = (arr[i].Id == 'accountholder') ? arr[i].Value : nome_fastcash;
            documento_fastcash = (arr[i].Id == 'accountholderdocument') ? arr[i].Value : documento_fastcash;
            num_banco_fastcash = (arr[i].Id == 'banknumber') ? arr[i].Value : num_banco_fastcash;
            url_img_fastcash = (arr[i].Id == 'bankimgurl') ? arr[i].Value : url_img_fastcash;
        }
        arrDadosBancarios.push({
            banco_fastcash: nome_banco_fastcash,
            agencia_fastcash: agencia_banco_fastcash,
            conta_fastcash: num_conta_fastcash,
            nome_fastcash: nome_fastcash,
            documento_fastcash: documento_fastcash,
            num_banco_fastcash: num_banco_fastcash,
            url_img_fastcash: url_img_fastcash
        });
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            var request = new sql.Request();
            let strSql = (`INSERT INTO dbo.TB_AGUARDA_COMPROVANTE
                        (CLIENT_ID
                        ,TOKEN_HASH
                        ,VALOR
                        ,DESCRICAO
                        ,NOME
                        ,EMAIL
                        ,TELEFONE
                        ,DOCUMENTO
                        ,BANCO_ORIGEM
                        ,NUM_BANCO_FASTCASH
                        ,AGENCIA_FASTCASH
                        ,CONTA_FASTCASH
                        ,NOME_FASTCASH
                        ,URL_IMG_FASTCASH
                        ,DOCUMENTO_FASTCASH
                        ,NOME_BANCO_FASTCASH
                        ,TIPO_ENVIO)
                       VALUES
                        ('${client_id}',
                        '${token_hash}',
                        '${valor}',
                        '${descricao}',
                        '${nome}',
                        '${email}',
                        '${celular}',
                        '${documento}',
                        '${num_banco_origem}',
                        '${num_banco_fastcash}',
                        '${agencia_banco_fastcash}',
                        '${num_conta_fastcash}',
                        '${nome_fastcash}',
                        '${url_img_fastcash}',
                        '${documento_fastcash}',
                        '${nome_banco_fastcash}',
                        1)`);
            request.query(strSql, function (err, data) {
                if (err) {
                    console.log(err);
                    helper_1.default.sendErro(res, 401, 'Falha ao receber o Depósito!');
                }
                else {
                    helper_1.default.sendResponse(res, 201, arrDadosBancarios);
                }
            });
        });
    });
}
function retornarDadosDeposito(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var codigo_fastcash;
        switch (obj.num_banco_origem) {
            case '001': // Banco do Brasil
                codigo_fastcash = 1;
                break;
            case '237': // Bradesco
                codigo_fastcash = 2;
                break;
            case '104': // Caixa Econômica Federal
                codigo_fastcash = 3;
                break;
            case '341': // Itaú
                codigo_fastcash = 4;
                break;
            case '033': // Santander
                codigo_fastcash = 5;
                break;
            case '041': // Banrisul
                codigo_fastcash = 8;
                break;
            case '001': // Corrreios
                codigo_fastcash = 10;
                break;
            case '104': // Lotéricas
                codigo_fastcash = 11;
        }
        ;
        var axios = require('axios');
        var data = JSON.stringify({
            "Tid": obj.token,
            "Pid": 110,
            "ProdId": 3993,
            "Custom": "",
            "Amount": obj.valor,
            "Description": obj.descricao,
            "PaymentMethod": 1,
            "SubPaymentMethod": codigo_fastcash,
            "Name": obj.nome,
            "Email": obj.email,
            "MobilePhone": obj.celular,
            "Document": obj.documento
        });
        var config = {
            method: 'post',
            url: 'https://www.fastcash.com.br/apiv10Sandbox/transaction/in/deposit',
            headers: {
                'Authorization': 'APIKEY 97f96887-7961-48fe-9dae-8d70debc8832',
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
            .then(function (response) {
            //console.log(JSON.stringify(response.data));
            const resultado = JSON.parse(JSON.stringify(response.data));
            inserirDadosDeposito(res, obj, resultado.Result.Parameters);
        })
            .catch(function (error) {
            console.log(error);
            helper_1.default.sendErro(res, 401, 'Falha ao carregar as informações!');
        });
    });
}
class CtrReceberDeposito {
    emitirDadosDeposito(req, res) {
        let obj = req.body;
        retornarDadosDeposito(res, obj);
    }
}
exports.default = new CtrReceberDeposito();

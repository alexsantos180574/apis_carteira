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
function inserirCompraP(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var nome;
        var email;
        var celular;
        var tratarCampos = '';
        const valor = (obj.valor != '' ? obj.valor : tratarCampos = 'valor');
        const descricao = (obj.descricao != '' ? obj.descricao : tratarCampos = 'descricao');
        const documento = (obj.documento != '' ? obj.documento : tratarCampos = 'documento');
        const bandeira_cartao = (obj.bandeira_cartao != '' ? obj.bandeira_cartao : tratarCampos = 'bandeira_cartao');
        const mes_validade_cartao = (obj.mes_validade_cartao != '' ? obj.mes_validade_cartao : tratarCampos = 'mes_validade_cartao');
        const ano_validade_cartao = (obj.ano_validade_cartao != '' ? obj.ano_validade_cartao : tratarCampos = 'ano_validade_cartao');
        const nome_no_cartao = (obj.nome_no_cartao != '' ? obj.nome_no_cartao : tratarCampos = 'nome_no_cartao');
        const numero_cartao = (obj.numero_cartao != '' ? obj.numero_cartao : tratarCampos = 'numero_cartao');
        const cvv_cartao = (obj.cvv_cartao != '' ? obj.cvv_cartao : tratarCampos = 'cvv_cartao');
        const guardadados = ((typeof (obj.guarda_dados) == "undefined" ? '0' : (obj.guarda_dados == '' ? '0' : obj.guarda_dados)));
        if (tratarCampos == '') {
            const sqlLista = require('mssql');
            return sqlLista.connect(helper_1.default.configSql, function (err) {
                if (err)
                    console.log(err);
                // query to the database and get the records 
                let strSql = `SELECT NOME AS nome
                                ,NUM_CPF_CNPJ AS documento
                                ,CONCAT(NUM_DDD_TELEFONE, NUM_TELEFONE) AS celular
                                ,EMAIL AS email
                        FROM TB_CLIENTES_TITULAR
                        WHERE NUM_CPF_CNPJ = '${documento}' `;
                return sqlLista.query(strSql, function (err, results) {
                    /* Verifica se o Cliente existe */
                    if (results.rowsAffected[0] > 0) {
                        nome = results.recordset[0].nome;
                        email = results.recordset[0].email;
                        celular = results.recordset[0].celular;
                        var request = new sqlLista.Request();
                        // query to the database and get the records
                        let strSql = (`INSERT INTO TB_COMPRAS_CARTAO
                                (VALOR
                                ,DESCRICAO
                                ,NOME
                                ,EMAIL
                                ,CELULAR
                                ,DOCUMENTO
                                ,BANDEIRA_CARTAO
                                ,MES_VALIDADE_CARTAO
                                ,ANO_VALIDADE_CARTAO
                                ,NOME_NO_CARTAO
                                ,NUMERO_CARTAO
                                ,CVV_CARTAO
                                ,GUARDA_DADOS)
                            VALUES
                                (${valor}
                                ,'${descricao}'
                                ,'${nome}'
                                ,'${email}'
                                ,'${celular}'
                                ,'${documento}'
                                ,'${bandeira_cartao}'
                                ,'${mes_validade_cartao}'
                                ,'${ano_validade_cartao}'
                                ,'${nome_no_cartao}'
                                ,'${numero_cartao}'
                                ,'${cvv_cartao}'
                                ,'${guardadados}')`);
                        return request.query(strSql, function (err, data) {
                            if (err) {
                                console.log(err);
                                helper_1.default.sendErro(res, 500, 'Erro ao efetuar o cadastro!');
                                return false;
                            }
                            else {
                                helper_1.default.sendResponse(res, 201, 'Compra efetuada com sucesso!');
                                return true;
                            }
                        });
                    }
                    else {
                        helper_1.default.sendNaoEncontrado(res, 402, 'Cliente nao encontrado');
                        return false;
                    }
                });
            });
        }
        else {
            res.status(400).send({ erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false });
        }
    });
}
function inserirCartaoP(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const documento = obj.documento;
        const bandeira_cartao = obj.bandeira_cartao;
        const mes_validade_cartao = obj.mes_validade_cartao;
        const ano_validade_cartao = obj.ano_validade_cartao;
        const nome_no_cartao = obj.nome_no_cartao;
        const numero_cartao = obj.numero_cartao;
        const cvv_cartao = obj.cvv_cartao;
        const tipo_cartao = obj.tipo_cartao;
        const sqlCount = require('mssql');
        return sqlCount.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            let strSql = `SELECT NUMERO_CARTAO
                      FROM TB_CARTAO_DE_CREDITO
                      WHERE NUMERO_CARTAO = '${numero_cartao}'
                         AND DOCUMENTO = '${documento}'`;
            return sqlCount.query(strSql, function (err, results) {
                if (results.rowsAffected[0] == 0) {
                    const sqlccred = require('mssql');
                    sqlccred.connect(helper_1.default.configSql, function (err) {
                        if (err)
                            console.log(err);
                        // create Request object
                        var request = new sqlccred.Request();
                        // query to the database and get the records
                        let strSql = (`INSERT INTO TB_CARTAO_DE_CREDITO
                                    (DOCUMENTO
                                    ,BANDEIRA_CARTAO
                                    ,MES_VALIDADE_CARTAO
                                    ,ANO_VALIDADE_CARTAO
                                    ,NOME_NO_CARTAO
                                    ,NUMERO_CARTAO
                                    ,CVV_CARTAO
                                    ,TIPO_CARTAO)
                                   VALUES
                                    ('${documento}'
                                    ,'${bandeira_cartao}'
                                    ,'${mes_validade_cartao}'
                                    ,'${ano_validade_cartao}'
                                    ,'${nome_no_cartao}'
                                    ,'${numero_cartao}'
                                    ,'${cvv_cartao}'
                                    ,'1')`);
                        return request.query(strSql, function (err, data) {
                            if (err) {
                                return err;
                            }
                            ;
                        });
                    });
                }
            });
        });
    });
}
function emitirCompraP(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var nome;
        var email;
        var celular;
        const sqlLista = require('mssql');
        sqlLista.connect(helper_1.default.configSql, function (err) {
            let tratarCampos = '';
            const valor = (obj.valor != '' ? obj.valor : tratarCampos = 'valor');
            const descricao = (obj.descricao != '' ? obj.descricao : tratarCampos = 'descricao');
            const documento = (obj.documento != '' ? obj.documento : tratarCampos = 'documento');
            const bandeira_cartao = (obj.bandeira_cartao != '' ? obj.bandeira_cartao : tratarCampos = 'bandeira_cartao');
            const mes_validade_cartao = (obj.mes_validade_cartao != '' ? obj.mes_validade_cartao : tratarCampos = 'mes_validade_cartao');
            const ano_validade_cartao = (obj.ano_validade_cartao != '' ? obj.ano_validade_cartao : tratarCampos = 'ano_validade_cartao');
            const nome_no_cartao = (obj.nome_no_cartao != '' ? obj.nome_no_cartao : tratarCampos = 'nome_no_cartao');
            const numero_cartao = (obj.numero_cartao != '' ? obj.numero_cartao : tratarCampos = 'numero_cartao');
            const cvv_cartao = (obj.cvv_cartao != '' ? obj.cvv_cartao : tratarCampos = 'cvv_cartao');
            const parcelas = ((typeof (obj.parcelas) == "undefined" ? '1' : (obj.parcelas == '' ? '1' : obj.parcelas)));
            if (tratarCampos == '') {
                if (err)
                    console.log(err);
                // query to the database and get the records 
                let strSql = `SELECT NOME AS nome
                                ,NUM_CPF_CNPJ AS documento
                                ,CONCAT(NUM_DDD_TELEFONE, NUM_TELEFONE) AS celular
                                ,EMAIL AS email
                        FROM TB_CLIENTES_TITULAR
                        WHERE NUM_CPF_CNPJ = '${obj.documento}'`;
                sqlLista.query(strSql, function (err, results) {
                    //console.log(results.recordset);
                    //console.log(results);
                    nome = results.recordset[0].nome;
                    email = results.recordset[0].email;
                    celular = results.recordset[0].celular;
                    let tid = helper_1.default.getHash();
                    var axios = require('axios');
                    var data = JSON.stringify({
                        "Tid": tid,
                        "Pid": 20914,
                        "ProdId": 7374,
                        "Custom": "",
                        "Amount": obj.valor,
                        "Description": obj.descricao,
                        "Name": nome,
                        "Email": email,
                        "MobilePhone": celular,
                        "Document": obj.documento,
                        "CreditCard": {
                            "Alias": "padrao",
                            "Brand": obj.bandeira_cartao,
                            "ExpirationMonth": obj.mes_validade_cartao,
                            "ExpirationYear": obj.ano_validade_cartao,
                            "HolderName": obj.nome_no_cartao,
                            "Number": obj.numero_cartao,
                            "Cvv": obj.cvv_cartao
                        },
                        "Capture": true,
                        "Installments": parcelas
                    });
                    var config = {
                        method: 'post',
                        url: 'https://dev.pci.meu.cash/apiv10/transaction/in/creditcard',
                        headers: {
                            'Authorization': 'APIKEY b189160e-59aa-406c-be9e-907ce515634f',
                            'Content-Type': 'application/json'
                        },
                        data: data
                    };
                    return axios(config)
                        .then(function (response) {
                        const objeto = JSON.parse(JSON.stringify(response.data));
                        if (objeto.Success) {
                            inserirCompraP(res, obj)
                                .then(() => {
                                if (obj.guarda_dados === 1) {
                                    inserirCartaoP(obj);
                                }
                            });
                        }
                        else {
                            helper_1.default.sendErro(res, 500, objeto.Message);
                        }
                        const resultado = objeto.Message;
                        return resultado;
                    })
                        .catch(function (error) {
                        helper_1.default.sendCartao(res, 500, error);
                    });
                });
            }
            else {
                res.status(400).send({ erro: `o campo "${tratarCampos}" é obrigatorio!`, status: false });
            }
        });
    });
}
class CtrCompraCartaoDeCreditoP {
    emitirCompraCartaoP(req, res) {
        let obj = req.body;
        emitirCompraP(res, obj);
    }
}
exports.default = new CtrCompraCartaoDeCreditoP();

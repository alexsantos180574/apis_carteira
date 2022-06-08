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
function inserirCartao(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var tratarCampos = '';
        const documento = (obj.documento != '' ? obj.documento : tratarCampos = 'documento');
        const cpf_titular_cartao = (obj.cpf_titular_cartao != '' ? obj.cpf_titular_cartao : tratarCampos = 'cpf_titular_cartao');
        const bandeira_cartao = (obj.bandeira_cartao != '' ? obj.bandeira_cartao : tratarCampos = 'bandeira_cartao');
        const mes_validade_cartao = (obj.mes_validade_cartao != '' ? obj.mes_validade_cartao : tratarCampos = 'mes_validade_cartao');
        const ano_validade_cartao = (obj.ano_validade_cartao != '' ? obj.ano_validade_cartao : tratarCampos = 'ano_validade_cartao');
        const nome_no_cartao = (obj.nome_no_cartao != '' ? obj.nome_no_cartao : tratarCampos = 'nome_no_cartao');
        const numero_cartao = (obj.numero_cartao != '' ? obj.numero_cartao : tratarCampos = 'numero_cartao');
        const cvv_cartao = (obj.cvv_cartao != '' ? obj.cvv_cartao : tratarCampos = 'cvv_cartao');
        const tipo_cartao = (obj.tipo_cartao != '' ? obj.tipo_cartao : tratarCampos = 'tipo_cartao');
        if (tratarCampos == '') {
            const sqlccred = require('mssql');
            sqlccred.connect(helper_1.default.configSql, function (err) {
                if (err)
                    console.log(err);
                // create Request object
                var request = new sqlccred.Request();
                // query to the database and get the records
                let strSql = (`INSERT INTO TB_CARTAO_DE_CREDITO
                                (DOCUMENTO
                                ,CPF_TITULAR
                                ,BANDEIRA_CARTAO
                                ,MES_VALIDADE_CARTAO
                                ,ANO_VALIDADE_CARTAO
                                ,NOME_NO_CARTAO
                                ,NUMERO_CARTAO
                                ,CVV_CARTAO
                                ,TIPO_CARTAO)
                        VALUES
                                ('${documento}'
                                ,'${cpf_titular_cartao}'
                                ,'${bandeira_cartao}'
                                ,'${mes_validade_cartao}'
                                ,'${ano_validade_cartao}'
                                ,'${nome_no_cartao}'
                                ,'${numero_cartao}'
                                ,'${cvv_cartao}'
                                ,'1')`);
                return request.query(strSql, function (err, data) {
                    if (err) {
                        console.log(err);
                        helper_1.default.sendFalha(res, 500, 'Falha ao atualizar cadastrar o catão!');
                    }
                    else {
                        helper_1.default.sendResponse(res, 201, 'Dados do cartão cadastrados com sucesso!');
                    }
                });
            });
        }
        else {
            res.status(400).send({ erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false });
        }
    });
}
class CtrCartaoDeCredito {
    inserir(req, res) {
        let obj = req.body;
        inserirCartao(res, obj);
    }
}
exports.default = new CtrCartaoDeCredito();

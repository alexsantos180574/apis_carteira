"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
const HttpStatus = require("http-status");
class atuSenha {
    atualizaSenha(req, res) {
        var obj = req.body;
        let num_cpf_cnpj = req.params.documento;
        let token = obj.token;
        let client_id = obj.client_id;
        let senha_atual = obj.senha_atual;
        let senha_nova = obj.senha_nova;
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            // CRÉDITO EM CONTA DESTINO
            let sqlStr = `SELECT NUM_CPF_CNPJ FROM TB_CLIENTES_TITULAR where NUM_CPF_CNPJ = '${num_cpf_cnpj}' AND SENHA_ACESSO = '${senha_atual}' `;
            request.query(sqlStr, function (err, data) {
                if (data.rowsAffected[0] > 0) {
                    let sqlStrU = ` UPDATE TB_CLIENTES_TITULAR SET SENHA_ACESSO = '${senha_nova}' where NUM_CPF_CNPJ = '${num_cpf_cnpj}' `;
                    request.query(sqlStrU, function (err, data) {
                        if (err) {
                            console.log(err);
                            helper_1.default.sendFalha(res, HttpStatus.OK, 'Falha ao atualizar os dados!');
                        }
                        else {
                            helper_1.default.sendResponse(res, HttpStatus.OK, 'Senha alterada com sucesso!');
                        }
                    });
                }
                else {
                    helper_1.default.sendNaoEncontradoMsgPersonalizada(res, HttpStatus.OK, 'Senha atual não confere!');
                }
            });
        });
    }
}
exports.default = new atuSenha();

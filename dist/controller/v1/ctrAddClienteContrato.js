"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
const cadastrarUsuarioContrato = (res, obj) => {
    const token = obj.token;
    const client_id = obj.client_id;
    const nome_completo = obj.nome_completo;
    const estado_civil = obj.estado_civil;
    const rg = obj.rg;
    const cpf = obj.cpf;
    const orgao_emissor = obj.orgao_emissor;
    const email = obj.email;
    const nacionalidade = obj.nacionalidade;
    const profissao = obj.profissao;
    const empresa = obj.empresa;
    const endereco = obj.endereco;
    const complemento = obj.complemento;
    const bairro = obj.bairro;
    const cidade = obj.cidade;
    const uf = obj.uf;
    const numero = obj.numero;
    const sql = require("mssql");
    sql.connect(helper_1.default.configSql, (err) => {
        if (err)
            console.log(err);
        let request = new sql.Request();
        sql.connect(helper_1.default.configSql, (err) => {
            if (err)
                console.log(err);
            let strSql = `SELECT CPF FROM TB_CLIENTE_CONTRATO WHERE CPF = '${cpf}'`;
            sql.query(strSql, (err, results) => {
                if (results.rowsAffected[0] > 0) {
                    helper_1.default.sendErro(res, 409, "CPF já cadastrado!");
                }
                else {
                    let strSql = ` EXEC sp_cadastro_confidencialidade '${nome_completo}', '${estado_civil}','${rg}','${cpf}','${orgao_emissor}','${email}','${nacionalidade}','${profissao}','${empresa}', '${endereco}','${complemento}','${bairro}','${cidade}','${uf}','${numero}' `;
                    if (strSql.indexOf("undefined") < 0) {
                        request.query(strSql, (err, data) => {
                            if (err) {
                                helper_1.default.sendFalhaCadastro(res, 500, "Falha ao realizar cadastro!");
                                console.log(err);
                            }
                            else {
                                helper_1.default.sendResponse(res, 201, "Cadastro efetuado com sucesso!");
                            }
                        });
                    }
                    else {
                        helper_1.default.sendErro(res, 400, "Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!");
                    }
                }
            });
        });
    });
};
class ctrAddUsuarioContrato {
    cadastraUsuarioContrato(req, res) {
        let obj = req.body;
        cadastrarUsuarioContrato(res, obj);
    }
}
exports.default = new ctrAddUsuarioContrato();

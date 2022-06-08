"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
class atuClientes {
    atualizaCliente(req, res) {
        var obj = req.body;
        var tratarCampos = '';
        let num_cpf_cnpj = req.params.documento;
        let token = obj.token;
        let client_id = obj.client_id;
        let nome = (obj.nome.toString() != '' ? obj.nome.toString() : tratarCampos = 'nome');
        let data_nascimento = (obj.data_nascimento.toString() != '' ? obj.data_nascimento : tratarCampos = 'data_nascimento');
        let num_ddd_telefone = (obj.num_ddd_telefone.toString() != '' ? obj.num_ddd_telefone : tratarCampos = 'num_ddd_telefone');
        let num_telefone = (obj.num_telefone.toString() != '' ? obj.num_telefone : tratarCampos = 'num_telefone');
        let email = (obj.email.toString() != '' ? obj.email.toString() : tratarCampos = 'email');
        let cep = (obj.cep.toString() != '' ? obj.cep.toString() : tratarCampos = 'cep');
        let endereco = (obj.endereco.toString() != '' ? obj.endereco.toString() : tratarCampos = 'endereco');
        let numero = (obj.numero.toString() != '' ? obj.numero : tratarCampos = 'numero');
        let complemento = (obj.complemento.toString() != '' ? obj.complemento.toString() : tratarCampos = 'complemento');
        let bairro = (obj.bairro.toString() != '' ? obj.bairro.toString() : tratarCampos = 'bairro');
        let cidade = (obj.cidade.toString() != '' ? obj.cidade.toString() : tratarCampos = 'cidade');
        let uf = (obj.uf.toString() != '' ? obj.uf.toString() : tratarCampos = 'uf');
        let patrimonio = (obj.patrimonio != '' ? obj.patrimonio : tratarCampos = 'patrimonio');
        let renda = (obj.renda != '' ? obj.renda : tratarCampos = 'renda');
        let id_profissao = (obj.id_profissao != '' ? obj.id_profissao : tratarCampos = 'id_profissao');
        let pep = (obj.pep != '' ? obj.pep : tratarCampos = 'pep');
        let nome_fantasia = (obj.nome_fantasia != '' ? obj.nome_fantasia : tratarCampos = 'nome_fantasia');
        if (tratarCampos == '') {
            const sql = require('mssql');
            sql.connect(helper_1.default.configSql, function (err) {
                if (err)
                    console.log(err);
                // create Request object
                var request = new sql.Request();
                // CRÉDITO EM CONTA DESTINO
                let sqlStr = `EXEC dbo.sp_atualiza_dados_cliente '${nome}'
                                                                ,'${data_nascimento}'
                                                                ,'${num_cpf_cnpj}'
                                                                ,'${num_ddd_telefone}'
                                                                ,'${num_telefone}'
                                                                ,'${email}'
                                                                ,'${cep}'
                                                                ,'${endereco}'
                                                                ,'${numero}'
                                                                ,'${complemento}'
                                                                ,'${bairro}'
                                                                ,'${cidade}'
                                                                ,'${uf}'
                                                                ,'${renda}'
                                                                ,'${pep}'
                                                                ,'${id_profissao}'
                                                                ,'${patrimonio}'
                                                                ,'${nome_fantasia}'`;
                request.query(sqlStr, function (err, data) {
                    if (err) {
                        console.log(err);
                        helper_1.default.sendFalha(res, 500, 'Falha ao atualizar os dados!');
                    }
                    else {
                        helper_1.default.sendResponse(res, 201, 'Cadastro atualizado com sucesso!');
                    }
                });
            });
        }
        else {
            res.status(400).send({ erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false });
        }
    }
}
exports.default = new atuClientes();

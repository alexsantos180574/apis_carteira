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
function novoUsuario(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        let tratarCampos = '';
        let token = obj.token;
        let client_id = obj.client_id;
        let nome = (obj.nome != '' ? obj.nome : tratarCampos = 'nome');
        let num_cpf_cnpj = (obj.num_cpf_cnpj != '' ? obj.num_cpf_cnpj : tratarCampos = 'num_cpf_cnpj');
        let num_ddd_telefone = (obj.num_ddd_telefone != '' ? obj.num_ddd_telefone : tratarCampos = 'num_ddd_telefone');
        let num_telefone = (obj.num_telefone != '' ? obj.num_telefone : tratarCampos = 'num_telefone');
        let email = (obj.email != '' ? obj.email : tratarCampos = 'email');
        let senha_acesso = (obj.senha_acesso != '' ? obj.senha_acesso : tratarCampos = 'senha_acesso');
        if (tratarCampos == '') {
            let codehash = helper_1.default.getHash();
            const sql = require('mssql');
            sql.connect(helper_1.default.configSql, function (err) {
                if (err)
                    console.log(err);
                // create Request object
                var request = new sql.Request();
                // CRÉDITO EM CONTA DESTINO
                let sqlStr = `EXEC dbo.sp_novo_usuarios_independentes '${codehash}', '${senha_acesso}', '${num_cpf_cnpj}', '${nome}', ${num_telefone}, ${num_ddd_telefone}, '${email}' `;
                /////console.log(sqlStr);
                request.query(sqlStr, function (err, data) {
                    if (err) {
                        console.log(err);
                        helper_1.default.sendErro(res, 500, 'Erro ao efetuar o cadastro!');
                    }
                    else {
                        helper_1.default.sendResponse(res, 201, 'Cadastro efetuado com sucesso!');
                    }
                });
            });
        }
        else {
            res.status(400).send({ erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false });
        }
    });
}
class cadUsuarioAcessoRapido {
    incUsuario(req, res) {
        var obj = req.body;
        novoUsuario(res, obj)
            .then(msg => {
            helper_1.default.sendResponse(res, HttpStatus.OK, 'Cadastro efetuado com sucesso!');
        })
            .catch(error => console.error.bind(console, "Erro: " + error));
    }
}
exports.default = new cadUsuarioAcessoRapido();

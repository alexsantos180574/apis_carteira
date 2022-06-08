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
////import mdlExtrato from "../models/mdlExtrato";
const helper_1 = require("../../infra/helper");
function efetuaCadastro(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = obj.token.toString();
        const client_id = obj.client_id.toString();
        const banco = obj.banco.toString();
        const agencia = obj.agencia.toString();
        const conta = obj.conta.toString();
        const banco_favorito = obj.banco_favorito.toString();
        const agencia_favorito = obj.agencia_favorito.toString();
        const conta_favorito = obj.conta_favorito.toString();
        const nome_favorito = obj.nome_favorito.toString();
        const cpf_favorecido = obj.cpf_favorecido.toString();
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            var request = new sql.Request();
            let strSql = `INSERT INTO TB_FAVORITOS_CONTAS_TRANSFERENCIAS(NUM_BANCO_ORIGEM, NUM_AGENCIA_ORIGEM, CONTA_ORIGEM, NOME, CPF, NUM_CONTA, NUM_BANCO, NUM_AGENCIA)
        VALUES('${banco}','${agencia}','${conta}','${nome_favorito}','${cpf_favorecido}','${conta_favorito}','${banco_favorito}','${agencia_favorito}')`;
            //console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err) {
                    //res.status(500).send({erro: 'Falha ao realizar o cadastro!', status: false});
                    helper_1.default.sendFalhaCadastro(res, 500, 'Falha ao realizar cadastro!');
                    console.log(err);
                }
                else {
                    helper_1.default.sendResponse(res, 201, 'Cadastro efetuado com sucesso!');
                }
            });
        });
    });
}
class ctrAddFavoritosContas {
    cadastrarFavoritoConta(req, res) {
        let obj = req.body;
        ///console.log(obj.conta);
        efetuaCadastro(res, obj);
    }
}
exports.default = new ctrAddFavoritosContas();

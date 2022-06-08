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
function excluirDadosFavorito(res, cod) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            var request = new sql.Request();
            let strSql = `DELETE TB_CARTAO_DE_CREDITO WHERE ID_CARTAO = '${cod}' `;
            //console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err) {
                    console.log(err);
                    helper_1.default.sendFalhaCadastro(res, 500, 'Falha ao excluir o item selecionado!');
                }
                else {
                    helper_1.default.sendResponse(res, 201, 'Exclusão efetuada com sucesso!');
                }
            });
        });
    });
}
class ctrExcluirFavoritosContas {
    excluirFavoritoCartao(req, res) {
        excluirDadosFavorito(res, req.params.cod);
    }
}
exports.default = new ctrExcluirFavoritosContas();

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
function efetuaCadastro(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        //const token             = obj.token;
        const cpfCnpf = obj.cpfcnpj;
        const client_id = obj.client_id;
        const constant = obj.constant;
        const sync = obj.sync;
        const async = obj.async;
        const hooks = obj.hooks;
        const gpsinfo = obj.gps;
        const acao = obj.acao;
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err) {
                console.log(err);
                helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
            }
            else {
                var request = new sql.Request();
                let strSql = `INSERT INTO TB_INFO_APARELHOS(NUM_CPF_CNPJ, HASH_APLICACAO_PARCEIRO, CONSTANT, SYNC, ASYNC, HOOKS, GPS_INFO, ID_TIPO_ACAO)
            VALUES('${cpfCnpf}','${client_id}','${constant}','${sync}','${async}','${hooks}', '${gpsinfo}', '${acao}' ) `;
                //console.log(strSql);
                request.query(strSql, function (err, data) {
                    if (err) {
                        console.log(err);
                        helper_1.default.sendFalhaCadastro(res, 500, 'Falha ao realizar cadastro!');
                    }
                    else {
                        helper_1.default.sendResponse(res, 201, 'Cadastro efetuado com sucesso!');
                    }
                });
            }
        });
    });
}
class ctrAddInformacoesAparelhos {
    cadastrarInformacoesAparelhos(req, res) {
        let obj = req.body;
        efetuaCadastro(res, obj);
    }
}
exports.default = new ctrAddInformacoesAparelhos();

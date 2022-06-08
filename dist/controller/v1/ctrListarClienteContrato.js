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
const buscarCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = require("mssql");
    sql.connect(helper_1.default.configSql, (err) => {
        if (err)
            console.log(err);
        let strSql = `SELECT * FROM vw_cliente_endereco WHERE CPF = '${req.params.cpf}'`;
        let request = new sql.Request();
        request.query(strSql, (err, data) => {
            if (err || data.recordset[0] == null || data.recordset[0] == "") {
                helper_1.default.sendErro(res, 400, "CPF não encontrado ou paramêtro mal informado!");
            }
            else {
                helper_1.default.sendResponse(res, 200, data.recordset);
            }
        });
    });
});
class ctrListarClienteContrato {
    listarClientesContrato(req, res) {
        buscarCliente(req, res);
    }
}
exports.default = new ctrListarClienteContrato();

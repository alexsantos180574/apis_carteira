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
exports.POST = exports.PUT = exports.GET = exports.cpfcnpjExiste = exports.validarTokenSync = void 0;
const helper_1 = require("../infra/helper");
function runQuery(query) {
    const sql = require('mssql');
    return sql.connect(helper_1.default.configSql()).then((pool) => {
        return pool.query(query);
    });
}
function validarTokenSync(token) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ` select access_token `;
        strSql += `from tb_tokens `;
        strSql += ` where access_token = '${token}' and valido = 'S' `;
        return runQuery(strSql);
    });
}
exports.validarTokenSync = validarTokenSync;
function cpfcnpjExiste(cpf_cnpj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ` select nome, num_cpf_cnpj from tb_clientes_titular where num_cpf_cnpj = '${cpf_cnpj}' and client_id = '${client_id}'`;
        return runQuery(strSql);
    });
}
exports.cpfcnpjExiste = cpfcnpjExiste;
function GET(strSql) {
    return __awaiter(this, void 0, void 0, function* () {
        return runQuery(strSql);
    });
}
exports.GET = GET;
function PUT(strSQL) {
    return __awaiter(this, void 0, void 0, function* () {
        return runQuery(strSQL);
    });
}
exports.PUT = PUT;
function POST(strSQL) {
    return __awaiter(this, void 0, void 0, function* () {
        return runQuery(strSQL);
    });
}
exports.POST = POST;
class mdlComandosSql {
}
exports.default = new mdlComandosSql();

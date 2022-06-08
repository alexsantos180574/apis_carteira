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
function exibirListaBancos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var config = {
            method: 'get',
            url: 'https://dev.meu.cash/apiv10Sandbox/transaction/subPaymentMethods/2',
            headers: {}
        };
        axios(config)
            .then(function (response) {
            //console.log(JSON.stringify(response.data));
            const objeto = JSON.parse(JSON.stringify(response.data));
            const resultado = objeto;
            let arrResultado = [];
            for (var i in resultado.Result) {
                arrResultado.push({
                    id: resultado.Result[i].Id,
                    nome_banco: resultado.Result[i].Name,
                    numero_banco: resultado.Result[i].BankNumber,
                    icone: resultado.Result[i].Icone
                });
            }
            helper_1.default.sendResponse(res, 200, arrResultado);
        })
            .catch(function (error) {
            console.log(error);
            helper_1.default.sendErro(res, 401, 'Falha ao carregar as informações!');
        });
    });
}
class CtrListarInformacoesBancos {
    obterLista(req, res) {
        exibirListaBancos(req, res);
    }
}
exports.default = new CtrListarInformacoesBancos();

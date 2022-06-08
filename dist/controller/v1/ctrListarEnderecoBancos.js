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
function listarBancos() {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var config = {
            method: 'get',
            url: 'https://dev.meu.cash/apiv10Sandbox/transaction/subPaymentMethods/1',
            headers: {}
        };
        return axios(config)
            .then(function (response) {
            const objeto = JSON.parse(JSON.stringify(response.data));
            const resultado = objeto;
            let arrResultado = [];
            for (var i in resultado.Result) {
                arrResultado.push({
                    nome_banco: resultado.Result[i].Name.toUpperCase(),
                    numero_banco: resultado.Result[i].BankNumber,
                    icone: resultado.Result[i].Icone
                });
            }
            return arrResultado;
        })
            .catch(function (error) {
            console.log(error);
            return [];
        });
    });
}
function listarEnderecoBancos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var config = {
            method: 'get',
            url: `https://dev.meu.cash/apiv10sandbox/nearby/banks?latitude=${req.query.latitude}&longitude=${req.query.longitude}`,
            headers: {}
        };
        axios(config)
            .then(function (response) {
            const objeto = JSON.parse(JSON.stringify(response.data));
            const resultado = objeto;
            let arr = [];
            let numero_banco = '';
            let icone_banco = '';
            listarBancos()
                .then(arrBancosP => {
                for (var i in resultado.Result.Results) {
                    numero_banco = '';
                    icone_banco = '';
                    for (var y in arrBancosP) {
                        if (resultado.Result.Results[i].Name.toUpperCase().indexOf(arrBancosP[y].nome_banco) != -1) {
                            numero_banco = arrBancosP[y].numero_banco;
                            icone_banco = arrBancosP[y].icone;
                        }
                    }
                    if (numero_banco != '') {
                        arr.push({
                            latitude: resultado.Result.Results[i].Geometry.Location.Lat,
                            longitude: resultado.Result.Results[i].Geometry.Location.Lng,
                            nome_banco: resultado.Result.Results[i].Name.toUpperCase(),
                            numero_banco: numero_banco,
                            icone_banco: icone_banco,
                            endereco: resultado.Result.Results[i].Vicinity
                        });
                    }
                }
                helper_1.default.sendResponse(res, 200, arr);
            });
        })
            .catch(function (error) {
            console.log(error);
        });
    });
}
class CtrListarEnderecoBancos {
    obterLista(req, res) {
        listarEnderecoBancos(req, res);
    }
}
exports.default = new CtrListarEnderecoBancos();

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
function exibirInformacoesBoleto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var config = {
            method: 'get',
            url: `https://www.fastcash.com.br/apiv10Sandbox/transaction/out/verifyBillPayment/${req.params.barcode}`,
            headers: {
                'Authorization': 'APIKEY 97f96887-7961-48fe-9dae-8d70debc8832'
            }
        };
        axios(config)
            .then(function (response) {
            const objeto = JSON.parse(JSON.stringify(response.data));
            const resultado = objeto;
            let arrResultado = { codigo_barra: resultado.Result.Barcode,
                tipo_boleto: resultado.Result.Type,
                nome_tipo_boleto: resultado.Result.TypeName,
                data_pagamento: resultado.Result.DueDate,
                valor: resultado.Result.Amount,
                codigo_banco: resultado.Result.BankIssuer,
                tipo_servico: resultado.Result.ServiceKind,
                aprovado: resultado.Result.Security.Approved,
                prodid: resultado.Result.Security.ProdId,
                sucesso: resultado.Success,
                mensagem: resultado.Message,
                codigo_status: resultado.StatusCode,
                local_pagamento: '',
                data_vencimento: '',
                nome_beneficiario: '',
                agencia_beneficiario: '',
                codigo_beneficiario: '',
                data_documento: '',
                numero_documento: '',
                tipo_documento: '',
                data_processamento: '',
                nosso_numero: '' };
            helper_1.default.sendResponse(res, 200, arrResultado);
        })
            .catch(function (error) {
            console.log(error);
            helper_1.default.sendErro(res, 401, 'Falha ao carregar as informações!');
        });
    });
}
class CtrInformacoesBoleto {
    obterEmissao(req, res) {
        exibirInformacoesBoleto(req, res);
    }
}
exports.default = new CtrInformacoesBoleto();

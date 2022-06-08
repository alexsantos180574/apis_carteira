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
exports.pagamentoCartao = exports.obterDadosBancarios = void 0;
const helper_1 = require("../infra/helper");
const mdlComandosSql_1 = require("../models/mdlComandosSql");
function obterDadosBancarios(res, req, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = `select cw.matricula, cw.cod_cartao_clube_whisky, ct.nome, ct.email, cb.num_conta, cb.saldo_conta, cb.des_conta, ct.num_cpf_cnpj
                    from tb_socio_clubewihisky cw
                        inner join tb_clientes_titular ct 
                                on cw.matricula = ct.matricula
                        inner join tb_contas_bancarias cb
                                on ct.id_cliente_titular = cb.id_cliente_titular
                where cod_cartao_clube_whisky = '${req.params.codcartao}'
                  and cw.client_id = '${client_id}' `;
        //console.log(strSql);
        mdlComandosSql_1.GET(strSql)
            .then(ret => {
            if (ret.rowsAffected[0] > 0) {
                helper_1.default.sendResponse(res, 200, ret.recordset);
            }
            else {
                helper_1.default.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
            }
        })
            .catch(erro => {
            helper_1.default.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        });
    });
}
exports.obterDadosBancarios = obterDadosBancarios;
function pagamentoCartao(req, res, obj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ``;
        strSql += ` INSERT INTO tb_mov_pagamentos_clube_whisky(local_compra_id, matricula, contamyclube, valor, client_id)
    VALUES(${obj.local_compra_id}, '${obj.matricula}', '${obj.contamyclube}', ${obj.valor}, '${client_id}') `;
        //console.log(strSql);
        if (strSql.indexOf('undefined') < 0) {
            mdlComandosSql_1.POST(strSql)
                .then(ret => {
                if (ret.rowsAffected[0] > 0) {
                    helper_1.default.sendResponse(res, 200, 'Pagamento efetuado com sucesso!');
                }
                else {
                    helper_1.default.sendNaoEncontrado(res, 400, 'Falha no pagamento, por favor tente mais tarde!');
                }
            })
                .catch(erro => {
                helper_1.default.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
            });
        }
        else {
            helper_1.default.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
        }
    });
}
exports.pagamentoCartao = pagamentoCartao;

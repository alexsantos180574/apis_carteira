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
exports.validarTicket = exports.obterExtratoTicketsUsados = exports.gravarusoticket = exports.pagarMensalidade = exports.obterListaMensalidadesEmAberto = exports.comprarConvite = exports.obterListaConvitesComprados = exports.obterListaConvites = void 0;
const helper_1 = require("../infra/helper");
const mdlComandosSql_1 = require("../models/mdlComandosSql");
const funcoes_1 = require("../models/funcoes");
function obterListaConvites(res, req, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = `select codigo, descricao, valor, img_ticket, convites_tickets_id as id_ticket from tb_convites_tickets where client_id = '${client_id}' `;
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
exports.obterListaConvites = obterListaConvites;
function obterListaConvitesComprados(res, req, obj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = `select conv.valor, conv.status_convites_tickets_id, conv.data_compra, conv.code_hash_convite, tck.descricao
                    from tb_mov_convites_tickets conv
                        inner join tb_convites_tickets tck
                                on conv.convites_tickets_id = tck.convites_tickets_id
                   where conv.client_id = '${client_id}' 
                     and conv.contamyclube = '${obj.conta}' 
                     and status_convites_tickets_id = 1 `;
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
exports.obterListaConvitesComprados = obterListaConvitesComprados;
function comprarConvite(req, res, obj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSqlG = `select top ${obj.quantidade} code_hash_convite from tb_mov_convites_tickets where client_id = '${client_id}' and matricula = '${obj.matricula}' and contamyclube = '${obj.contamyclube}' order by data_compra desc`;
        let strSql = ``;
        for (var i = 0; i < obj.quantidade; i++) {
            let codehash = helper_1.default.getHash();
            strSql += ` INSERT INTO tb_mov_convites_tickets(codigo, matricula,contamyclube,valor,quantidade,client_id, code_hash_convite, convites_tickets_id)
        VALUES(${obj.id_convite}, '${obj.matricula}', '${obj.contamyclube}', ${obj.valor}, 1, '${client_id}', '${codehash}', '${obj.id_ticket}') `;
            yield funcoes_1.sleep(200);
        }
        if (strSql.indexOf('undefined') < 0) {
            mdlComandosSql_1.POST(strSql)
                .then(ret1 => {
                //Helper.sendResponse(res, 200, ret1.recordset);
                mdlComandosSql_1.GET(strSqlG)
                    .then(ret => {
                    if (ret.rowsAffected[0] > 0) {
                        helper_1.default.sendResponse(res, 200, ret.recordset);
                    }
                    else {
                        helper_1.default.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
                    }
                });
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
exports.comprarConvite = comprarConvite;
/* MENSALIDADES SOCIAIS */
function obterListaMensalidadesEmAberto(res, req, obj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = `select conv.valor, conv.status_convites_tickets_id, conv.data_compra, conv.code_hash_convite, tck.descricao
                    from tb_mov_convites_tickets conv
                        inner join tb_convites_tickets tck
                                on conv.convites_tickets_id = tck.convites_tickets_id
                   where conv.client_id = '${client_id}' 
                     and conv.contamyclube = '${obj.conta}' `;
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
exports.obterListaMensalidadesEmAberto = obterListaMensalidadesEmAberto;
function pagarMensalidade(req, res, obj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ` UPDATE tb_mov_mensalidades SET data_pagamento = GETDATE(), ativo='N' WHERE contamyclube = '${obj.contamyclube}' AND 
      client_id = '${client_id}' AND mensalidades_id = '${obj.mensalidades_id}' `;
        //console.log(strSql);
        if (strSql.indexOf('undefined') < 0) {
            mdlComandosSql_1.PUT(strSql)
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
exports.pagarMensalidade = pagarMensalidade;
function gravarusoticket(req, res, obj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ``;
        strSql += ` update tb_mov_convites_tickets set status_convites_tickets_id = 0, data_usu = getdate() 
    where code_hash_convite = '${obj.code_hash}'
      and contamyclube = '${obj.num_conta}'
      and client_id = '${client_id}' `;
        //console.log(strSql);
        if (strSql.indexOf('undefined') < 0) {
            mdlComandosSql_1.POST(strSql)
                .then(ret => {
                if (ret.rowsAffected[0] > 0) {
                    let strSql1 = ` select matricula, codigo from tb_mov_convites_tickets 
                where code_hash_convite = '${obj.code_hash}'
                and contamyclube = '${obj.num_conta}'
                and client_id = '${client_id}' `;
                    //console.log(strSql1);
                    mdlComandosSql_1.GET(strSql1)
                        .then(ret1 => {
                        if (ret1.rowsAffected[0] > 0) {
                            helper_1.default.sendResponse(res, 200, ret1.recordset);
                        }
                        else {
                            helper_1.default.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
                        }
                    })
                        .catch(erro => {
                        helper_1.default.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
                    });
                }
                else {
                    helper_1.default.sendNaoEncontrado(res, 400, 'Falha! ticket não validado, por favor tente mais tarde!');
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
exports.gravarusoticket = gravarusoticket;
function obterExtratoTicketsUsados(res, req, obj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = `select top 20 mtc.mov_convites_id, mtc.convites_tickets_id, mtc.matricula, mtc.contamyclube, mtc.valor, mtc.quantidade, mtc.data_compra, 
    mtc.code_hash_convite, mtc.codigo, mtc.data_usu, tc.descricao
    from tb_mov_convites_tickets mtc
         inner join tb_convites_tickets tc
                    on mtc.convites_tickets_id = tc.convites_tickets_id
    where mtc.status_convites_tickets_id = 0
      and mtc.data_usu is not null
      and mtc.matricula = '${obj.matricula}'
      and mtc.client_id = '${client_id}' 
      and mtc.contamyclube = '${obj.num_conta}' `;
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
exports.obterExtratoTicketsUsados = obterExtratoTicketsUsados;
function validarTicket(res, req, obj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ` select mov_convites_id, convites_tickets_id, matricula, contamyclube, valor, quantidade, data_compra, code_hash_convite, codigo, data_usu 
    from tb_mov_convites_tickets
    where status_convites_tickets_id = 1
      and data_usu is null
      and code_hash_convite = '${obj.code_hash}'
      and client_id = '${client_id}' 
      and contamyclube = '${obj.num_conta}' `;
        mdlComandosSql_1.GET(strSql)
            .then(ret => {
            if (ret.rowsAffected[0] > 0) {
                helper_1.default.sendResponse(res, 200, ret.recordset);
            }
            else {
                helper_1.default.sendNaoEncontrado(res, 200, 'Ticket utilizado ou não encontrato!');
            }
        })
            .catch(erro => {
            helper_1.default.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        });
    });
}
exports.validarTicket = validarTicket;

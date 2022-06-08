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
exports.validarSocio = exports.listarClientes = exports.obterCliente = exports.atualizaCliente = exports.novoCliente = void 0;
const helper_1 = require("../infra/helper");
const mdlComandosSql_1 = require("../models/mdlComandosSql");
function novoCliente(res, obj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let codehash = helper_1.default.getHash();
        let strSql = `EXEC dbo.sp_novo_cliente ${obj.id_tipo_cliente}, '${obj.nome}','${obj.data_nascimento}', ${obj.id_tipo_documento},'${obj.doc_identificacao}','0','0','${obj.img_foto_face_base64}','${obj.num_cpf_cnpj}',${obj.ind_pais},'${obj.num_ddd_telefone}','${obj.num_telefone}','${obj.email}',
    '${obj.senha_acesso}', 0,'${obj.nome_fantasia}', '${obj.cep}','${obj.endereco}',${obj.numero},'${obj.complemento}','${obj.bairro}','${obj.cidade}','${obj.uf}', '${codehash}',
    ${obj.renda_bruta_mensal},'N',${obj.id_profissao}, 0,'S','${obj.aceitou_termo_uso}','S','${obj.aceitou_politica_privacidade}', '${client_id}', '${obj.sexo}', '${obj.matricula}' `;
        //console.log(strSql);
        if (strSql.indexOf('undefined') < 0) {
            mdlComandosSql_1.cpfcnpjExiste(obj.num_cpf_cnpj, client_id)
                .then(ret => {
                if (ret.rowsAffected[0] <= 0) {
                    mdlComandosSql_1.POST(strSql)
                        .then(ret => {
                        helper_1.default.sendResponse(res, 200, 'Cadastro efetuado com sucesso!');
                    })
                        .catch(erro => {
                        helper_1.default.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
                    });
                }
                else {
                    helper_1.default.sendErro(res, 201, 'Já existe uma conta com este CPF!');
                }
            });
        }
        else {
            helper_1.default.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
        }
    });
}
exports.novoCliente = novoCliente;
function atualizaCliente(res, req, obj, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = `EXEC dbo.sp_atualiza_dados_cliente '${obj.nome}','${obj.data_nascimento}', '${req.params.document}','${obj.num_ddd_telefone}','${obj.num_telefone}','${obj.email}', 
        '${obj.cep}','${obj.endereco}',${obj.numero},'${obj.complemento}','${obj.bairro}','${obj.cidade}','${obj.uf}', 
        '${obj.renda_bruta_mensal}', '${obj.pep}', '${obj.id_profissao}', '${obj.valor_patrimonio}', '${obj.nome_fantasia}', '${obj.sexo}','${obj.img_foto_face_base64}' `;
        //'${obj.img_foto_documento_frente_base64}','${obj.img_foto_documento_verso_base64}',
        //console.log(strSql);        
        if (strSql.indexOf('undefined') < 0) {
            mdlComandosSql_1.PUT(strSql)
                .then(ret => {
                helper_1.default.sendResponse(res, 200, 'Cadastro atualizado com sucesso!');
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
exports.atualizaCliente = atualizaCliente;
function obterCliente(res, req, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ` select conta.saldo_conta as saldo, cliente.nome as nome, cliente.num_cpf_cnpj as cpf_cnpj, cliente.matricula, clube_whisky.cod_cartao_clube_whisky
    from tb_contas_bancarias conta
        inner join tb_clientes_titular cliente
                on conta.id_cliente_titular = cliente.id_cliente_titular
        left join tb_socio_clubewihisky clube_whisky
                on cliente.matricula = clube_whisky.matricula
    where cliente.num_cpf_cnpj = '${req.params.document}' and conta.client_id = '${client_id}'`;
        //console.log(strSql);
        mdlComandosSql_1.GET(strSql)
            .then(ret => {
            if (ret.rowsAffected[0] > 0) {
                helper_1.default.sendResponse(res, 200, ret.recordset);
            }
            else {
                helper_1.default.sendResponse(res, 201, 'Nenhum resultado!');
            }
        })
            .catch(erro => {
            helper_1.default.sendResponse(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        });
    });
}
exports.obterCliente = obterCliente;
function listarClientes(res, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ` select conta.saldo_conta as saldo, cliente.nome as nome, cliente.num_cpf_cnpj as cpf_cnpj, cliente.matricula
    from tb_contas_bancarias conta
        inner join tb_clientes_titular cliente
                on conta.id_cliente_titular = cliente.id_cliente_titular
    where conta.client_id = '${client_id}' `;
        mdlComandosSql_1.GET(strSql)
            .then(ret => {
            if (ret.rowsAffected[0] > 0) {
                helper_1.default.sendResponse(res, 200, ret.recordset);
            }
            else {
                helper_1.default.sendResponse(res, 201, 'Nenhum resultado!');
            }
        })
            .catch(erro => {
            helper_1.default.sendResponse(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        });
    });
}
exports.listarClientes = listarClientes;
function validarSocio(res, matricula, cpf, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ` select matricula, nome, cpf, ind_status, client_id, sexo, celular, email, data_nascimento from tb_socios
    where matricula = '${matricula}' and client_id = '${client_id}' and cpf = '${cpf}' `;
        //console.log(strSql);
        mdlComandosSql_1.GET(strSql)
            .then(ret => {
            if (ret.rowsAffected[0] > 0) {
                //Helper.sendResponse(res, 200, ret.recordset);
                res.status(200).send({ socio_valido: true, status: true, socio: ret.recordset });
            }
            else {
                helper_1.default.sendResponse(res, 201, 'Nenhum resultado!');
            }
        })
            .catch(erro => {
            helper_1.default.sendResponse(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        });
    });
}
exports.validarSocio = validarSocio;

import Helper from "../infra/helper"; 
import { GET, PUT, POST } from "../models/mdlComandosSql";
import {sleep} from "../models/funcoes";

export async function obterListaConvites(res, req, client_id){ 
    
    let strSql  = `select codigo, descricao, valor, img_ticket, convites_tickets_id as id_ticket from tb_convites_tickets where client_id = '${client_id}' `;

   GET(strSql)
   .then(ret=>{
       if(ret.rowsAffected[0] > 0){
           Helper.sendResponse(res, 200, ret.recordset);
       }else{
           Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
       }
   })
   .catch(erro =>{
       Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
   })
}

export async function obterListaConvitesComprados(res, req, obj, client_id){
    let strSql  = `select conv.valor, conv.status_convites_tickets_id, conv.data_compra, conv.code_hash_convite, tck.descricao
                    from tb_mov_convites_tickets conv
                        inner join tb_convites_tickets tck
                                on conv.convites_tickets_id = tck.convites_tickets_id
                   where conv.client_id = '${client_id}' 
                     and conv.contamyclube = '${obj.conta}' 
                     and status_convites_tickets_id = 1 `;
    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            Helper.sendResponse(res, 200, ret.recordset);
        }else{
            Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
    
}

export async function comprarConvite(req, res, obj, client_id){

    let strSqlG  = `select top ${obj.quantidade} code_hash_convite from tb_mov_convites_tickets where client_id = '${client_id}' and matricula = '${obj.matricula}' and contamyclube = '${obj.contamyclube}' order by data_compra desc`;

    let strSql = ``;
    for(var i=0;i<obj.quantidade; i++){
        let codehash = Helper.getHash();
        strSql += ` INSERT INTO tb_mov_convites_tickets(codigo, matricula,contamyclube,valor,quantidade,client_id, code_hash_convite, convites_tickets_id)
        VALUES(${obj.id_convite}, '${obj.matricula}', '${obj.contamyclube}', ${obj.valor}, 1, '${client_id}', '${codehash}', '${obj.id_ticket}') `;
        await sleep(200);
    }

    if(strSql.indexOf('undefined') < 0){
        POST(strSql)
        .then(ret1=>{
            //Helper.sendResponse(res, 200, ret1.recordset);
            GET(strSqlG)
            .then(ret=>{
                if(ret.rowsAffected[0] > 0){
                    Helper.sendResponse(res, 200, ret.recordset);
                }else{
                    Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
                }
            })
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

/* MENSALIDADES SOCIAIS */

export async function obterListaMensalidadesEmAberto(res, req, obj, client_id){
    let strSql  = `select conv.valor, conv.status_convites_tickets_id, conv.data_compra, conv.code_hash_convite, tck.descricao
                    from tb_mov_convites_tickets conv
                        inner join tb_convites_tickets tck
                                on conv.convites_tickets_id = tck.convites_tickets_id
                   where conv.client_id = '${client_id}' 
                     and conv.contamyclube = '${obj.conta}' `;
    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            Helper.sendResponse(res, 200, ret.recordset);
        }else{
            Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
    
}

export async function pagarMensalidade(req, res, obj, client_id){

    let strSql = ` UPDATE tb_mov_mensalidades SET data_pagamento = GETDATE(), ativo='N' WHERE contamyclube = '${obj.contamyclube}' AND 
      client_id = '${client_id}' AND mensalidades_id = '${obj.mensalidades_id}' `;
      
    //console.log(strSql);
    if(strSql.indexOf('undefined') < 0){
        PUT(strSql)
        .then(ret=>{
            if(ret.rowsAffected[0] > 0){
                Helper.sendResponse(res, 200, 'Pagamento efetuado com sucesso!');
            }else{
                Helper.sendNaoEncontrado(res, 400, 'Falha no pagamento, por favor tente mais tarde!');
            }
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

export async function gravarusoticket(req, res, obj, client_id){
    let strSql = ``;
    strSql += ` update tb_mov_convites_tickets set status_convites_tickets_id = 0, data_usu = getdate() 
    where code_hash_convite = '${obj.code_hash}'
      and contamyclube = '${obj.num_conta}'
      and client_id = '${client_id}' `;
    //console.log(strSql);
    if(strSql.indexOf('undefined') < 0){
        POST(strSql)
        .then(ret=>{
            if(ret.rowsAffected[0] > 0){
                let strSql1 = ` select matricula, codigo from tb_mov_convites_tickets 
                where code_hash_convite = '${obj.code_hash}'
                and contamyclube = '${obj.num_conta}'
                and client_id = '${client_id}' `;
                //console.log(strSql1);
                GET(strSql1)
                    .then(ret1=>{
                        if(ret1.rowsAffected[0] > 0){
                            Helper.sendResponse(res, 200, ret1.recordset);
                        }else{
                            Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
                        }
                    })
                    .catch(erro =>{
                        Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
                    })
            }else{
                Helper.sendNaoEncontrado(res, 400, 'Falha! ticket não validado, por favor tente mais tarde!');
            }
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

export async function obterExtratoTicketsUsados(res, req, obj, client_id){
    let strSql  = `select top 20 mtc.mov_convites_id, mtc.convites_tickets_id, mtc.matricula, mtc.contamyclube, mtc.valor, mtc.quantidade, mtc.data_compra, 
    mtc.code_hash_convite, mtc.codigo, mtc.data_usu, tc.descricao
    from tb_mov_convites_tickets mtc
         inner join tb_convites_tickets tc
                    on mtc.convites_tickets_id = tc.convites_tickets_id
    where mtc.status_convites_tickets_id = 0
      and mtc.data_usu is not null
      and mtc.matricula = '${obj.matricula}'
      and mtc.client_id = '${client_id}' 
      and mtc.contamyclube = '${obj.num_conta}' `;
    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            Helper.sendResponse(res, 200, ret.recordset);
        }else{
            Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
 }

 export async function validarTicket(res, req, obj, client_id){
    let strSql  = ` select mov_convites_id, convites_tickets_id, matricula, contamyclube, valor, quantidade, data_compra, code_hash_convite, codigo, data_usu 
    from tb_mov_convites_tickets
    where status_convites_tickets_id = 1
      and data_usu is null
      and code_hash_convite = '${obj.code_hash}'
      and client_id = '${client_id}' 
      and contamyclube = '${obj.num_conta}' `;
    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            Helper.sendResponse(res, 200, ret.recordset);
        }else{
            Helper.sendNaoEncontrado(res, 200, 'Ticket utilizado ou não encontrato!');
        }
    })
    .catch(erro =>{
        Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    }) 
}
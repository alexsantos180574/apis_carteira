import Helper from "../infra/helper"; 
import { GET, PUT, POST } from "../models/mdlComandosSql";
import {sleep} from "../models/funcoes";


export async function obterDadosBancarios(res, req, client_id){ 
    
    let strSql  = `select cw.matricula, cw.cod_cartao_clube_whisky, ct.nome, ct.email, cb.num_conta, cb.saldo_conta, cb.des_conta, ct.num_cpf_cnpj
                    from tb_socio_clubewihisky cw
                        inner join tb_clientes_titular ct 
                                on cw.matricula = ct.matricula
                        inner join tb_contas_bancarias cb
                                on ct.id_cliente_titular = cb.id_cliente_titular
                where cod_cartao_clube_whisky = '${req.params.codcartao}'
                  and cw.client_id = '${client_id}' `;

   //console.log(strSql);
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

export async function pagamentoCartao(req, res, obj, client_id){

    let strSql = ``;
    strSql += ` INSERT INTO tb_mov_pagamentos_clube_whisky(local_compra_id, matricula, contamyclube, valor, client_id)
    VALUES(${obj.local_compra_id}, '${obj.matricula}', '${obj.contamyclube}', ${obj.valor}, '${client_id}') `;
    //console.log(strSql);
    if(strSql.indexOf('undefined') < 0){
        POST(strSql)
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


import Helper from "../infra/helper";
import { GET, PUT, POST, cpfcnpjExiste } from "../models/mdlComandosSql";

const origemTransacao = {boleto:1, ted:2, tef:3, pix:4, cartaoCred:5, debito:6, creditoConta:8, tarifaBancaria:11};
const statusTransacao = {transfEfetuada:1, transfCancelada:2, transfRejeitada:3, transfEstornada:4,
                         tituloPago:5, tituloCancelado:6, tituloRejeitado:7, tituloEstornado:8, depCaixa:9, saqueCaixa:10,
                         transfRecebida:11, creditoConta:13, tarifaBancaria:15, compraCartaoCred:16,
                         pixRecebido:17, pixEfetuado:18, pixEstornado:19};
const cashIn = 'E';
const cashOut= 'S';


export async function emitirTEF(res, obj, client_id, token){
    let codehash = Helper.getHash();
    
    let strSql  = ` exec sp_efetuar_tef '${obj.conta_origem}', '${obj.conta_destino}', '${client_id}', ${obj.valor}, '${token}', '${codehash}' `;
    
    if(strSql.indexOf('undefined') < 0){
        POST(strSql)
        .then(ret=>{
            Helper.sendResponse(res, 200, 'Transferência efetuada com sucesso!');
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

export async function obterInfoClientePara(res, obj, client_id){
    let strSql = ` select cb.num_conta, ct.nome, ct.num_cpf_cnpj, ag.agencia_banco, ag.agencia_descricao, ag.agencia_numero
    from tb_contas_bancarias cb
         inner join tb_clientes_titular ct
                 on cb.client_id = ct.client_id
                and cb.id_cliente_titular = ct.id_cliente_titular
         inner join tb_agencias ag
                 on cb.id_agencia = ag.id_agencia
   where cb.num_conta = '${obj.num_conta}' 
     and cb.client_id = '${client_id}' `;

    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            Helper.sendResponse(res, 200, ret.recordset);
        }else{
            res.status(201).send({resultado: 'Nenhum Resultado!', status: false});
        }
    })
    .catch(erro =>{
        Helper.sendResponse(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
}

export async function efetuaDeposito(res, obj, client_id){
    let codehash = Helper.getHash();
    let strSql  = `INSERT INTO dbo.TB_MOV_CONTA_BANCARIA(VALOR,TIPO_TRANSACAO,ID_ORIGEM_TRANSACAO,DOCUMENTO_DESTINO,INSTITUICAO_DESTINO,AGENCIA_DESTINO,CONTA_DESTINO,ID_STATUS_TRANSACAO,NUM_CONTA,CODIGO_VALIDADOR, CLIENT_ID, ID_CONTA_BANCARIA)
        VALUES(${obj.valor},'${cashIn}',${origemTransacao.creditoConta},'${obj.documento}','213','${obj.agencia}','${obj.conta}', ${statusTransacao.creditoConta},'${obj.conta}','${codehash}', '${client_id}', (select id_conta_bancaria from tb_contas_bancarias where num_conta = '${obj.conta}' and client_id = '${client_id}'))`;
    //console.log(strSql);
    if(strSql.indexOf('undefined') < 0){
        POST(strSql)
        .then(ret=>{
            Helper.sendResponse(res, 200, 'Depósito efetuado com sucesso!');
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

/* COBRANÇA PIX */
export async function gravaCobrancaPixGerada(res, obj, client_id){
    let codehash = Helper.getHash();
    let strSql   = `insert into tb_cobrancas_pix_geradas(status_pix, txid, link_qrcode, copy_cola_emv, expira_em, id_pix, cpf, valor, info, num_conta, client_id, code_hash) values( '${obj.status}', '${obj.txId}', '${obj.links.linkQrCode}', '${obj.links.emv}', ${obj.calendario.expiracao}, '${obj.id}', '${obj.devedor.cpf}', ${obj.valor.original}, '${obj.solicitacaoPagador}', '${obj.infoAdicionais[0].valor}', '${client_id}', '${codehash}' ) `;

    if(strSql.indexOf('undefined') < 0){
        POST(strSql)
        .then(ret=>{
            Helper.sendResponse(res, 200, 'Cobrança gerada com sucesso!');
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

export async function listarCobrancasPix(res, obj, client_id){ 
    let strSql  = ` select status_pix, txid, link_qrcode, copy_cola_emv, expira_em, id_pix, cpf, valor, info, num_conta, client_id, code_hash, data_cobranca from tb_cobrancas_pix_geradas
    where client_id = '${client_id}' and num_conta = '${obj.num_conta}' and ( (datediff(SECOND, data_cobranca, getdate()) <= expira_em) OR (status_pix = 'PAGO'))
    order by data_cobranca desc `;
    
    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            Helper.sendResponse(res, 200, ret.recordset);
        }else{
            Helper.sendResponse(res, 201, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendResponse(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
}

export async function gravarPixDestino(res, obj, client_id, obj_destino){
    let codehash = Helper.getHash();
    let recebedor = Helper.retornarBanco(obj.recebedor.ispb);
    let strSql   = `insert into tb_pix_destino_gerados(conta,ispb,agencia,tipoConta,nome,cpf,cnpj,status,origem,linkComprovante,id,e2EId,valor,infoPagador,client_id, code_hash, tipoChaveDestino, chaveDestino, contamyclube, recebedor_banco) values( '${obj.recebedor.conta}', '${obj.recebedor.ispb}', '${obj.recebedor.agencia}', '${obj.recebedor.tipoConta}', '${obj.recebedor.nome}', '${obj.recebedor.cpf}', '${obj.recebedor.cnpj}', '${obj.status}', '${obj.origem}', '${obj.linkComprovante}', '${obj.id}', '${obj.e2EId}', ${obj.valor}, '${obj.infoPagador}', '${client_id}', '${codehash}', '${obj_destino.tipoChave}', '${obj_destino.valorchave}', '${obj_destino.contamyclube}', '${recebedor}' ) `;
    //console.log(strSql);
    if(strSql.indexOf('undefined') < 0){
        POST(strSql)
        .then(ret=>{
            Helper.sendResponse(res, 200,   {   mensagem:'PIX gerado com sucesso!', 
                                                autenticacao:obj.id,
                                                recebedor_banco: Helper.retornarBanco(obj.recebedor.ispb),
                                                recebedor_agencia: obj.recebedor.agencia,
                                                recebedor_conta: obj.recebedor.conta,
                                                recebedor_tipo_conta: obj.recebedor.tipoConta,
                                                recebedor_nome: obj.recebedor.nome,
                                                recebedor_cpf: obj.recebedor.cpf
                                            });
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

export async function listaPIXDestino(res, obj, client_id){
    let strSql  = ` SELECT conta,ispb,agencia,tipoConta,nome,cpf,cnpj,origem,linkComprovante,id,e2EId,valor,infoPagador,client_id, code_hash, tipoChaveDestino, chaveDestino, contamyclube, dataRegistro,
                            case when [status] = 'COMPLETA' then 'Efetuado' when [status] = 'RECUSADA' then 'Recusado' else 'Aguardando' end as status
                            FROM tb_pix_destino_gerados
                            where contamyclube = '${obj.num_conta}' and client_id = '${client_id}' order by dataRegistro desc`;
    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            Helper.sendResponse(res, 200, ret.recordset);
        }else{
            Helper.sendResponse(res, 201, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendResponse(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
    
}

export async function atualizaPixDestino(res, obj){
    const strSql = ` update tb_pix_destino_gerados set status = '${obj.Status}' where id = '${obj.Id}' `;    
    //console.log(strSql);
    //console.log(obj);
    if(strSql.indexOf('undefined') < 0){
        PUT(strSql)
        .then(ret=>{
            Helper.sendResponse(res, 200, 'PIX confirmado!');
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

export async function pixDestinoEnviado(res, obj){
    const strSql = ` update tb_pix_destino_gerados set status = 'EM PROCESSAMENTO' where id = '${obj.id}' `;    
    //console.log(strSql);
    if(strSql.indexOf('undefined') < 0){
        PUT(strSql)
        .then(ret=>{
            Helper.sendResponse(res, 200, 'PIX enviado com sucesso!');
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

/* CLIENTE */
export async function obterDadosCliente(res, obj){ 
    let strSql  = ` select tit.email, tit.nome, tit.num_cpf_cnpj, cb.client_id, en.cep, en.bairro, en.cidade, en.complemento, en.endereco, en.numero, en.uf, tit.num_ddd_telefone, tit.num_telefone
    from tb_clientes_titular tit
   inner join tb_contas_bancarias cb
           on tit.id_cliente_titular = cb.id_cliente_titular
          and cb.num_conta = '${obj.numconta}'
   inner join tb_enderecos en
           on tit.id_cliente_titular = en.id_cliente `;
    
    return GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            return ret.recordset;
        }else{
            Helper.sendResponse(res, 201, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendResponse(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
}

export async function receberPixCobranca(res, obj){
    const strSql = ` update tb_cobrancas_pix_geradas set status_pix = 'PAGO' where id_pix = '${obj.CobrancaId}' `;    
    //console.log(strSql);
    if(strSql.indexOf('undefined') < 0){
        PUT(strSql)
        .then(ret=>{
            Helper.sendResponse(res, 200, 'pagamento recebido com sucesso!');
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

/* BOLETOS IUGU */
export async function gravaBoletoGerado(res, obj, client_id){
    let codehash = Helper.getHash();
    let strSql  = ` insert into tb_boletos_gerados(matricula, num_conta, valor, vencimento, boletocriado, id_boleto, cpf, url_segunda_via, codigobarra, qrcode, pixcopycola, client_id, situacao)
        values('${obj.matricula}','${obj.num_conta}',${(obj.valorcentavo / 100)},'${obj.vencimento}','${obj.boletocriado}','${obj.id}', '${obj.cpf}','${obj.url_segunda_via}','${obj.codigobarra}', '${obj.qrcode}', '${obj.pixcopycola}','${client_id}', 'PENDENTE')`;
    //console.log(strSql);
    if(strSql.indexOf('undefined') < 0){
        POST(strSql)
        .then(ret=>{
            Helper.sendResponse(res, 200, obj);
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

export async function listaBoletosGerados(res, obj, client_id){
    let strSql  = ` SELECT id_boleto_gerado,matricula,num_conta,valor,vencimento,boletocriado,id_boleto,cpf,url_segunda_via,codigobarra,qrcode,pixcopycola,data_registro,client_id, situacao
    FROM tb_boletos_gerados
    where num_conta = '${obj.num_conta}' and client_id = '${client_id}' AND vencimento >= CONVERT(DATE, getdate()) `;
    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            Helper.sendResponse(res, 200, ret.recordset);
        }else{
            Helper.sendResponse(res, 201, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendResponse(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
    
}

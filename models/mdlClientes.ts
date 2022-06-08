import Helper from "../infra/helper"; 
import { GET, PUT, POST, cpfcnpjExiste } from "../models/mdlComandosSql";

export async function novoCliente(res, obj, client_id){
    let codehash = Helper.getHash();
    let strSql = `EXEC dbo.sp_novo_cliente ${obj.id_tipo_cliente}, '${obj.nome}','${obj.data_nascimento}', ${obj.id_tipo_documento},'${obj.doc_identificacao}','0','0','${obj.img_foto_face_base64}','${obj.num_cpf_cnpj}',${obj.ind_pais},'${obj.num_ddd_telefone}','${obj.num_telefone}','${obj.email}',
    '${obj.senha_acesso}', 0,'${obj.nome_fantasia}', '${obj.cep}','${obj.endereco}',${obj.numero},'${obj.complemento}','${obj.bairro}','${obj.cidade}','${obj.uf}', '${codehash}',
    ${obj.renda_bruta_mensal},'N',${obj.id_profissao}, 0,'S','${obj.aceitou_termo_uso}','S','${obj.aceitou_politica_privacidade}', '${client_id}', '${obj.sexo}', '${obj.matricula}' `;
    //console.log(strSql);
    if(strSql.indexOf('undefined') < 0){
        cpfcnpjExiste(obj.num_cpf_cnpj, client_id) 
        .then(ret=>{
            if(ret.rowsAffected[0] <= 0){
                POST(strSql)
                .then(ret=>{
                    Helper.sendResponse(res, 200, 'Cadastro efetuado com sucesso!');
                })
                .catch(erro =>{
                    Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
                })
            }else{
                Helper.sendErro(res, 201, 'Já existe uma conta com este CPF!');
            }
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

export async function atualizaCliente(res, req, obj, client_id){
    let strSql = `EXEC dbo.sp_atualiza_dados_cliente '${obj.nome}','${obj.data_nascimento}', '${req.params.document}','${obj.num_ddd_telefone}','${obj.num_telefone}','${obj.email}', 
        '${obj.cep}','${obj.endereco}',${obj.numero},'${obj.complemento}','${obj.bairro}','${obj.cidade}','${obj.uf}', 
        '${obj.renda_bruta_mensal}', '${obj.pep}', '${obj.id_profissao}', '${obj.valor_patrimonio}', '${obj.nome_fantasia}', '${obj.sexo}','${obj.img_foto_face_base64}' `;
//'${obj.img_foto_documento_frente_base64}','${obj.img_foto_documento_verso_base64}',
//console.log(strSql);        
    if(strSql.indexOf('undefined') < 0){
        PUT(strSql)
        .then(ret=>{
            Helper.sendResponse(res, 200, 'Cadastro atualizado com sucesso!');
        })
        .catch(erro =>{
            Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
        })
    }else{
        Helper.sendErro(res, 400, 'Falha ao executar o procedimento. Sintaxe inválida, um atributo requerido não está definido!');
    }
}

export async function obterCliente(res, req, client_id){ 
    let strSql  = ` select conta.saldo_conta as saldo, cliente.nome as nome, cliente.num_cpf_cnpj as cpf_cnpj, cliente.matricula, clube_whisky.cod_cartao_clube_whisky
    from tb_contas_bancarias conta
        inner join tb_clientes_titular cliente
                on conta.id_cliente_titular = cliente.id_cliente_titular
        left join tb_socio_clubewihisky clube_whisky
                on cliente.matricula = clube_whisky.matricula
    where cliente.num_cpf_cnpj = '${req.params.document}' and conta.client_id = '${client_id}'`;
//console.log(strSql);
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

export async function listarClientes(res, client_id){ 
    let strSql  = ` select conta.saldo_conta as saldo, cliente.nome as nome, cliente.num_cpf_cnpj as cpf_cnpj, cliente.matricula
    from tb_contas_bancarias conta
        inner join tb_clientes_titular cliente
                on conta.id_cliente_titular = cliente.id_cliente_titular
    where conta.client_id = '${client_id}' `;
    
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

export async function validarSocio(res, matricula, cpf, client_id) { 
    let strSql  = ` select matricula, nome, cpf, ind_status, client_id, sexo, celular, email, data_nascimento from tb_socios
    where matricula = '${matricula}' and client_id = '${client_id}' and cpf = '${cpf}' `;
//console.log(strSql);
    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            //Helper.sendResponse(res, 200, ret.recordset);
            res.status(200).send({socio_valido: true, status: true, socio: ret.recordset});
        }else{
            Helper.sendResponse(res, 201, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendResponse(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
}

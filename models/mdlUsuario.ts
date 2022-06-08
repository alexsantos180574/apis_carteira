import Helper from "../infra/helper"; 
import { GET, PUT } from "../models/mdlComandosSql";

export async function obterUsuario(res, req, client_id){ 
    
    let strSql  = ` select case when count(ap.doc_identificacao) > 0 then 'sim' else 'nao' end as existe
        ,ct.email as email,ct.nome as nome
        ,(case when isnull(ct.img_foto_face_base64, '') = ''
            then '' else ct.img_foto_face_base64
            end) as foto
        ,ct.num_ddd_telefone as num_ddd,ct.num_telefone as telefone,ct.nome_fantasia as nome_fantasia_social,ct.valor_patrimonio as patrimonio,ct.renda_bruta_mensal as renda,ct.id_profissao as id_profissao,ct.pep as pep,pr.desc_profissao as profissao
        ,cb.num_conta as num_conta,cb.saldo_conta as saldo_conta ,convert(varchar(10), ct.data_nascimento, 103) as data_nascimento
        ,'213' as cod_banco,'0001' as cod_agencia,en.cep as cep,en.endereco as endereco,en.numero as numero,en.complemento as complemento, ct.matricula
        ,en.bairro as bairro,en.cidade as cidade,en.uf as uf
    from tb_acesso_aplicativos ap
        left join tb_clientes_titular ct on ap.doc_identificacao = ct.num_cpf_cnpj
        left join tb_contas_bancarias cb on ct.id_cliente_titular = cb.id_cliente_titular
        left join tb_enderecos en on en.id_cliente = ct.id_cliente_titular
        left join tb_profissoes pr on pr.id_profissao = ct.id_profissao
    where ap.doc_identificacao = '${req.params.documento}' and ap.client_id = '${client_id}' 
    group by ct.email,ct.nome,ct.img_foto_face_base64,ct.num_ddd_telefone,ct.num_telefone,ct.nome_fantasia
   ,ct.valor_patrimonio,ct.renda_bruta_mensal,ct.id_profissao,ct.pep,pr.desc_profissao,cb.num_conta,cb.saldo_conta
   ,ct.data_nascimento,en.cep,en.endereco,en.numero,en.complemento,en.bairro,en.cidade,en.uf, ct.matricula`;

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

export async function vefiricarUsuario(req, res, client_id){
    let strSql  = ` SELECT TOP 1 DOC_IDENTIFICACAO as cpf, NOME as nome, EMAIL as email `;
    strSql     += `FROM TB_ACESSO_APLICATIVOS `;
    strSql     += ` WHERE DOC_IDENTIFICACAO = '${req.body.cpf}'`;

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

export async function loginUsuario(req, res, client_id){
    let obj = req.body;
    let strSql  = ` select case when count(ap.doc_identificacao) > 0 then 'sim' else 'nao' end as existe, ct.email as email, ct.nome as nome,  `;
    strSql     += `   (case when ct.img_foto_face_base64 = '' then ct.img_foto_face_base64 else ct.img_foto_face_base64 end ) as foto, ct.doc_identificacao as doc_identificacao, ct.num_cpf_cnpj as cpf_cnpj, ct.num_ddd_telefone as num_ddd, ct.num_telefone as telefone, `;
    strSql     += `    ct.faixa_salarial as faixa_salarial, ct.nome_fantasia as nome_fantasia_social, ct.codigo_hash as codigo_hash, cb.num_conta as num_conta,  `;
    strSql     += `    en.cep as cep, en.endereco as endereco, en.numero as numero, en.complemento as complemento, en.bairro as bairro, en.cidade as cidade, en.uf as uf, cb.saldo_conta as saldo_conta `;
    strSql     += `    , convert(varchar(10), ct.data_nascimento, 103) as data_nascimento, convert(varchar(10), getdate(), 103) as data_atual, ap.senha_acesso, ct.sexo, ct.matricula `;
    strSql     += `from tb_acesso_aplicativos ap `;
    strSql     += `    inner join tb_clientes_titular ct on ap.doc_identificacao = ct.num_cpf_cnpj  `;
    strSql     += `    inner join tb_contas_bancarias cb on ct.id_cliente_titular = cb.id_cliente_titular `;
    strSql     += `    inner join tb_enderecos en on ct.id_cliente_titular = en.id_cliente `;
    strSql     += ` where ap.doc_identificacao = '${obj.documento}'`;
    strSql     += ` and ap.senha_acesso = '${obj.senha}' `;
    strSql     += `group by ct.email, ct.nome, ct.img_foto_face_base64, ct.doc_identificacao, ct.num_cpf_cnpj, ct.num_ddd_telefone, ct.num_telefone,ct.faixa_salarial, ct.nome_fantasia,  `;
    strSql     += `        ct.codigo_hash, cb.num_conta, en.cep, en.endereco, en.numero, en.complemento, en.bairro, en.cidade, en.uf, cb.saldo_conta, ct.data_nascimento, ap.senha_acesso, ct.sexo, ct.matricula `;
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

export async function recuperarSenha(req, res, client_id){
    const nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'naoresponder.infsmart@gmail.com',
        pass: 'Ale775569!',
      }
    });

    let strSql  = ` select nome, num_celular as celular , num_ddd as ddd, email `;
    strSql     += `   from tb_acesso_aplicativos `;
    strSql     += ` where doc_identificacao = '${req.params.documento}'`;
    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            const codigoverificacao = Helper.gerarCodVerificacao(1000, 9999);
            /* grava o código na conta do usuário para ser validado */
            let strSqlU  = ` update tb_acesso_aplicativos set cod_verificacao_senha = '${codigoverificacao}' `;
            strSqlU     += ` where doc_identificacao = '${req.params.documento}'`;
            PUT(strSqlU)
            .then(retP=>{
                let texto = ' <html> <strong>Seu código de verificação para alteração de senha é:</strong> '+codigoverificacao+'</html>';
                const mailOptions = {
                    from: 'naoresponder.infsmart@gmail.com',
                    to: ret.recordset[0].email,
                    subject: 'MyClube - Recuperação de senha',
                    html: texto
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                        Helper.sendErro(res, 500, 'Sistema indisponivel no momento, por favor, tente mais tarde!');
                    } else {
                        //console.log('Email enviado: ' + info.response);
                        Helper.sendResponse(res, 201, {mensagem:'Um código de validação foi enviado para seu email cadastrado!',email:ret.recordset[0].email});
                    }
                });
            })
            .catch(erro =>{
                Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
            })
            //Helper.sendResponse(res, 200, ret.recordset);
        }else{
            Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    });
}

export async function validaCodigoVerificacao(req, res, client_id){
    let obj = req.body;
    
    let strSql  = ` select top 1 doc_identificacao as cpf, nome, email `;
    strSql     += `from tb_acesso_aplicativos `;
    strSql     += ` where  doc_identificacao = '${obj.cpf}' and cod_verificacao_senha = '${obj.codigo}' `;
    
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

export async function atualizaSenha(req, res, client_id){
    let obj = req.body;
    let num_cpf_cnpj = obj.documento;
    let codigo = obj.codigo;
    let senha_nova  = obj.senha_nova; 
    
    let strSql = `select doc_identificacao from tb_acesso_aplicativos where doc_identificacao = '${num_cpf_cnpj}' and cod_verificacao_senha = '${codigo}' `;
    
    GET(strSql) 
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            let strSqlU = ` update tb_acesso_aplicativos set senha_acesso = '${senha_nova}', cod_verificacao_senha = NULL where doc_identificacao = '${num_cpf_cnpj}' `;
            PUT(strSqlU)
            .then(retP=>{
                Helper.sendResponse(res, 200, 'Senha atualizada com sucesso!');
            })
            .catch(erro =>{
                Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
            })
        }else{
            Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
}

export async function atualizaSenhaSemCodigo(req, res, client_id){
    let obj = req.body;
    let num_cpf_cnpj = obj.documento;
    let senha_nova  = obj.senha_nova; 
    
    let strSql = `select doc_identificacao from tb_acesso_aplicativos where doc_identificacao = '${num_cpf_cnpj}'`;
    
    GET(strSql) 
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            let strSqlU = ` update tb_acesso_aplicativos set senha_acesso = '${senha_nova}', cod_verificacao_senha = NULL where doc_identificacao = '${num_cpf_cnpj}' `;
            PUT(strSqlU)
            .then(retP=>{
                Helper.sendResponse(res, 200, 'Senha atualizada com sucesso!');
            })
            .catch(erro =>{
                Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
            })
        }else{
            Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })
}

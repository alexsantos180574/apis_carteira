import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";
require('dotenv').config();

class ctrLoginUsuario{ 
    vefiricarUsuario(req, res){
        const sql = require('mssql');
        // connect to your database
        sql.connect(Helper.configSql, function (err) {
            if (err) console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql  = ` SELECT CASE WHEN count(AP.DOC_IDENTIFICACAO) > 0 THEN 'sim' ELSE 'nao' END AS existe, CT.EMAIL as email, CT.NOME as nome,  `;
            strSql     += `   (CASE WHEN CT.IMG_FOTO_FACE_BASE64 = '' THEN CT.IMG_FOTO_FACE_BASE64 ELSE '${process.env.URL_FOTO_PERFIL}'+CT.IMG_FOTO_FACE_BASE64 END ) AS foto, CT.DOC_IDENTIFICACAO AS doc_identificacao, CT.NUM_CPF_CNPJ AS cpf_cnpj, CT.NUM_DDD_TELEFONE AS num_ddd, CT.NUM_TELEFONE AS telefone, `;
            strSql     += `    CT.FAIXA_SALARIAL AS faixa_salarial, CT.NOME_FANTASIA AS nome_fantasia_social, CT.CODIGO_HASH AS codigo_hash, CB.NUM_CONTA AS num_conta,  `;
            strSql     += `    EN.CEP AS cep, EN.ENDERECO AS endereco, EN.NUMERO AS numero, EN.COMPLEMENTO AS complemento, EN.BAIRRO AS bairro, EN.CIDADE AS cidade, EN.UF AS uf, CB.SALDO_CONTA as saldo_conta `;
            strSql     += `    , CONVERT(VARCHAR(10), CT.DATA_NASCIMENTO, 103) AS data_nascimento `;
            strSql     += `FROM TB_ACESSO_APLICATIVOS AP `;
            strSql     += `    LEFT JOIN TB_CLIENTES_TITULAR CT ON AP.DOC_IDENTIFICACAO = CT.NUM_CPF_CNPJ  `;
            strSql     += `    LEFT JOIN TB_CONTAS_BANCARIAS CB ON CT.ID_CLIENTE_TITULAR = CB.ID_CLIENTE_TITULAR `;
            strSql     += `    LEFT JOIN TB_ENDERECOS EN ON CT.ID_CLIENTE_TITULAR = EN.ID_CLIENTE `;
            strSql     += ` WHERE AP.DOC_IDENTIFICACAO = '${req.params.documento}'`;
            strSql     += ` AND AP.SENHA_ACESSO = '${req.params.senha}' `;
            strSql     += `GROUP BY CT.EMAIL, CT.NOME, CT.IMG_FOTO_FACE_BASE64, CT.DOC_IDENTIFICACAO, CT.NUM_CPF_CNPJ, CT.NUM_DDD_TELEFONE, CT.NUM_TELEFONE,CT.FAIXA_SALARIAL, CT.NOME_FANTASIA,  `;
            strSql     += `        CT.CODIGO_HASH, CB.NUM_CONTA, EN.CEP, EN.ENDERECO, EN.NUMERO, EN.COMPLEMENTO, EN.BAIRRO, EN.CIDADE, EN.UF, CB.SALDO_CONTA, CT.DATA_NASCIMENTO `;
            ///console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err) console.log(err)
                if(data.rowsAffected[0] > 0){
                    Helper.sendResponse(res, HttpStatus.OK, data.recordset);
                }else{
                    Helper.sendNaoEncontrado(res, HttpStatus.OK, data.recordset);
                }
            });
        });
    }
}

export default new ctrLoginUsuario();
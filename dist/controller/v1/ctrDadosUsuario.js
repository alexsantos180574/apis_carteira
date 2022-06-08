"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
const HttpStatus = require("http-status");
require('dotenv').config();
class ctrDadosUsuario {
    obterDadosUsuario(req, res) {
        const sql = require('mssql');
        // connect to your database
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            /*let strSql  = ` SELECT CASE WHEN count(AP.DOC_IDENTIFICACAO) > 0 THEN 'sim' ELSE 'nao' END AS existe, CT.EMAIL as email, CT.NOME as nome,  `;
            strSql     += `    (CASE WHEN ISNULL(CT.IMG_FOTO_FACE_BASE64, '') = '' THEN '' ELSE '${process.env.URL_FOTO_PERFIL}'+CT.IMG_FOTO_FACE_BASE64 END) AS foto, CT.NUM_DDD_TELEFONE AS num_ddd, CT.NUM_TELEFONE AS telefone, `;
            strSql     += `    CT.NOME_FANTASIA AS nome_fantasia_social, CB.NUM_CONTA AS num_conta, CB.SALDO_CONTA as saldo_conta `;
            strSql     += `    , CONVERT(VARCHAR(10), CT.DATA_NASCIMENTO, 103) AS data_nascimento, '213' as cod_banco, '0001' as cod_agencia `;
            strSql     += `    , EN.CEP AS cep, EN.ENDERECO AS endereco, EN.NUMERO AS numero, EN.COMPLEMENTO AS complemento, EN.BAIRRO AS bairro, EN.CIDADE AS cidade, EN.UF AS uf `;
            strSql     += `FROM TB_ACESSO_APLICATIVOS AP `;
            strSql     += `    LEFT JOIN TB_CLIENTES_TITULAR CT ON AP.DOC_IDENTIFICACAO = CT.NUM_CPF_CNPJ  `;
            strSql     += `    LEFT JOIN TB_CONTAS_BANCARIAS CB ON CT.ID_CLIENTE_TITULAR = CB.ID_CLIENTE_TITULAR `;
            strSql     += `    LEFT JOIN TB_ENDERECOS EN ON EN.ID_CLIENTE = CT.ID_CLIENTE_TITULAR  `;
            strSql     += ` WHERE AP.DOC_IDENTIFICACAO = '${req.params.documento}'`;
            strSql     += `GROUP BY CT.EMAIL, CT.NOME, CT.IMG_FOTO_FACE_BASE64, CT.NUM_DDD_TELEFONE, CT.NUM_TELEFONE, CT.NOME_FANTASIA,  `;
            strSql     += `        CB.NUM_CONTA, CB.SALDO_CONTA, CT.DATA_NASCIMENTO, `;
            strSql     += `        EN.CEP, EN.ENDERECO, EN.NUMERO, EN.COMPLEMENTO, EN.BAIRRO, EN.CIDADE, EN.UF `;*/
            let strSql = `SELECT CASE WHEN count(AP.DOC_IDENTIFICACAO) > 0
                                    THEN 'sim' ELSE 'nao'
                                  END AS existe
                                 ,CT.EMAIL as email
                                 ,CT.NOME as nome
                                 ,(CASE WHEN ISNULL(CT.IMG_FOTO_FACE_BASE64, '') = ''
                                     THEN '' ELSE '${process.env.URL_FOTO_PERFIL}'+CT.IMG_FOTO_FACE_BASE64
                                   END) AS foto
                                 ,CT.NUM_DDD_TELEFONE AS num_ddd
                                 ,CT.NUM_TELEFONE AS telefone
                                 ,CT.NOME_FANTASIA AS nome_fantasia_social

                                 ,ct.VALOR_PATRIMONIO AS patrimonio
                                 ,ct.RENDA_BRUTA_MENSAL AS renda
                                 ,ct.ID_PROFISSAO AS id_profissao
                                 ,ct.PEP AS pep
                                 ,pr.DESC_PROFISSAO AS profissao

                                 ,CB.NUM_CONTA AS num_conta
                                 ,CB.SALDO_CONTA as saldo_conta
                                 ,CONVERT(VARCHAR(10), CT.DATA_NASCIMENTO, 103) AS data_nascimento
                                 ,'213' as cod_banco
                                 ,'0001' as cod_agencia
                                 ,EN.CEP AS cep
                                 ,EN.ENDERECO AS endereco
                                 ,EN.NUMERO AS numero
                                 ,EN.COMPLEMENTO AS complemento
                                 ,EN.BAIRRO AS bairro
                                 ,EN.CIDADE AS cidade
                                 ,EN.UF AS uf
                           FROM TB_ACESSO_APLICATIVOS AP
                                LEFT JOIN TB_CLIENTES_TITULAR CT ON AP.DOC_IDENTIFICACAO = CT.NUM_CPF_CNPJ
                                LEFT JOIN TB_CONTAS_BANCARIAS CB ON CT.ID_CLIENTE_TITULAR = CB.ID_CLIENTE_TITULAR
                                LEFT JOIN TB_ENDERECOS EN ON EN.ID_CLIENTE = CT.ID_CLIENTE_TITULAR

                                left join TB_PROFISSOES PR ON PR.ID_PROFISSAO = CT.ID_PROFISSAO

                           WHERE AP.DOC_IDENTIFICACAO = '${req.params.documento}'
                           GROUP BY CT.EMAIL
                                   ,CT.NOME
                                   ,CT.IMG_FOTO_FACE_BASE64
                                   ,CT.NUM_DDD_TELEFONE
                                   ,CT.NUM_TELEFONE
                                   ,CT.NOME_FANTASIA

                                   ,ct.VALOR_PATRIMONIO
                                   ,ct.RENDA_BRUTA_MENSAL
                                   ,ct.ID_PROFISSAO
                                   ,ct.PEP
                                   ,pr.DESC_PROFISSAO

                                   ,CB.NUM_CONTA
                                   ,CB.SALDO_CONTA
                                   ,CT.DATA_NASCIMENTO
                                   ,EN.CEP
                                   ,EN.ENDERECO
                                   ,EN.NUMERO
                                   ,EN.COMPLEMENTO
                                   ,EN.BAIRRO
                                   ,EN.CIDADE
                                   ,EN.UF`;
            //console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err)
                    console.log(err);
                if (data.rowsAffected[0] > 0) {
                    helper_1.default.sendResponse(res, HttpStatus.OK, data.recordset);
                }
                else {
                    helper_1.default.sendNaoEncontrado(res, HttpStatus.OK, data.recordset);
                }
            });
        });
    }
}
exports.default = new ctrDadosUsuario();

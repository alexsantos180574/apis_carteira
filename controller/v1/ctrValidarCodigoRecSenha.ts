import Helper from "../../infra/helper";

class ctrValidarCodigoRecSenha{ 
    validaCodigo(req, res){
        const sql = require('mssql');
        // connect to your database
        sql.connect(Helper.configSql, function (err) {
            if (err){
                console.log(err);
                Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
            }else{
                // create Request object
                var request = new sql.Request();
                // query to the database and get the records
                let strSql  = ` SELECT TOP 1 DOC_IDENTIFICACAO as cpf, NOME as nome, EMAIL as email `;
                strSql     += `FROM TB_ACESSO_APLICATIVOS `;
                strSql     += ` WHERE DOC_IDENTIFICACAO = '${req.params.cpf}' AND COD_VERIFICACAO_SENHA = '${req.params.codigo}' `;
                //console.log(strSql);
                request.query(strSql, function (err, data) {
                    if (err){
                        console.log(err);
                        Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                    }else{
                        if(data.rowsAffected[0] > 0){
                            Helper.sendResponse(res, 201, data.recordset);
                        }else{
                            Helper.sendNaoEncontrado(res, 401, 'usuario nao encontrado');
                        }
                    }
                });
            }
        });
    }
}

export default new ctrValidarCodigoRecSenha();
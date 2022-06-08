import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";
import { send } from "process";

class ctrUsuarioExiste{ 
    vefiricarUsuario(req, res){
        const sql = require('mssql');
        // connect to your database
        sql.connect(Helper.configSql, function (err) {
            if (err) console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql  = ` SELECT TOP 1 DOC_IDENTIFICACAO as cpf, NOME as nome, EMAIL as email `;
            strSql     += `FROM TB_ACESSO_APLICATIVOS `;
            strSql     += ` WHERE DOC_IDENTIFICACAO = '${req.params.cpf}'`;
            ///console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err) console.log(err)

                if(data.rowsAffected[0] > 0){
                    Helper.sendResponse(res, HttpStatus.OK, data.recordset);
                }else{
                    Helper.sendNaoEncontrado(res, HttpStatus.OK, 'usuario nao encontrado');
                }
            });
        });
    }
}

export default new ctrUsuarioExiste();
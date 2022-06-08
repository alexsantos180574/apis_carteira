import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

class ctrUsuarioExisteChatbot{ 
    vefiricarUsuario(req, res){
        const sql = require('mssql');
        // connect to your database
        sql.connect(Helper.configSql, function (err) {
            if (err) console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql  = ` SELECT NUM_CPF_CNPJ as cpf, NOME as nome, EMAIL as email `;
            strSql     += `FROM TB_PRECADASTRO_CLIENTES_JETSONS `;
            strSql     += ` WHERE NUM_CPF_CNPJ = '${req.params.documento}'`;
            ///console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err) console.log(err)

                if(data.rowsAffected[0] > 0){
                    Helper.sendResponse(res, HttpStatus.OK, 'CPF já cadastrado!');
                }else{
                    Helper.sendNaoEncontradoMsgPersonalizada(res, HttpStatus.OK, 'CPF não encontrado');
                }
            });
        });
    }
}

export default new ctrUsuarioExisteChatbot();
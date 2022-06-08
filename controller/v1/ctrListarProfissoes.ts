import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

async function getListaProfissoes(res){

    const sql = require('mssql');
    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        
        let strSql  = " SELECT ID_PROFISSAO AS id_profissao, DESC_PROFISSAO AS profissao FROM TB_PROFISSOES WHERE ATIVO = 'S' ORDER BY DESC_PROFISSAO ";
        request.query(strSql, function (err, data) {
            if (err) console.log(err)
            Helper.sendResponse(res, HttpStatus.OK, data.recordset);
        });
    });
}

class ctrListarProfissoes{ 
    listarProfissoes(req, res){
        getListaProfissoes(res);
    }
}

export default new ctrListarProfissoes();
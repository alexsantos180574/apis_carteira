import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

async function getListaBancos(res){

    const sql = require('mssql');
    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        
        let strSql  = " SELECT NUM_BANCO AS num_banco, NOME_BANCO AS nome_banco FROM TB_LISTA_BANCOS WHERE ATIVO = 'S' ORDER BY NUM_BANCO ";
        request.query(strSql, function (err, data) {
            if (err) console.log(err)
            Helper.sendResponse(res, HttpStatus.OK, data.recordset);
        });
    });
}

class ctrListarBancos{ 
    listarBancos(req, res){
        getListaBancos(res);
    }
}

export default new ctrListarBancos();
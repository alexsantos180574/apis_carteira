import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

async function getListaFavoritosTED(res, _agencia, _conta){

    const sql = require('mssql');
    // connect to your database
    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        let strSql  = `SELECT ID_FAVORITOS_CONTAS_TRANSFERENCIAS AS id_favorito
                             ,NUM_BANCO AS num_banco
                             ,NUM_AGENCIA AS num_agencia
                             ,NUM_CONTA AS num_conta
                             ,NOME AS nome
                             ,CPF AS cpf
                             ,convert(varchar(10), DATA_CADASTRO, 103)+' '+convert(varchar(8), DATA_CADASTRO, 108) as data_cadastro
                       FROM TB_FAVORITOS_CONTAS_TRANSFERENCIAS
                       WHERE CONTA_ORIGEM = '${_conta}'
                         AND NUM_AGENCIA_ORIGEM = '${_agencia}'
                         AND NUM_BANCO <> 213
                       ORDER BY DATA_CADASTRO DESC`

        request.query(strSql, function (err, data) {
            if (err) console.log(err)
            Helper.sendResponse(res, HttpStatus.OK, data.recordset);
        });
    });
}

class ctrListarFavoritosContasTED{ 
    listarFavoritosTED(req, res){
        getListaFavoritosTED(res, req.params.agencia.toString(), req.params.conta.toString());
    }
}

export default new ctrListarFavoritosContasTED();
import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";


async function getListaFavoritos(res, _agencia, _conta){

    const sql = require('mssql');
    // connect to your database
    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        let strSql  = " select ID_FAVORITOS_CONTAS_TRANSFERENCIAS AS id_favorito, NUM_BANCO AS num_banco, NUM_AGENCIA AS num_agencia, NUM_CONTA AS num_conta, NOME AS nome, CPF AS cpf, ";
        strSql += " convert( varchar(10), DATA_CADASTRO, 103)+' '+convert(varchar(8), DATA_CADASTRO, 108)  as data_cadastro ";
        strSql += " from TB_FAVORITOS_CONTAS_TRANSFERENCIAS WHERE CONTA_ORIGEM = '"+_conta+"' AND NUM_AGENCIA_ORIGEM = '"+_agencia+"'";
        strSql += " ORDER BY DATA_CADASTRO DESC";
        //console.log(strSql);
        request.query(strSql, function (err, data) {
            if (err) console.log(err)
            Helper.sendResponse(res, HttpStatus.OK, data.recordset);
        });
    
    });
}

class ctrListarFavoritosContas{ 
    listarFavoritos(req, res){
        getListaFavoritos(res, req.params.agencia.toString(), req.params.conta.toString());
    }
}

export default new ctrListarFavoritosContas();
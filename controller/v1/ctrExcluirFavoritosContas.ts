////import mdlExtrato from "../models/mdlExtrato";
import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";
import { Console } from "console";

async function excluirFavorito(res, cod){

    const sql = require('mssql');

    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        let strSql  = ` DELETE TB_FAVORITOS_CONTAS_TRANSFERENCIAS WHERE ID_FAVORITOS_CONTAS_TRANSFERENCIAS = '${cod}' `;

        request.query(strSql, function (err, data) {
            if (err){
                Helper.sendFalhaCadastro(res, 500, 'Falha excluir item!');
                console.log(err);
            }else{
                ///console.log(strSql);
                Helper.sendResponse(res, 201, 'Exclusão efetuada com sucesso!');    
            }
        });
    });
}

class ctrExcluirFavoritosContas{ 
    excluiFavorito(req, res){
        excluirFavorito(res, req.params.cod);
    }
}

export default new ctrExcluirFavoritosContas();
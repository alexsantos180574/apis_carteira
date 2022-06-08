////import mdlExtrato from "../models/mdlExtrato";
import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";
import { Console } from "console";

async function excluirDadosFavorito(res, cod){

    const sql = require('mssql');

    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        let strSql  = `DELETE TB_CARTAO_DE_CREDITO WHERE ID_CARTAO = '${cod}' `;
        //console.log(strSql);
        request.query(strSql, function (err, data) {
            if (err){
                console.log(err);
                Helper.sendFalhaCadastro(res, 500, 'Falha ao excluir o item selecionado!');                
            }else{
                Helper.sendResponse(res, 201, 'Exclusão efetuada com sucesso!');    
            }
        });
    });
}

class ctrExcluirFavoritosContas{ 
    excluirFavoritoCartao(req, res){
        excluirDadosFavorito(res, req.params.cod);
    }
}

export default new ctrExcluirFavoritosContas();
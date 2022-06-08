////import mdlExtrato from "../models/mdlExtrato";
import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

async function atualizafotoperfil(res, documento, client_id, nomefoto){

    const sql = require('mssql');
    const clientid = ( ( typeof(client_id) == "undefined" ? '': ( client_id == '' ? '' : client_id) ) );
    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        
        // query to the database and get the records
        let strSql  = `UPDATE TB_CLIENTES_TITULAR SET IMG_FOTO_FACE_BASE64 = '${nomefoto}', CLIENT_ID = '${clientid}' WHERE NUM_CPF_CNPJ = '${documento}' `;
        ///console.log(strSql);
        request.query(strSql, function (err, data) {
            if (err){
                console.log(err)
                res.status(500).send({erro: 'Erro ao enviar foto!'});
            }else{
                Helper.sendResponse(res, HttpStatus.OK, 'Foto enviada com sucesso!');
            }
        });
    });
}

class ctrRecebeImagens{ 
    validarImagens(req, res){
        atualizafotoperfil(res, req.params.documento, req.params.client_id, req.file.originalname);
    }
}

export default new ctrRecebeImagens();
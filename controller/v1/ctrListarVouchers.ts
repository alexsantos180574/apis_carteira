import Helper from "../../infra/helper";

async function obterListaVouchers(res, obj, documento, tiporetorno){

    const sql = require('mssql');
    sql.connect(Helper.configSql, function (err) {
        if (err){
            console.log(err);
            Helper.sendErro(res, 500, 'Ocorreu um problema interno, por favor, tente mais tarde!');
        }else{
            var request = new sql.Request();
        
            let strSql  = " SELECT ID_VAUCHER as idvoucher,NUM_CPF as numcpf,CODIGO_VAUCHER as codvoucher,VALOR_VAUCHER as valorvoucher, DATA_VAUCHER as datavoucher, CODIGO_RASH as codigorash,RESGATADO as resgatado, DATA_RESGATE as dataresgate ";
            strSql  += ` FROM TB_VOUCHERS_KICKSTART `;
            strSql  += `   WHERE NUM_CPF = '${documento}' `;
            if(tiporetorno == 'validos'){
                strSql  += `     AND DATA_RESGATE IS NULL `;
            }else{
                strSql  += `     AND DATA_RESGATE IS NOT NULL `;
            }
           
            request.query(strSql, function (err, data) {
                if (err){
                    console.log(err);
                    Helper.sendErro(res, 500, 'Ocorreu um problema interno, por favor, tente mais tarde!');
                }else{
                    Helper.sendResponse(res, 200, data.recordset);
                }
            });
        } 
    });
}

class ctrListarVouchers{ 
    listarVouchers(req, res){
        let obj = req.body;
        obterListaVouchers(res, obj, req.params.documento, req.params.tiporetorno);
    }
}

export default new ctrListarVouchers();
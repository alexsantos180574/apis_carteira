"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
class CtrTipoConta {
    listarTipoConta(req, res) {
        let arrCaixa = [
            { codigo: '001', tipo: 'Conta Corrente PF' },
            { codigo: '002', tipo: 'Conta Simples PF' },
            { codigo: '003', tipo: 'Conta Corrente PJ' },
            { codigo: '013', tipo: 'Poupança PF' },
            { codigo: '022', tipo: 'Poupança PJ' },
            { codigo: '023', tipo: 'Conta Caixa Fácil PF' }
        ];
        let arrOutros = [
            { codigo: '001', tipo: 'Conta Corrente PF' },
            { codigo: '002', tipo: 'Conta Poupança PF' },
            { codigo: '003', tipo: 'Conta Corrente PJ' },
            { codigo: '004', tipo: 'Conta Poupança PJ' },
            { codigo: '005', tipo: 'Conta Salário PF' }
        ];
        //console.log(req.body.codbanco);        
        helper_1.default.sendResponse(res, 200, ((req.params.codbanco == 104) ? arrCaixa : arrOutros));
        /*
        const sql = require('mssql');

        sql.connect(Helper.configSql, function (err) {

            if (err) console.log(err);

            var request = new sql.Request();
            let strSql = `SELECT * FROM TB_TIPO_CONTA_BANCARIA`;

            request.query(strSql, function (err, data) {
                if (err) {
                    console.log(err);
                    Helper.sendErro(res, 500, 'Erro ao executar a operação!');
                }else{
                    Helper.sendResponse(res, 200, data.recordset);
                }
            });
        });*/
    }
}
exports.default = new CtrTipoConta();

import Helper from "../../infra/helper";

async function novoGiftCard(res, obj, token){
    var tratarCampos = '';
    
    let client_id = ( obj.client_id != '' ? obj.client_id : tratarCampos = 'client_id' );
    let valor = ( obj.valor != '' ? obj.valor : tratarCampos = 'valor' );
    let conta = ( obj.conta != '' ? obj.conta : tratarCampos = 'conta' );
    let documento = ( obj.documento != '' ? obj.documento : tratarCampos = 'documento' );

    if(tratarCampos == ''){
        let codehash = Helper.getCodGiftCard(); //Helper.getCodGiftCard;//Helper.gerarCodVerificacao(100000000000, 999999999999);

        const sql = require('mssql');
        sql.connect(Helper.configSql, function (err) {
            if (err){
                console.log(err);
                Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
            }else{
                var request = new sql.Request();
                let strSql  = ` SELECT TOP 1 ACCESS_TOKEN `;
                strSql     += `FROM TB_TOKENS `;
                ///strSql     += ` WHERE ACCESS_TOKEN = '${token}' AND VALIDO = 'S' `; não necessita de token para os Apps
                //console.log(strSql);
                request.query(strSql, function (err, data) {
                    if (err){
                        console.log(err);
                        Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                    }else{
                        if(data.rowsAffected[0] > 0){
                            let sqlStrT = ` INSERT INTO TB_GIFT_CARDS(CODIGO_GIFT_CARD, CLIENT_ID, TOKEN_VALIDACAO, VALOR_GIFT, NUM_CONTA, DOCUMENTO) VALUES ( '${codehash}', '${client_id}','${token}', ${valor}, '${conta}', '${documento}' ) `;
                            //console.log(sqlStr); 
                            request.query(sqlStrT, function (err, data) {
                                if (err){
                                    console.log(err);
                                    Helper.sendErro(res, 500, 'Falha ao gerar GiftCard!');
                                }else{
                                    Helper.sendResponse(res, 201, {codigo_giftcard:codehash,mensagem:""});
                                }
                            });
                        }else{
                            Helper.sendNaoEncontradoMsgPersonalizada(res, 401, {erro:'Token inválido ou já foi utilizado!'});
                        }
                    }
                });
            } 
        });
    }else{
        //console.log('teste 05'+tratarCampos);
        res.status(400).send({erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false})
    }
}

class ctrCadGiftCardKickPay{
    incGiftCard(req, res){
        var obj = req.body;
        let token = '1';//req.headers.authorization.replace("Bearer ", "");
        if(token){
            novoGiftCard(res, obj, token);
        }else{
            res.status(400).send({erro: `o TOKEN é obrigatório!`, status: false})
        }
        
    }
}

export default new ctrCadGiftCardKickPay();

import Helper from "../../infra/helper";

async function validaGiftCard(res, obj, token){
    var tratarCampos = '';
    var codigoGiftCard = ( obj.codigogiftcard != '' ? obj.codigogiftcard : tratarCampos = 'codigogiftcard' );

    if(tratarCampos == ''){
        let codehash = Helper.getHash();
        const sql = require('mssql'); 
        sql.connect(Helper.configSql, function (err) {
            if (err){
                console.log(err);
                Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
            }else{
                // create Request object
                var request = new sql.Request();
                // query to the database and get the records
                let strSql  = ` SELECT ACCESS_TOKEN `;
                strSql     += `FROM TB_TOKENS `;
                strSql     += ` WHERE ACCESS_TOKEN = '${token}' AND VALIDO = 'S' `;
                //console.log(strSql);
                request.query(strSql, function (err, data) {
                    if (err){
                        console.log(err);
                        Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                    }else{
                        if(data.rowsAffected[0] > 0){
                            let strSql  = ` SELECT CODIGO_GIFT_CARD as giftcardcodigo, CONVERT(VARCHAR(10), DATA_CRIACAO_GIFT, 103) as datacriacao, VALOR_GIFT as valor,  `;
                            strSql     += `       CASE WHEN GIFT_USADO = 'S' THEN 'Este Gift Card já foi utilizado.' WHEN DATA_CANCELAMENTO_GIFT IS NOT NULL THEN 'Gift Card Cancelado' ELSE 'Gift Card válido' END AS statusgiftcard `;
                            strSql     += `      ,DATA_USO_GIFT as datauso, CONVERT(VARCHAR(10), DATA_CANCELAMENTO_GIFT, 103) as datacancelamento, MOTIVO_CANCELAMENTO_GIFT as motivocancelamento `;
                            strSql     += `FROM TB_GIFT_CARDS `;
                            strSql     += ` WHERE CODIGO_GIFT_CARD = '${codigoGiftCard}' `;
                            ///console.log(strSql);
                            request.query(strSql, function (err, dataG) {
                                if (err){
                                    console.log(err);
                                    Helper.sendErro(res, 500, 'Falha ao validar GiftCard!');
                                }else{
                                    if(dataG.rowsAffected[0] > 0){
                                        Helper.sendResponse(res, 201, dataG.recordset);
                                    }else{
                                        Helper.sendNaoEncontradoMsgPersonalizada(res, 401, 'Gift Card não encontrado');
                                    }
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

class ctrValidarGiftCard{ 
    validarGiftCard(req, res){
        //console.log(req.headers.authorization);
        if(typeof(req.headers.authorization) != "undefined"){
            let token = req.headers.authorization.replace("Bearer ", "");
            let obj = req.body;

            if(token){
                validaGiftCard(res, obj, token);
            }else{
                res.status(400).send({erro: `o TOKEN é obrigatório!`, status: false})
            }
        }else{
            ///console.log(`o TOKEN é obrigatório!`);
            res.status(400).send({erro: `o TOKEN é obrigatório!`, status: false})
        }
    }
}

export default new ctrValidarGiftCard();
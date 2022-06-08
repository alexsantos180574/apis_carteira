"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
function obterListaGiftCards(_tipo) {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var data = JSON.stringify({ "Product": _tipo });
        var config = {
            method: 'post',
            url: 'https://dev.meu.cash/apiv10Sandbox/transaction/out/recharge/products',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        return axios(config)
            .then(function (response) {
            const objeto = JSON.parse(JSON.stringify(response.data));
            return response.data;
        })
            .catch(function (error) {
            return error;
        });
    });
}
class ctrObterListaGiftCard {
    obterListaGC(req, res) {
        let arrLista = [];
        let erro = '';
        let strNome = '';
        let urlImage = 'https://api-atlanticbank-uploads.s3-sa-east-1.amazonaws.com/giftcards/';
        if (req.params.tipo == 'giftcards') {
            /* OBTER A LISTA DE KICKPAY */
            const sql = require('mssql');
            sql.connect(helper_1.default.configSql, function (err) {
                if (err)
                    console.log(err);
                var request = new sql.Request();
                let strSql = " SELECT VALOR_GIFT_CARD FROM TB_GIFT_CARD_VALORES WHERE ATIVO = 'S' ORDER BY VALOR_GIFT_CARD ";
                request.query(strSql, function (err, data) {
                    if (err) {
                        console.log(err);
                        helper_1.default.sendErro(res, 401, 'Falha ao obter lista de recarga KICKPAY!');
                    }
                    let varr = JSON.parse(JSON.stringify(data.recordset));
                    let arrPriceList = [];
                    for (var i in varr) {
                        arrPriceList.push(varr[i].VALOR_GIFT_CARD);
                    }
                    var arr1 = JSON.parse(JSON.stringify({ Name: "KICKSTART", PriceRange: null, PriceList: arrPriceList, CustomerIdentifierField: urlImage + 'KICKSTART.png' }));
                    let arrgc = { Result: { Product: "giftCardsKickStart", Options: [] }, Success: true, Message: "", StatusCode: 200 };
                    arrgc.Result.Options.push(arr1);
                    arrLista.push(arrgc);
                });
            });
            /* OBTER A LISTA DE RECARGA DE CELULAR */
            /* OBTER A LISTA DE TRANSPORTE */
            obterListaGiftCards("TransportationRecharge ")
                .then(listaTRANSPORTE => {
                ///console.log(listaTRANSPORTE.Result.Options);
                for (var i in listaTRANSPORTE.Result.Options) {
                    strNome = urlImage + listaTRANSPORTE.Result.Options[i].Name.replace(' ', '_').replace(' ', '_') + '.png';
                    listaTRANSPORTE.Result.Options[i].CustomerIdentifierField = strNome;
                }
                arrLista.push(listaTRANSPORTE);
                /* OBTER A LISTA DE ETRETENIMENTO */
                obterListaGiftCards("EntertainmentRecharge  ")
                    .then(listaETRETENIMENTO => {
                    for (var i in listaETRETENIMENTO.Result.Options) {
                        strNome = urlImage + listaETRETENIMENTO.Result.Options[i].Name.replace(' ', '_').replace(' ', '_') + '.png';
                        listaETRETENIMENTO.Result.Options[i].CustomerIdentifierField = strNome;
                    }
                    arrLista.push(listaETRETENIMENTO);
                    /* OBTER A LISTA DE JOGOS */
                    obterListaGiftCards("GamesRecharge")
                        .then(listaJOGOS => {
                        for (var i in listaJOGOS.Result.Options) {
                            strNome = urlImage + listaJOGOS.Result.Options[i].Name.replace(' ', '_').replace(' ', '_') + '.png';
                            listaJOGOS.Result.Options[i].CustomerIdentifierField = strNome;
                        }
                        arrLista.push(listaJOGOS);
                        /* OBTER A LISTA DE WALLET */
                        //obterListaGiftCards("WalletRecharge")
                        //.then(listaWALLET => {
                        //    arrLista.push(listaWALLET);
                        /* OBTER A LISTA DE KICKPAY */
                        /*
                        const sql = require('mssql');
                        sql.connect(Helper.configSql, function (err) {
                            if (err) console.log(err);
                            var request = new sql.Request();
                            
                            let strSql  = " SELECT VALOR_GIFT_CARD FROM TB_GIFT_CARD_VALORES WHERE ATIVO = 'S' ORDER BY VALOR_GIFT_CARD ";
                            request.query(strSql, function (err, data) {
                                if (err){
                                    console.log(err);
                                    Helper.sendErro(res, 401, 'Falha ao obter lista de recarga KICKPAY!');
                                }
                                let varr = JSON.parse(JSON.stringify(data.recordset));
                                let arrPriceList = [];
                                
                                for(var i in varr){
                                    arrPriceList.push(varr[i].VALOR_GIFT_CARD);
                                }
                                
                                var arr1 = JSON.parse(JSON.stringify({Name:"KICKSTART", PriceRange:null, PriceList:arrPriceList, CustomerIdentifierField:urlImage+'KICKSTART.png'}));
                                let arrgc = {Result:{Product:"giftCardsKickStart", Options:[]}, Success:true, Message:"", StatusCode:200};
                                arrgc.Result.Options.push(arr1);
                                arrLista.push(arrgc);

                                Helper.sendLista(res, 201, arrLista);
                            });
                        });*/
                        helper_1.default.sendLista(res, 201, arrLista);
                        //})
                    });
                });
            })
                .catch(error => {
                erro = error;
                console.log(erro);
                helper_1.default.sendErro(res, 500, 'Falha ao obter lista de recarga de GIFTCARDS!');
            });
        }
        else {
            obterListaGiftCards("PhoneRecharge")
                .then(listaCELULAR => {
                for (var i in listaCELULAR.Result.Options) {
                    strNome = urlImage + listaCELULAR.Result.Options[i].Name.replace(' ', '_').replace(' ', '_') + '.png';
                    listaCELULAR.Result.Options[i].CustomerIdentifierField = strNome;
                }
                arrLista.push(listaCELULAR);
                helper_1.default.sendLista(res, 201, arrLista);
            })
                .catch(error => {
                erro = error;
                console.log(erro);
                helper_1.default.sendErro(res, 500, 'Falha ao obter lista de recarga de CELULAR!');
            });
        }
    }
}
exports.default = new ctrObterListaGiftCard();

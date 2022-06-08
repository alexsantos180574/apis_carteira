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
const funcoes_1 = require("../../models/funcoes");
function recuperaImagensSite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlSitePiraque = 'https://www.piraque.org.br/site/';
        let imagensSite = [];
        var axios = require('axios');
        var cheerio = require('cheerio');
        try {
            const { data: dom } = yield axios(urlSitePiraque);
            const $ = cheerio.load(dom);
            const tagImg = $('.sow-slider-background-image.skip-lazy');
            const lis = $('.sow-slider-image.sow-slider-image-cover');
            if (tagImg.length > 0) {
                lis.each((k, v) => {
                    imagensSite.push({
                        id: k.toString(),
                        image: $(v).find(".sow-slider-background-image.skip-lazy").attr("src"),
                        target: $(v).find("a").attr("href") || ""
                    });
                });
            }
            res.status(200).send({
                status: true,
                resultado: imagensSite
            });
        }
        catch (e) {
            res.status(400).send({
                status: false,
                resultado: imagensSite,
                mensagem: "Não foi possível recuperar as imagens do site."
            });
        }
    });
}
class ctrServicos {
    getImagensSite(req, res) {
        let obj = req.body;
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                recuperaImagensSite(req, res);
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
}
exports.default = new ctrServicos();

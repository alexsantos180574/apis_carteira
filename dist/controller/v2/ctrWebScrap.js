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
const puppeteer = require('puppeteer');
const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const path = require('path');
const funcoes_1 = require("../../models/funcoes");
function saveBoleto(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cpf } = request.params;
        if (!cpf || cpf.length != 11) {
            //console.log('cpf')
            return response.json({ message: 'CPF formato incorreto' }).status(400);
        }
        var href = '';
        var danger = '';
        const url = 'https://smaraa.smarapd.com.br/SegundaVia/ClubeNaval';
        const browser = yield puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = yield browser.newPage();
        try {
            yield page.goto(url, { waitUntil: 'networkidle2' });
            yield page.waitForSelector('input');
            yield page.type('#CpfCnpj', cpf, { delay: 10 });
            yield page.$eval('button.btn-success', form => form.click());
            // danger = await page.waitForSelector('span.label-danger', label => label.innerText)
            // console.log(danger)
            yield page.waitForSelector('th > a', { timeout: 5000 });
            href = yield page.$eval('th > a', a => a.href);
        }
        catch (e) {
            // console.table(e)
            if (e.name === 'TimeoutError') {
                const { name } = e;
                console.log('erro ', name);
                return response.json({ erro: name, message: 'CPF incorreto' });
            }
            return response.json({ erro: e }).status(400);
        }
        while (!href.length) {
            yield funcoes_1.sleep(200);
        }
        try {
            const file = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'files', `${cpf}.pdf`));
            yield https.get(href, function (response) {
                response.pipe(file);
            });
            return response.json({ path: `http://api.myclube.com.br:90/apis/files/${cpf}.pdf` });
            //return response.json({path: `https://${process.env.APPLICATION_HOST}/files/${cpf}.pdf`})
        }
        catch (e) {
            return response.json({ error: e }).status(400);
        }
    });
}
function run(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                //const browser = await puppeteer.launch();
                const { cpf } = request.params;
                const url = 'https://smaraa.smarapd.com.br/SegundaVia/ClubeNaval';
                const browser = yield puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
                const page = yield browser.newPage();
                //await page.goto("https://smaraa.smarapd.com.br/SegundaVia/ClubeNaval");
                yield page.goto(url, { waitUntil: 'networkidle2' });
                yield page.waitForSelector('input');
                yield page.type('#CpfCnpj', cpf, { delay: 10 });
                yield page.$eval('button.btn-success', form => form.click());
                yield page.waitForSelector('th > a', { timeout: 5000 });
                const data = yield page.evaluate(() => {
                    const tds = Array.from(document.querySelectorAll('table tr td'));
                    return tds.map(td => td.innerHTML);
                });
                let arrData = [];
                for (let i = 0; i < data.length; i++) {
                    let venc = data[i];
                    i++;
                    let nom = data[i];
                    i++;
                    let doc = data[i];
                    arrData.push({ vencimento: venc, nome: nom, documento: doc, link: '' });
                }
                let urls = yield page.evaluate(() => {
                    let results = [];
                    let items = document.querySelectorAll('th > a');
                    items.forEach((item) => {
                        let texto = 'download';
                        results.push({
                            url: 'https://smaraa.smarapd.com.br' + item.getAttribute('href'),
                            text: texto
                        });
                    });
                    return results;
                });
                for (let i = 0; i < urls.length; i++) {
                    //console.log(urls[i].url)
                    arrData[i].link = urls[i].url;
                }
                //browser.close();
                return response.json({ url: arrData });
            }
            catch (e) {
                response.json({ erro: e }).status(400);
            }
        }));
    });
}
function cadIntegrado(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                //const browser = await puppeteer.launch();
                const matricula = '05039150';
                const dataNasc = '09/07/1974';
                const url = 'https://www.clubenaval.org.br/Recadastramento/2012/login_piraque/';
                const browser = yield puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
                const page = yield browser.newPage();
                //await page.goto("https://smaraa.smarapd.com.br/SegundaVia/ClubeNaval");
                yield page.goto(url, { waitUntil: 'networkidle2' });
                yield page.waitForSelector('input');
                yield page.type('#id_sc_field_socio_matricula', matricula, { delay: 10 });
                yield page.type('#id_sc_field_socio_data_nascimento', dataNasc, { delay: 10 });
                yield page.$eval('button.btn-success', form => form.click());
                yield page.waitForSelector('th > a', { timeout: 5000 });
                const data = yield page.evaluate(() => {
                    const tds = Array.from(document.querySelectorAll('table tr td'));
                    return tds.map(td => td.innerHTML);
                });
                let arrData = [];
                for (let i = 0; i < data.length; i++) {
                    let venc = data[i];
                    i++;
                    let nom = data[i];
                    i++;
                    let doc = data[i];
                    arrData.push({ vencimento: venc, nome: nom, documento: doc, link: '' });
                }
                let urls = yield page.evaluate(() => {
                    let results = [];
                    let items = document.querySelectorAll('th > a');
                    items.forEach((item) => {
                        let texto = 'download';
                        results.push({
                            url: 'https://smaraa.smarapd.com.br' + item.getAttribute('href'),
                            text: texto
                        });
                    });
                    return results;
                });
                for (let i = 0; i < urls.length; i++) {
                    //console.log(urls[i].url)
                    arrData[i].link = urls[i].url;
                }
                //browser.close();
                return response.json({ url: arrData });
            }
            catch (e) {
                response.json({ erro: e }).status(400);
            }
        }));
    });
}
class scrapURL {
    obterScrapUrl(req, res) {
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                run(req, res);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
}
exports.default = new scrapURL();

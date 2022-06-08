"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helper {
    constructor() {
        //Método genérico 
        this.sendResponse = function (res, statusCode, data) {
            res.status(statusCode).json({ resultado: data, status: true });
        };
        this.sendExtrato = function (res, statusCode, data) {
            res.status(statusCode).json({ Extrato: data });
        };
        this.sendNaoEncontrado = function (res, statusCode, data) {
            res.status(statusCode).json({ status: false, resultado: 'não encontrado' });
        };
        this.sendCartao = function (res, statusCode, data) {
            res.status(statusCode).json({ resultado: data, status: true });
        };
        this.sendNaoEncontradoMsgPersonalizada = function (res, statusCode, data) {
            res.status(statusCode).json({ resultado: data, status: false });
        };
        this.sendErro = function (res, statusCode, data) {
            res.status(statusCode).json({ descricao: data, status: false });
        };
        this.sendLista = function (res, statusCode, data) {
            res.status(statusCode).json({ lista: data });
        };
        this.sendFalhaCadastro = function (res, statusCode, data) {
            res.status(statusCode).json({ status: false });
        };
        this.sendFalha = function (res, statusCode, data) {
            res.status(statusCode).json({ status: false });
        };
        this.sendSaldo = function (res, statusCode, data) {
            res.status(statusCode).json({ saldo: data, status: true });
        };
        this.sendTrataCampo = function (res, statusCode, data) {
            res.status(statusCode).json({ mensagem: data, retorno: false });
        };
        this.getToken = function (res, statusCode, data) {
            res.status(statusCode).json({ token: data });
        };
        this.getHash = function () {
            let today = new Date();
            let hora = today.getHours();
            let mes = today.getMinutes();
            let segundo = today.getSeconds();
            let dia = today.getDate();
            let ano = today.getFullYear();
            let mseg = today.getMilliseconds();
            let num1 = hora + mes + segundo + dia + ano + mseg;
            let num2 = (hora + mes + segundo + dia + ano + mseg) * 10;
            let hash = require('object-hash');
            let codehash = hash([1, 2, num1, num2]);
            return codehash;
        };
        this.getCodGiftCard = function () {
            let today = new Date();
            let hora = today.getHours();
            let mes = today.getMinutes();
            let segundo = today.getSeconds();
            let dia = today.getDate();
            let ano = today.getFullYear();
            let mseg = today.getMilliseconds();
            let num1 = hora + mes + segundo + dia + ano + mseg;
            let num2 = (hora + mes + segundo + dia + ano + mseg) + num1;
            let min = Math.ceil((num1 * num1) * 100000);
            let max = Math.floor((num2 * num2) * 100000);
            let codehash = Math.floor(Math.random() * (max - min)) + min;
            return codehash;
        };
        this.gerarCodVerificacao = function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        };
        this.tratarCamposObrigatorios = (obj, arrExcessao) => {
            let retorno = '';
            for (var i in obj) {
                if (((!obj[i]) && (arrExcessao.indexOf(i) == -1))) {
                    retorno = i;
                }
            }
            return retorno;
        };
    }
    retirarAcentos(str) {
        const com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
        const sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
        let novastr = "";
        for (let i = 0; i < str.length; i++) {
            let troca = false;
            for (let a = 0; a < com_acento.length; a++) {
                if (str.substr(i, 1) == com_acento.substr(a, 1)) {
                    novastr += sem_acento.substr(a, 1);
                    troca = true;
                    break;
                }
            }
            if (troca == false) {
                novastr += str.substr(i, 1);
            }
        }
        return novastr;
    }
    configSql() {
        let resultado = {
            user: 'alexsantos1974_myclube',
            password: 'Ale775569!',
            server: 'alexsantos1974_myclube.sqlserver.dbaas.com.br',
            database: 'alexsantos1974_myclube',
            port: 1433,
            options: {
                'enableArithAbort': true
            }
        };
        return resultado;
    }
    ;
    retornaTokenIugu(ambiente) {
        let resultado = '';
        switch (ambiente) {
            case 'producao':
                resultado = ' ';
                break;
            default:
                resultado = `92a1f275c5abcd2834831a0b995b4fa7`; //ambiente de testes
        }
        return resultado;
    }
    /*
        clientIDValido(client_id){
            let resultado = '';
            switch (client_id) {
                case 'c3356a692062dfe374c2758b4d6f2aeddf45d86b': //Jetsons Clube
                    resultado = 'OK';
                    break;
                case '5e2865761b2d3449131abd90564aceefebcab6dd': //CM
                    resultado = 'OK';
                    break;
                case 'ac24053e27cb869d49b24fa93febcfc169907c0e': //Teste
                    resultado = 'OK';
                    break;
                case 'a88d5080b86c4a691622099d4ef9b0e177bd5d12': //MyClube
                    resultado = 'OK';
                    break;
                default:
                    resultado =`O client_id informado é inválido : ${client_id}.`;
              }
            return resultado;
        };
    */
    objValido(obj, atributo) {
        console.log(obj.attr(atributo));
        //if(typeof(req.headers.authorization) != "undefined"){
    }
    retornarBanco(isbp) {
        var arrIspbs = [];
        arrIspbs.push({ ispb: 92874270, banco: 'Banco A.J. RENNER' });
        arrIspbs.push({ ispb: 28195667, banco: 'Banco ABC Brasil' });
        arrIspbs.push({ ispb: 3532415, banco: 'Banco ABN AMRO' });
        arrIspbs.push({ ispb: 3323840, banco: 'Banco ALFA' });
        arrIspbs.push({ ispb: 54403563, banco: 'Banco ARBI' });
        arrIspbs.push({ ispb: 9391857, banco: 'Banco AZTECA do Brasil' });
        arrIspbs.push({ ispb: 61146577, banco: 'Banco BARCLAYS' });
        arrIspbs.push({ ispb: 15114366, banco: 'Banco BBM' });
        arrIspbs.push({ ispb: 997185, banco: 'Banco BMFBOVESPA' });
        arrIspbs.push({ ispb: 61186680, banco: 'Banco BMG' });
        arrIspbs.push({ ispb: 1522368, banco: 'Banco BNP PARIBAS Brasil' });
        arrIspbs.push({ ispb: 33485541, banco: 'Banco BOA VISTA INTERATLANTICO' });
        arrIspbs.push({ ispb: 71027866, banco: 'Banco BONSUCESSO' });
        arrIspbs.push({ ispb: 48795256, banco: 'Banco BRACCE' });
        arrIspbs.push({ ispb: 4184779, banco: 'Banco BRADESCARD' });
        arrIspbs.push({ ispb: 60746948, banco: 'Banco BRADESCO' });
        arrIspbs.push({ ispb: 60746948, banco: 'Banco BRADESCO BBI' });
        arrIspbs.push({ ispb: 59438325, banco: 'Banco BRADESCO CARTÕES' });
        arrIspbs.push({ ispb: 7207996, banco: 'Banco BRADESCO FINANCIAMENTOS' });
        arrIspbs.push({ ispb: 30306294, banco: 'Banco BTG PACTUAL' });
        arrIspbs.push({ ispb: 33349358, banco: 'Banco CACIQUE' });
        arrIspbs.push({ ispb: 33466988, banco: 'Banco CAIXA GERAL – Brasil' });
        arrIspbs.push({ ispb: 15173776, banco: 'Banco CAPITAL' });
        arrIspbs.push({ ispb: 3609817, banco: 'Banco CARGILL' });
        arrIspbs.push({ ispb: 33132044, banco: 'Banco CEDULA' });
        arrIspbs.push({ ispb: 558456, banco: 'Banco CETELEM' });
        arrIspbs.push({ ispb: 62421979, banco: 'Banco CIFRA' });
        arrIspbs.push({ ispb: 33479023, banco: 'Banco CITIBANK' });
        arrIspbs.push({ ispb: 31597552, banco: 'Banco CLÁSSICO' });
        arrIspbs.push({ ispb: 2038232, banco: 'Banco COOPERATIVO do Brasil – Bancoob' });
        arrIspbs.push({ ispb: 1181521, banco: 'Banco COOPERATIVO SICREDI' });
        arrIspbs.push({ ispb: 75647891, banco: 'Banco CREDIT AGRICOLE Brasil' });
        arrIspbs.push({ ispb: 32062580, banco: 'Banco CREDIT SUISSE (Brasil)' });
        arrIspbs.push({ ispb: 4902979, banco: 'Banco da AMAZONIA' });
        arrIspbs.push({ ispb: 10690848, banco: 'Banco da CHINA Brasil' });
        arrIspbs.push({ ispb: 62232889, banco: 'Banco DAYCOVAL' });
        arrIspbs.push({ ispb: 33042151, banco: 'Banco de LA NACION ARGENTINA' });
        arrIspbs.push({ ispb: 44189447, banco: 'Banco de LA PROVINCIA de BUENOS AIRES' });
        arrIspbs.push({ ispb: 51938876, banco: 'Banco de LA REPUBLICA ORIENTAL DEL URUGUAY' });
        arrIspbs.push({ ispb: 60498557, banco: 'Banco de TOKYO MITSUBISHI UFJ Brasil' });
        arrIspbs.push({ ispb: 61199881, banco: 'Banco DIBENS' });
        arrIspbs.push({ ispb: 0, banco: 'Banco do BRASIL' });
        arrIspbs.push({ ispb: 13009717, banco: 'Banco do ESTADO de SERGIPE' });
        arrIspbs.push({ ispb: 4913711, banco: 'Banco do ESTADO do PARA' });
        arrIspbs.push({ ispb: 92702067, banco: 'Banco do ESTADO do RIO GRANDE do SUL (BANRISUL)' });
        arrIspbs.push({ ispb: 7237373, banco: 'Banco do NORDESTE do Brasil' });
        arrIspbs.push({ ispb: 33644196, banco: 'Banco FATOR' });
        arrIspbs.push({ ispb: 58616418, banco: 'Banco FIBRA' });
        arrIspbs.push({ ispb: 61348538, banco: 'Banco FICSA' });
        arrIspbs.push({ ispb: 10664513, banco: 'Banco GERADOR' });
        arrIspbs.push({ ispb: 31880826, banco: 'Banco GUANABARA' });
        arrIspbs.push({ ispb: 31895683, banco: 'Banco INDUSTRIAL do Brasil' });
        arrIspbs.push({ ispb: 7450604, banco: 'Banco INDUSTRIAL e COMERCIAL' });
        arrIspbs.push({ ispb: 61024352, banco: 'Banco INDUSVAL' });
        arrIspbs.push({ ispb: 58497702, banco: 'Banco INTERCAP' });
        arrIspbs.push({ ispb: 416968, banco: 'Banco INTERMEDIUM' });
        arrIspbs.push({ ispb: 61182408, banco: 'Banco INVESTCRED UNIBANCO' });
        arrIspbs.push({ ispb: 17298092, banco: 'Banco ITAU BBA' });
        arrIspbs.push({ ispb: 60872504, banco: 'Banco ITAÚ HOLDING FINANCEIRA' });
        arrIspbs.push({ ispb: 3017677, banco: 'Banco J. SAFRA' });
        arrIspbs.push({ ispb: 33172537, banco: 'Banco J.P. MORGAN' });
        arrIspbs.push({ ispb: 91884981, banco: 'Banco JOHN DEERE' });
        arrIspbs.push({ ispb: 7656500, banco: 'Banco KDB do Brasil' });
        arrIspbs.push({ ispb: 2318507, banco: 'Banco KEB do Brasil' });
        arrIspbs.push({ ispb: 59118133, banco: 'Banco LUSO BRASILEIRO' });
        arrIspbs.push({ ispb: 33923798, banco: 'Banco MÁXIMA' });
        arrIspbs.push({ ispb: 17184037, banco: 'Banco MERCANTIL do BRASIL' });
        arrIspbs.push({ ispb: 61088183, banco: 'Banco MIZUHO do Brasil' });
        arrIspbs.push({ ispb: 30723886, banco: 'Banco MODAL' });
        arrIspbs.push({ ispb: 2801938, banco: 'Banco MORGAN STANLEY DEAN WITTER' });
        arrIspbs.push({ ispb: 92894922, banco: 'Banco ORIGINAL' });
        arrIspbs.push({ ispb: 9516419, banco: 'Banco ORIGINAL do Agronegócio' });
        arrIspbs.push({ ispb: 59285411, banco: 'Banco PANAMERICANO' });
        arrIspbs.push({ ispb: 61820817, banco: 'Banco PAULISTA' });
        arrIspbs.push({ ispb: 60850229, banco: 'Banco PECUNIA' });
        arrIspbs.push({ ispb: 11758741, banco: 'Banco PETRA' });
        arrIspbs.push({ ispb: 62144175, banco: 'Banco PINE' });
        arrIspbs.push({ ispb: 253448, banco: 'Banco POTTENCIAL' });
        arrIspbs.push({ ispb: 1023570, banco: 'Banco RABOBANK INTERNATIONAL Brasil' });
        arrIspbs.push({ ispb: 11476673, banco: 'Banco RANDON' });
        arrIspbs.push({ ispb: 68900810, banco: 'Banco RENDIMENTO' });
        arrIspbs.push({ ispb: 517645, banco: 'Banco RIBEIRAO PRETO' });
        arrIspbs.push({ ispb: 33603457, banco: 'Banco RODOBENS' });
        arrIspbs.push({ ispb: 58160789, banco: 'Banco SAFRA' });
        arrIspbs.push({ ispb: 90400888, banco: 'Banco SANTANDER (Brasil)' });
        arrIspbs.push({ ispb: 795423, banco: 'Banco SEMEAR' });
        arrIspbs.push({ ispb: 61533584, banco: 'Banco SOCIETE GENERALE Brasil' });
        arrIspbs.push({ ispb: 60889128, banco: 'Banco SOFISA' });
        arrIspbs.push({ ispb: 60518222, banco: 'Banco SUMITOMO MITSUI Brasileiro' });
        arrIspbs.push({ ispb: 7679404, banco: 'Banco TOPAZIO' });
        arrIspbs.push({ ispb: 17351180, banco: 'Banco TRIÂNGULO' });
        arrIspbs.push({ ispb: 59588111, banco: 'Banco VOTORANTIM' });
        arrIspbs.push({ ispb: 78626983, banco: 'Banco VR' });
        arrIspbs.push({ ispb: 13720915, banco: 'Banco WESTERN UNION do Brasil' });
        arrIspbs.push({ ispb: 15357060, banco: 'Banco WOORI BANK do Brasil' });
        arrIspbs.push({ ispb: 28127603, banco: 'BANESTES (Banco do ESTADO do ESPIRITO SANTO)' });
        arrIspbs.push({ ispb: 33884941, banco: 'BANIF – Banco INTERNACIONAL do FUNCHAL (Brasil)' });
        arrIspbs.push({ ispb: 62073200, banco: 'BANK OF AMERICA MERRILL LYNCH Banco Múltiplo' });
        arrIspbs.push({ ispb: 50585090, banco: 'BCV – Banco de Crédito e Varejo' });
        arrIspbs.push({ ispb: 34111187, banco: 'BES Investimento do Brasil – Banco de Investimento' });
        arrIspbs.push({ ispb: 57839805, banco: 'BM TRICURY' });
        arrIspbs.push({ ispb: 42272526, banco: 'BNY MELLON' });
        arrIspbs.push({ ispb: 61033106, banco: 'BPN Brasil Banco Múltiplo' });
        arrIspbs.push({ ispb: 33147315, banco: 'BRADESCO BERJ' });
        arrIspbs.push({ ispb: 45246410, banco: 'BRASIL PLURAL Banco Múltiplo' });
        arrIspbs.push({ ispb: 208, banco: 'BRB – Banco de Brasília' });
        arrIspbs.push({ ispb: 12865507, banco: 'BRICKELL Crédito, Financiamento e Investimento' });
        arrIspbs.push({ ispb: 360305, banco: 'CAIXA ECONOMICA FEDERAL' });
        arrIspbs.push({ ispb: 81723108, banco: 'CC CREDICOAMO Crédito Rural Cooperativa' });
        arrIspbs.push({ ispb: 4243780, banco: 'CC UNICRED Brasil Central' });
        arrIspbs.push({ ispb: 315557, banco: 'CC UNICRED do Brasil' });
        arrIspbs.push({ ispb: 2398976, banco: 'CC UNIPRIME NORTE do PARANA' });
        arrIspbs.push({ ispb: 5790149, banco: 'CECOOPES – Central das Cooperativas de Economia e Crédito Mútuo' });
        arrIspbs.push({ ispb: 33042953, banco: 'CITIBANK N.A.' });
        arrIspbs.push({ ispb: 73085573, banco: 'Cooperativa Central de Crédito do Estado de SP' });
        arrIspbs.push({ ispb: 4632856, banco: 'Cooperativa Central de Crédito NOROESTE Brasileiro' });
        arrIspbs.push({ ispb: 5463212, banco: 'Cooperativa Central de Crédito Urbano – CECRED' });
        arrIspbs.push({ ispb: 62109566, banco: 'Cooperativa de Crédito Rural da Região da Mogiana' });
        arrIspbs.push({ ispb: 78157146, banco: 'CREDIALIANCA Cooperativa de Crédito RURAL' });
        arrIspbs.push({ ispb: 62331228, banco: 'DEUTSCHE BANK – Banco ALEMÃO' });
        arrIspbs.push({ ispb: 3012230, banco: 'HIPERCARD Banco Múltiplo' });
        arrIspbs.push({ ispb: 1701201, banco: 'HSBC BANK Brasil – Banco Múltiplo' });
        arrIspbs.push({ ispb: 17453575, banco: 'ICBC do Brasil Banco Múltiplo' });
        arrIspbs.push({ ispb: 49336860, banco: 'ING BANK N.V.' });
        arrIspbs.push({ ispb: 60701190, banco: 'ITAÚ UNIBANCO' });
        arrIspbs.push({ ispb: 74828799, banco: 'NOVO Banco CONTINENTAL' });
        arrIspbs.push({ ispb: 14388334, banco: 'PARANA Banco' });
        arrIspbs.push({ ispb: 29030467, banco: 'SCOTIABANK Brasil Banco Múltiplo' });
        arrIspbs.push({ ispb: 1634601, banco: 'UNICRED Central RS – Central de Cooperativa de Economia e Crédito Mútuo do Estado do RS' });
        arrIspbs.push({ ispb: 543968, banco: 'UNICRED Central Santa Catarina' });
        arrIspbs.push({ ispb: 3046391, banco: 'UNIPRIME Central – Central Interestadual de Cooperativa de Crédito' });
        arrIspbs.push({ ispb: 18236120, banco: 'NU PAGAMENTOS S.A.' });
        arrIspbs.push({ ispb: 22896431, banco: 'PICPAY SERVICOS S.A.' });
        arrIspbs.push({ ispb: 31872495, banco: 'BCO C6 S.A.' });
        let resultado;
        for (var i = 0; i < arrIspbs.length; i++) {
            if (arrIspbs[i].ispb == isbp) {
                resultado = arrIspbs[i].banco;
                break;
            }
        }
        if (!resultado) {
            resultado = '-';
        }
        return resultado;
    }
}
exports.default = new Helper();

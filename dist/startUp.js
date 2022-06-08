"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
/* nova versao */
const ctrClientes_1 = require("./controller/v2/ctrClientes");
const ctrContas_1 = require("./controller/v2/ctrContas");
const ctrTef_1 = require("./controller/v2/ctrTef");
const ctrDepositoConta_1 = require("./controller/v2/ctrDepositoConta");
const ctrGenerateToken_1 = require("./controller/v2/ctrGenerateToken");
const ctrWebhookAarin_1 = require("./controller/v2/ctrWebhookAarin");
const ctrWebhookIugu_1 = require("./controller/v2/ctrWebhookIugu");
const ctrTransacoesAarin_1 = require("./controller/v2/ctrTransacoesAarin");
const ctrTransacoesIugu_1 = require("./controller/v2/ctrTransacoesIugu");
const ctrUsuario_1 = require("./controller/v2/ctrUsuario");
const ctrWebScrap_1 = require("./controller/v2/ctrWebScrap");
const ctrParceiros_1 = require("./controller/v2/ctrParceiros");
const ctrClubeWhisky_1 = require("./controller/v2/ctrClubeWhisky");
const ctrServicos_1 = require("./controller/v2/ctrServicos");
/* NOUS */
const ctrNOUS_1 = require("./controller/v2/ctrNOUS");
class StartUp {
    //private _db: Db;
    //private bodyParser;
    constructor() {
        this.app = express();
        this.middler();
        this.routes();
    }
    middler() {
        const cors = require('cors');
        /*const getIP = require('ipware')().get_ip;
        this.app.use(function(req, res, next) {
            var ipInfo = getIP(req);
            console.log(ipInfo.clientIp);
            console.log(req.header);
            next();
        });*/
        this.app.use(cors());
        this.app.use(bodyParser({ limit: '10mb' }));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true })); //Permite trabalhar com QueryString
    }
    routes() {
        //Para o verbo GET
        this.app.route("/").get((req, res) => {
            res.send({
                versao: "0.0.1"
            });
        });
        // ROTAS.
        /*
        function verificaToken(req, res, next){
            const token = req.headers['client_id'];
            if (!token) return res.status(401).json({ auth: false, message: 'Sem acesso.' });
            require("dotenv-safe").config();
            const jwt = require('jsonwebtoken');
            console.log(process.env.SECRET);
            //console.log(token);
            jwt.verify(token, process.env.SECRET, function(err, decoded) {
                if (err){
                    return res.status(500).json({ auth: false, message: 'Falha na autenticação.'+err });
                }else{
                    // se tudo estiver ok, salva no request para uso posterior
                    req.userId = decoded.id;
                }
                next();
            });
        }
*/
        // NOUS
        this.app.route("/nous/v2/listarnos").get(ctrNOUS_1.default.getByNoPai);
        this.app.route("/nous/v2/obterdadosno/:cod_no").get(ctrNOUS_1.default.getDadosNo);
        //Serviços
        this.app.route("/servicos/v2/recuperasmagenssite").get(ctrServicos_1.default.getImagensSite);
        // CONTAS BANCÁRIAS
        /*
        this.app.get('/contas/v2/clientest/:document', verificaToken, (req, res, next) => {
            //console.log("Retornou todos clientes!");
            Clientes.getById;
            res.status(201).json([{id:1,nome:'luiz'}]);
        })
        */
        this.app.route("/contas/v2/clientes/:document").get(ctrClientes_1.default.getById);
        this.app.route("/contas/v2/clientes").get(ctrClientes_1.default.get);
        this.app.route("/contas/v2/clientes").post(ctrClientes_1.default.post);
        this.app.route("/contas/v2/clientes/:document").put(ctrClientes_1.default.put);
        this.app.route("/contas/v2/validarsocio").post(ctrClientes_1.default.validaSocio);
        this.app.route("/contas/v2/saldo/:conta").get(ctrContas_1.default.getSaldo);
        this.app.route("/contas/v2/extrato").post(ctrContas_1.default.getExtrato);
        this.app.route("/contas/v2/extratoapp").post(ctrContas_1.default.getExtratoApp);
        this.app.route("/contas/v2/listarbancosativos").get(ctrContas_1.default.getlistarBancosAtivos);
        // USUÁRIOS
        this.app.route("/contas/v2/usuarios").get(ctrUsuario_1.default.getById);
        this.app.route("/contas/v2/verificarusuario").get(ctrUsuario_1.default.usuarioExiste);
        this.app.route("/contas/v2/loginusuario").post(ctrUsuario_1.default.loginusuario);
        this.app.route("/contas/v2/recuperarsenha/:documento").get(ctrUsuario_1.default.recuperaSenha);
        this.app.route("/contas/v2/validarcodigorecuperasenha").get(ctrUsuario_1.default.validarCodigo);
        this.app.route("/contas/v2/atualizarsenha").put(ctrUsuario_1.default.atualizarSenha);
        this.app.route("/contas/v2/atualizarsenhasemcodigo").put(ctrUsuario_1.default.atualizarSenhaSemCod);
        this.app.route("/acesso/v2/generatetoken").post(ctrGenerateToken_1.default.geraToken);
        this.app.route("/transacao/v2/tef").post(ctrTef_1.default.post);
        this.app.route("/transacao/v2/validarcliente").post(ctrTef_1.default.getDadosCliente);
        this.app.route("/transacao/v2/depositoconta").post(ctrDepositoConta_1.default.post);
        /* TRANSAÇÕES SAINDO PELA AARIN */
        this.app.route("/transacao/v2/pixcobranca").post(ctrTransacoesAarin_1.default.criarPixCobranca);
        this.app.route("/transacao/v2/listarpixcobranca").post(ctrTransacoesAarin_1.default.listarPixCobranca);
        this.app.route("/transacao/v2/listarpixdestino").post(ctrTransacoesAarin_1.default.listarPixDestino);
        this.app.route("/transacao/v2/pixdestino").post(ctrTransacoesAarin_1.default.criarPixDestino);
        this.app.route("/transacao/v2/pixdestinoconta").post(ctrTransacoesAarin_1.default.criarPixDestinoConta);
        this.app.route("/transacao/v2/confirmapixdestino/:pixid").put(ctrTransacoesAarin_1.default.confirmarPixDestino);
        /* TRANSACÇÕES SAINDO PELA IUGU */
        this.app.route("/transacao/v2/gerabBoletoiugu").post(ctrTransacoesIugu_1.default.geraBoletoIugu);
        this.app.route("/transacao/v2/listaboletosgerados").post(ctrTransacoesIugu_1.default.listarBoletosGeradosIugu);
        /* REGRAS E DADOS DOS PARCEIROS COMERCIAIS */
        // CONVITES
        this.app.route("/parceiros/v2/listaconvites").get(ctrParceiros_1.default.getListaConvites);
        this.app.route("/parceiros/v2/efetuarcompraconvite").post(ctrParceiros_1.default.criarCompraConvite);
        this.app.route("/parceiros/v2/listaconvitescomprados").post(ctrParceiros_1.default.getListaConvitesComprados);
        this.app.route("/parceiros/v2/gravausoticket").post(ctrParceiros_1.default.gravaUsoTicket);
        this.app.route("/parceiros/v2/listaticketsusados").post(ctrParceiros_1.default.getExtratoTicketsUsados);
        this.app.route("/parceiros/v2/validarticket").post(ctrParceiros_1.default.getValidarTicket);
        // CLUBE DO WHISKY
        this.app.route("/parceiros/v2/pagamentoCartaoClubeWhisky").post(ctrClubeWhisky_1.default.pagamentoCartaoClubeWhisky);
        this.app.route("/parceiros/v2/obterdadosbancariosclubewhisky/:codcartao").get(ctrClubeWhisky_1.default.obterDadosBancariosConta);
        /* RTORNO WEBHOOK DA AARIN */
        this.app.route("/webhook/v2/aarincashout").post(ctrWebhookAarin_1.default.cashout);
        this.app.route("/webhook/v2/aarinpix").post(ctrWebhookAarin_1.default.pix);
        this.app.route("/webhook/v2/aarindevolucao").post(ctrWebhookAarin_1.default.devolucao);
        this.app.route("/webhook/v2/aarinboleto").post(ctrWebhookAarin_1.default.boleto);
        this.app.route("/webhook/v2/aarinpixlote").post(ctrWebhookAarin_1.default.pixLote);
        /* RTORNO WEBHOOK DA IUGU */
        this.app.route("/webhook/v2/boletoiugu").post(ctrWebhookIugu_1.default.pagboleto);
        /* OUTROS MICRO-SERVIÇOS */
        this.app.route("/funcoes/v2/wsc_boleto/:cpf").post(ctrWebScrap_1.default.obterScrapUrl);
    }
}
exports.default = new StartUp();

import { validarInformacoes} from "../../models/funcoes";

    async function recuperaImagensSite(req, res) {
        const urlSitePiraque = 'https://www.piraque.org.br/site/';
        let imagensSite = [];
        var axios = require('axios');
        var cheerio = require('cheerio');

        try {
            const { data: dom } = await axios(urlSitePiraque);
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
        } catch (e) {
            res.status(400).send({
                status: false,
                resultado: imagensSite,
                mensagem: "Não foi possível recuperar as imagens do site."
            });
        }
    }
    
class ctrServicos{

    getImagensSite(req, res){
      let obj = req.body;
      let arrExcessao  = [];
      validarInformacoes(res, req, arrExcessao)
      .then(msg=>{
          if(msg.retorno=='OK'){
            recuperaImagensSite(req, res);
          }
      })
      .catch(erro=>{
          res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
      })
  }

}

export default new ctrServicos()

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ctrWebhookIugu {
    pagboleto(req, res) {
        let obj = req.body;
        //console.log(obj);
        res.status(200).send({ retorno: obj, status: true });
    }
}
exports.default = new ctrWebhookIugu();

import API from '../API.js';
class Q {
    constructor(id, name, authId, authN, compilazioni) {
        this.id = id;
        this.name = name;
        this.authId = authId;
        this.authName = authN;
        this.ncompil = compilazioni;
        this.domande=[];
    }
    async setQ(){
        const ds =await API.fetchDsbyQ(this.id);
        this.domande=ds;
        this.domande.forEach(async(x)=>{
            if(x.close)
                x.possibilirisp=await API.fetchMultipleRbyD(x.id);});
    }
}
class D {
    constructor(id, text, qId, c, min, max, ordine) {
        this.id=id;
        this.text = text;
        this.qId = qId;
        this.close = c;
        this.min = min;
        this.max = max;
        this.possibilirisp=[];
        this.ordine=ordine;
    }
}
class R {
    constructor(id,text,qId,dId,user) {
        this.id=id;
        this.text = text;
        this.qId=qId;
        this.dId = dId;
        this.user=user;
    }
}
export {Q,D,R};
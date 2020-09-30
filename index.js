module.exports = {
    HasteFS: class HasteFS {
        constructor(options){
            this.options = options;
            this.fetch = require("node-fetch");
        }
        async load(){
            if(this.options.base){
                let response = await this.fetch(this.options.host+"/raw/"+this.options.base, {method: 'GET'});
                if(response.status != 200)throw new Error("Troubles in loading your paste.");
                this.data = await response.text();
                this.key = this.options.base;
            }else{this.data="";this.key = null;}
        }
        async run(){
            await this.load();
            if(this.options.saveinterval)this.saver = setInterval(this.basesave, this.options.saveinterval, this.options, this.data, this);
        }
        async save(caller = this){
            this.key = await this.basesave(this.options, this.data, this);
            return this.key;
        }
        async basesave(options, data, caller){
            let response = await caller.fetch(options.host+"/documents", {method: "POST", body: data});
            if(response.status!=200)throw new Error("Troubles in saving paste. Server response: "+await response.text());
            caller.key = (await response.json())["key"];
            return caller.key;
        }
    }
}
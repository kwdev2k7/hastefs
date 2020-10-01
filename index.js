module.exports = {
    HasteFS: class HasteFS {
        constructor(options){
            this.options = options;
            this.fetch = require("node-fetch");
            this._ = require("lodash/object");
        }
        async load(){
            if(this.options.base){
                let response = await this.fetch(this.options.host+"/raw/"+this.options.base, {method: 'GET'});
                if(response.status != 200)throw new Error("Troubles in loading your paste.");
                this.data = JSON.parse(await response.text());
                this.key = this.options.base;
            }else{this.data={};this.key = null;}
        }
        async run(){
            await this.load();
            if(this.options.saveinterval)this.saver = setInterval(this.basesave, this.options.saveinterval, this.options, this.data, this);
        }
        async save(caller = this){
            this.key = await this.basesave(this.options, this.data, this);
            return this.key;
        }
        textify(data){
        	return JSON.stringify(data);
        }
        async basesave(options, data, caller){
            let response = await caller.fetch(options.host+"/documents", {method: "POST", body: this.textify(data)});
            if(response.status!=200)throw new Error("Troubles in saving paste. Server response: "+await response.text());
            caller.key = (await response.json())["key"];
            return caller.key;
        }
        resolvePath(caller, data, path){
        	if(path.endsWith("/"))path=path.slice(0,-1);
        	return path=="/"?data:(caller._.get(data,path.slice(1).split("/").filter(el=>el))?caller._.get(data,path.slice(1).split("/").filter(el=>el)):null);
        }
        exists(path){
        	return (this.resolvePath(this, this.data, path)?true:false);
        }
        mkdir(path){
        	if(this.exists(path))return false;
        	this._.set(this.data,path.slice(1).split("/").filter(el=>el),{});
        	return true;
        }
        cat(path){
        	if(path=="/")return null;
        	if(!this.exists(path))return false;
        	if(typeof(this.resolvePath(this, this.data, path)) == "object")return null;
        	return this.resolvePath(this, this.data, path);
        }
        write(path, data){
        	if(path=="/")return null;
        	if(this.resolvePath(this, this.data, path) != null && typeof(this.resolvePath(this, this.data, path))=="object")return null;
        	this._.set(this.data, path.slice(1).split("/").filter(el=>el), data);
        	return true;
        }
        remove(path){
        	if(path=="/")return null;
        	if(this.resolvePath(this,this.data,path) == null)return false;
        	this._.unset(this.data, path.slice(1).split("/").filter(el=>el));
        	return true;
        }
        listdir(path){
        	if(path=="/")return Object.keys(this.data);
        	if(this.resolvePath(this,this.data,path) == null)return false;
        	if(typeof(this.resolvePath(this,this.data,path)) != "object")return false;
        	return this.resolvePath(this,this.data,path);
        }
    }
}

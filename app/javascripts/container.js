class Container {
    constructor() {
        // Boxs
        this.boxs=[];
    }
    insertBox(box){
        //insert Box into this.boxs at last index   
        this.boxs.push(box); 
    }
    toCode(){
        var html="";
        for(var i=0;i<this.boxs.length;i++){
            html+=`
                <div style="
                width:${this.boxs.w};
                height:${this.boxs.h};
                border:1px solid black;
                ">
                </div>
            `;
        }
        return html;
   }
}
module.exports = Container;
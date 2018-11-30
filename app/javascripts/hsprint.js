class Box {
  constructor(id, x , y, level) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.level = level;
        this.w = 100;
        this.h = 50;
    }
}
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
            <div 
                id="${this.boxs[i].id}"
              
                onmousedown="cont_wrapper.setStatus(1,'${this.boxs[i].id}')"

                style="
                width:${this.boxs[i].w};
                height:${this.boxs[i].h};
                margin:5px;
                border:1px solid black;
            ">
            </div>
        `;
      }
      return `<div
        style="display:inline-block;"
      >${html}</div>`;
    }
}
class Wrapper {
    constructor(){
        this.containers=[];
        // select one == 1 // not select == 0 
        this.status={
            isSelect:0,
            id:""
        };
        this.devOption={
            mouseXY:0,
            mouseGrid:0
        }
        this.offsetTop=0;
        this.offsetLeft=0;
    }
    setStatus(s,i){
        

        if(s == 0 ){

            console.log("[Wrapper] setStatus select cancled ");
            this.status.isSelect=s;
            this.status.id=i;
        }else if(s == 1){
            this.status.isSelect=s;
            this.status.id=i;
            console.log("[Wrapper] setStatus id : "+i);
            document.getElementById(this.status.id).style.position="absolute";
        }
    }
    prepositioningBox(){
        var gridY=Math.round((event.pageY-this.offsetTop)/57);
        var gridX=Math.floor((event.pageX-this.offsetLeft)/107);
        

    }
    insertContanier(container){
        container.onmousedown=(id)=>{
            this.status.isSelect=1;
            this.status.id=id;
        }
        this.containers.push(container);
    }
    output(){
        var html="";
        for(var i=0;i<this.containers.length;i++){
            html+=this.containers[i].toCode();  
        }
        html=`<div 
            style="display:inline-block;"
            id="hsprint"
            onmouseup="cont_wrapper.setStatus(0,'')"
        >${html}</div>`;
        if( document.body.innerHTML != html ){
            document.body.innerHTML = html;
        }
    }
    start(){
        this.output();

        this.offsetTop=document.getElementById("hsprint").offsetTop;
        this.offsetLeft=document.getElementById("hsprint").offsetLeft;

        document.getElementById("hsprint").onmousemove=(event)=>{
            if( this.devOption.mouseXY ){
                var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
                var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
                console.log( "( event.pageX, event.pageY ) : " + pageCoords );
                console.log( "( event.clientX, event.clientY ) : " + clientCoords );
            }
            if( this.devOption.mouseGrid ){
                var gridY=Math.round((event.pageY-this.offsetTop)/57);
                console.log("[DevOption MouseGrid] Y grid = "+gridY);
                var gridX=Math.floor((event.pageX-this.offsetLeft)/107);
                console.log("[DevOption MouseGrid] X grid = "+gridX);
            }
            if( this.status.isSelect ){
                // document.getElementById(this.status.id).style.left=event.pageX-10;
                document.getElementById(this.status.id).style.top=event.pageY-30;         
            }
        }
    }
}

const cont_wrapper=new Wrapper();

const init = ()=>{
    

    const cont=new Container();
    cont.insertBox(new Box("sdf1",0,0,0));
    cont.insertBox(new Box("sdf2",0,0,0));
    cont.insertBox(new Box("sdf3",0,0,0));
    cont_wrapper.insertContanier(cont);

    const cont2=new Container();
    cont2.insertBox(new Box("qwe1",0,0,0));
    cont2.insertBox(new Box("qwe2",0,0,0));
    cont2.insertBox(new Box("qwe3",0,0,0));
    cont_wrapper.insertContanier(cont2);
    
    cont_wrapper.start();
};

window.onload=init;
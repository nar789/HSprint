//mouse x y position
var x,y;
//selected box
var item=null;

//create div box
//박스 생성시 id 중복 불가
function add_box(id){
  $("body").append("<div id="+id+" class=item></div>")
  append_event("#"+id);
}

//append event to target
function append_event(id){
  $(id).mousedown((e)=>{
    item=$(id);
  });
  $(id).mouseup((e)=>{
    item=null;
  });
}

window.onload=()=>{
  $(window).mousemove((e)=>{
    x=e.pageX;
    y=e.pageY;
    // console.log(x+":"+y);

    //mouse position checking
    if(item != null){
      item.css("top",y);
      item.css("left",x);
    }
  });
}

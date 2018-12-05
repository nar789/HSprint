class LightTower{
  constructor(d=4){
    this.ListOfWorkBox=[]
    this.divided=d
    this.default_x=0;
    this.default_y=120;
    this.default_h=120;
    this.default_level=0;
    this.selected_item=null;
    this.selected_item_id=null;
    this.selected_item_wb=null;
    this.mouse_x=0;
    this.mouse_y=0;
    this.mouse_offset_x=0;
    this.mouse_offset_y=0;
  }
  select(id){
    console.log("SELECT EVENT: current id > "+id);
    this.selected_item=$(id);
    this.selected_item_id=id;
    this.selected_item_wb=this.find_workbox_by_id(this.selected_item_id);
    this.selected_item_wb.last_click=new Date().getTime();

    //set mouse offset
    this.mouse_offset_x=this.mouse_x-this.selected_item_wb.x;
    this.mouse_offset_y=this.mouse_y-this.selected_item_wb.y;
  }
  // removePX => "4px" => 4
  removePX(str){
    if(str){
      return str.split("px")[0];
    }
    return 0;
  }
  //모든 객체에 대해 같은 마우스 업 이벤트 적용 고려
  select_finish(){
    if(this.selected_item==null){
      return 0;
    }
    console.log("UNSELECT EVENT");
    // 마우스를 땟을때 해당위치를 찾아감
    // 소수점을 버림으로서
    var fixed_x=Math.floor((this.mouse_x/this.w_size)) * this.w_size;
    $("#"+this.selected_item_id).css("left",fixed_x);

    // 오른쪽에서 왼쪽으로 이동시 올바른 작업인지 아닌지 분기
    // 워크박스의 작업 레벨이 이동할 레벨보다 작아진 경우 이동 취소 => 원래자리로 이동
    if(this.selected_item_wb.work_level > ( this.removePX($("#"+this.selected_item_id).css("left"))/this.w_size)){
      $("#"+this.selected_item_id).css("left",this.selected_item_wb.x+"px");
      $("#"+this.selected_item_id).css("top",this.selected_item_wb.y+"px");

      // 원래자리로 이동하면서 경고도 없앰
      $("#"+this.selected_item_id+"warn").css("display","none");

      this.selected_item=null;
      this.selected_item_id=null;
      this.selected_item_wb=null;
    }
    //올바른 이동
    else{
      //이동한 위치 저장하기
      this.selected_item_wb.x=$("#"+this.selected_item_id).css("left");
      // remove "px"
      this.selected_item_wb.x=1*this.removePX(this.selected_item_wb.x);

      this.selected_item_wb.y=$("#"+this.selected_item_id).css("top");
      // remove "px"
      this.selected_item_wb.y=1*this.removePX(this.selected_item_wb.y);
      // 현재의 레벨 저장
      this.selected_item_wb.work_level=Math.floor(this.selected_item_wb.x/this.w_size);

      //다른 박스와의 충돌
      if(this.crashWith(this.selected_item_id)){
        this.level_pushdown(this.selected_item_wb.work_level,this.selected_item_wb.h,[this.selected_item_wb]);
      }
    }
    this.selected_item=null;
    this.selected_item_id=null;
  }
  find_workbox_by_id(id){
    for(var i=0;i<this.ListOfWorkBox.length;i++){
      if(this.ListOfWorkBox[i].id==id){
        return this.ListOfWorkBox[i];
      }
    }
    return -1;
  }
  append(wb){
    //wb== workbox
    this.ListOfWorkBox.push(wb)
  }
  newBox(id){
    this.ListOfWorkBox.push(new WorkBox(id=id,this.default_x,this.default_y,this.w_size,this.default_h,this.default_level));
    if(this.crashWith(id)){
      var wb=this.find_workbox_by_id(id);
      this.level_pushdown(wb.level,wb.h,[wb]);
    }
  }
  newBoxTestY(id,y){
    this.ListOfWorkBox.push(new WorkBox(id=id,this.default_x,y,this.w_size,this.default_h,this.default_level))
  }
  level_pushdown(level,height=0,except=null){
    var move_offset=this.default_h;
    for(var i=0;i<this.ListOfWorkBox.length;i++){
      if(this.ListOfWorkBox[i].work_level==level && this.ListOfWorkBox[i].y>height){
        // todo
        // 만약 상자마다 높이가 다르다면 여기서 move_offset을 밑으로 내려갈때마다 증가시켜줘야함

        //except 처리
        if(except && !except.indexOf(this.ListOfWorkBox[i])){
          continue;
        }
        // height 위치 이하의 모든상자를 move_offset 만큼 이동
        this.ListOfWorkBox[i].y+=move_offset;
        let id=this.ListOfWorkBox[i].id;
        $("#"+id).css("top",this.ListOfWorkBox[i].y);
      }
    }
  }
  //
  getSystemVar(parent_w,parent_h){
    this.parent_w=parent_w
    this.parent_h=parent_h
    this.w_size=parent_w/this.divided
  }
  // appendEvent(id){
  //   id="#"+id
  //   $(id).mousedown((e)=>{
  //     this.selected_item=$(id);
  //   });
  //   $(id).mouseup((e)=>{
  //     this.selected_item=null;
  //   });
  // }
  background_draw(){
    let color=["#87CEEB","#FFC107","#FF5722","#607D8B"];
    var pos_x=[];
    for(var i=0;i<this.divided;i++){
      pos_x.push(i*this.w_size);
    }
    var html="";
    for(var i=0;i<this.divided;i++){
      html+=`<div style='background-color:`+color[i]+`;width:`+this.w_size+`;height:100%;position:absolute;top:0px;left:`+pos_x[i]+`px'></div>`;
    }
    return html;
  }

  crashWith(id){
    var wb=this.find_workbox_by_id(id);
    for(var i=0;i<this.ListOfWorkBox.length;i++){
      //같은 아이디 패스
      if(this.ListOfWorkBox[i].id==id){
        continue;
      }
      //다른레벨 패스
      else if(this.ListOfWorkBox[i].work_level!=
        Math.floor(this.removePX($("#"+id).css("left"))/this.w_size)){
        continue;
      }
      // 같은레벨에서
      else{
        // 겹친다면
        let x=$("#"+id).css("left");
        let y=this.removePX($("#"+id).css("top"));
        let yh=1*y+1*wb.h;
        if(
          //위로 들어온 경우
          (this.ListOfWorkBox[i].y>=y && this.ListOfWorkBox[i].y<=1*y+1*wb.h)
          ||
          //밑으로 들어온 경우
          (y>=this.ListOfWorkBox[i].y && y<=this.ListOfWorkBox[i].y+this.ListOfWorkBox[i].h)){
            return true;
        }
        //겹치지 않는다면 패스
        else{}
      }
    }
    return false;
  }
  draw(){

    var html="";
    for(let n of this.ListOfWorkBox){
      let shadow="";
      let style=`style="`+shadow+` left:`+n.x+`px;top:`+n.y+`px;background-color:white;display:inline-block;width:`+this.w_size+`px;height:`+this.default_h+`px;position:absolute;"`;
      let mousedown=`onmousedown="lt.select('`+n.id+`')"`;
      let mouseup=`onmouseup="lt.select_finish()"`;
      let warning_box=`<div id="`+n.id+`warn" style="display:none;position:absolute;width:inherit;height:inherit;background-color:#E91E63;text-align:center;color:white;">그렇게 할수는 없습니다.</div>`;
      html+=`<div id="`+n.id+`" `+style+` `+mousedown+` `+mouseup+`>`+warning_box+n.id+`</div>`;
    }
    return this.background_draw()+html;
  }
  mouseEventListener(e){
    this.mouse_x=e.pageX;
    this.mouse_y=e.pageY;

    if(this.selected_item!=null){
      // todo
      // this.selected_item.css("top",this.mouse_y);
      // this.selected_item.css("left",this.mouse_x);
      // 워크박스 원하는 지점으로 이동
      $("#"+this.selected_item_id).css("top",this.mouse_y);
      $("#"+this.selected_item_id).css("left",this.mouse_x-this.mouse_offset_x);

      // 이동 가능한지 불가능한지 미리 체크
      // 해당 워크박스 객체
      if(this.selected_item_wb.work_level > ( this.removePX($("#"+this.selected_item_id).css("left"))/this.w_size)){
        $("#"+this.selected_item_id+"warn").css("display","block");
      }else{
        $("#"+this.selected_item_id+"warn").css("display","none");
      }

    }
  }
}

//class WorkBox
class WorkBox{
  constructor(id,x=0,y=0,w=10,h=10,level=0,color="#ffffff"){
    this.id=id
    this.x=x
    this.y=y
    this.w=w
    this.h=h
    this.work_level=level;
    this.last_click=new Date().getTime();
  }
  toString(){
    return "x="+this.x+",y="+this.y+",w="+this.w+",h="+this.h;
  }
}

var lt=new LightTower()

window.onload=()=>{
  //todo
  //this line move to on window change event
  lt.getSystemVar($(window).width(),$(window).height());
  //

  lt.newBoxTestY("a",120);
  lt.newBoxTestY("b",260);
  lt.newBoxTestY("c",390);
  lt.newBoxTestY("d",520);
  lt.newBoxTestY("e",650);
  lt.newBoxTestY("f",730);

  // app div를 lt클래스 내부로 넣어버리기

  document.getElementById("app").innerHTML=lt.draw();

  $(window).mousemove((e)=>{
    lt.mouseEventListener(e);
  });
}

//2021/8/30 3:11 
//下雪
var snowfall=10;//10ms生成一次雪
var is_mobile=navigator.userAgent.toLowerCase().match(/(phone|pad|ipod|iphone|android|mobile|MQQBrowser|JUC|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince|windows Phone)/i);
if(is_mobile){
    snowfall=1;   }//移动端下大雪
function snowing(){
    let motto=document.querySelector(".motto");
    let maxheight=motto.offsetHeight;
    setInterval(()=>{
        let snow=document.createElement('div');
        snow.style.position="absolute";
        let num=parseInt(Math.random()*8);
        if(num>5){
            snow.style.boxShadow="0 0 3px #fff,0 0 6px #fff";
        }
        snow.style.width=num+"px";
        snow.style.height=num+'px';
        snow.style.background="#fff";
        snow.style.borderRadius=num/2+"px";
        snow.style.left=Math.random()*1920+"px"; 
        snow.style.top="0px";
        motto.appendChild(snow);
        let xMove=Math.random()*10-2;
        let dance=setInterval(()=>{
            snow.style.left=parseInt(snow.style.left)+xMove+'px';
            snow.style.top=parseInt(snow.style.top)+5+"px";
            if(parseInt(snow.style.top)>=maxheight)
            {
                clearInterval(dance);
                snow.parentNode.removeChild(snow);
            }
        },80)
    },snowfall)
}
if(Math.random()>.8){//调整下雪几率
    snowing();
}
//屏幕小于800自动收起侧边栏
let menu_btn=document.querySelector('.menu-btn');
let nav=document.querySelector('.navigation');
let caroursel=document.querySelector('.caroursel');
window.onresize=function(){
    if(window.innerWidth<800)
    {
        menu_btn.classList.remove('closed');
        nav.classList.add('left_move');
    }
    else{
        menu_btn.classList.add('closed');
        nav.classList.remove('left_move');
    }
}
//图片懒加载
let viewH=document.documentElement.clientHeight;
    let pics=document.querySelectorAll('.update_pic');
    if(pics){
        let lazyload=function(){
    pics.forEach((item,index)=>{
        let img=item.querySelector('img');
        let rect=img.getBoundingClientRect();
        if(rect.bottom>=0&&rect.top<viewH){
            img.src=img.dataset.src;
        }
    });
}
lazyload();
    document.querySelector('.second-main').addEventListener('scroll',()=>{
        lazyload();
    })
}
$(function(){
    // $(".backTop").fadeOut();
    $(".left-menu").fadeOut();
    //点击关闭菜单栏
    let navflag=false;
    $(".menu-btn").click(function(){
        if($(".menu-btn").hasClass('closed')){
            $(".menu-btn").removeClass("closed");
            $(".navigation").addClass('left_move');
            navflag=true;
        }
        else{
            $(".menu-btn").addClass("closed");
            $(".navigation").removeClass('left_move');
            navflag=false;
        }
    });
    //移动端自动关闭菜单栏
    if(($(document).innerWidth())<420){
        if(!($(".navigation").hasClass("left_move"))){
            $(".navigation").addClass("left_move");
            $(".menu-btn").removeClass("closed");
            navflag=true;
        }
    }





    //滚动事件
   $(".second-main").scroll(function(){
       //滚动大于400，出现返回顶部和哈士奇 
    if($(this).scrollTop()>400){
        $(".left-menu").fadeIn();
        $(".backTop").fadeIn();
        $(".husky").fadeIn().animate({"right":"0px"},200);
    }
    // if($(".second-main").scrollTop()==0&&parseInt($(".husky").css("right"))==0){//回到顶部，哈士奇向右跑并复原
    //     $(".husky").animate({"right":"100px"},500,function(){
    //         $(this).css("right","-100px")
    //     });
    // }
   if($(".second-main").scrollTop()==0){//回到顶部，按钮消失
    $(".backTop").fadeOut(500,function(){
    })
    if($(".husky").css('right')=='0px'){
        console.log('true');
        $(".husky").animate({"right":"100px"},500,function(){
            $(this).css("right","-100px").fadeOut();
            $(".left-menu").fadeOut();
        });
    }
   }
$(".husky").click(function(){//点一下哈士奇，哈士奇消失
    $(".husky").fadeOut(); 
});
//    if(navflag==true&&$(".second-main").scrollTop()>100){
//        $(".menu-btn").fadeOut();
//    }
//    else{
//     $(".menu-btn").fadeIn();
//    }
});
$(".backTop").click(function(){//点返回顶部，1000内返回
    $(".second-main").animate({"scrollTop":0},1000)
});
});
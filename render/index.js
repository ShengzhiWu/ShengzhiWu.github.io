
const canvas = document.querySelector("#myCanvas");
var ctx = canvas.getContext("2d");

var x = 200, y = 200, r=100;
// var shadowDX = 5, shadowDY = 5;
// var shadowSmooth = 10;

function paint()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清空画布

    // ctx.fillStyle = "rgba(0,0,0,0.1)";
    // ctx.beginPath();
    // ctx.arc(x+shadowDX-shadowSmooth, y+shadowDY, r, 0, Math.PI * 2, true);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.arc(x+shadowDX+shadowSmooth, y+shadowDY, r, 0, Math.PI * 2, true);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.arc(x+shadowDX, y+shadowDY-shadowSmooth, r, 0, Math.PI * 2, true);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.arc(x+shadowDX, y+shadowDY+shadowSmooth, r, 0, Math.PI * 2, true);
    // ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
}

var movingDisk = false;
var mouseStartX, mouseStartY;  // 鼠标开始操作时的坐标
var valueStart1, valueStart2;  // 鼠标开始操作时相应属性的值

window.addEventListener("mousedown", function(event){  // 按下
    // console.log("mousedown");
    var dx = event.x-x;
    var dy = event.y-y;
    if(dx*dx+dy*dy<=r*r)
    {
        mouseStartX  = event.x;
        mouseStartY  = event.y;
        valueStart1 = x;
        valueStart2 = y;
        movingDisk = true;
    }
})

window.addEventListener("mouseup", function(event){  // 松开
    // console.log("mouseup")
    movingDisk = false;
})

window.addEventListener("mousemove", function(event){  // 移动
    // console.log("mousemove");
    if(movingDisk)
    {
        x = valueStart1+(event.x-mouseStartX);
        y = valueStart2+(event.y-mouseStartY);
        paint();
    }
})

window.addEventListener("keydown", function(event){  // 键盘
    // console.log(event.key)

    
});

window.addEventListener("keyup", function(event){  // 键盘
    // console.log(event.key)

});

window.addEventListener("resize", function(){  // 尺寸变更监听，用于使得画布占满整个页面
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paint();
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

paint();
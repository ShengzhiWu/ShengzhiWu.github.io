
const canvas = document.querySelector("#myCanvas");
var ctx = canvas.getContext("2d");

function paint()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清空画布

    ctx.fillStyle = "blue";
    ctx.fillRect(100, 100, 200, 200);
    ctx.beginPath();
    ctx.arc(150, 150, 50, 0, Math.PI * 2, true);
    ctx.stroke();
}

window.addEventListener("mousedown", function(event){  // 按下
    console.log("mousedown");
})

window.addEventListener("mouseup", function(event){  // 松开
    // console.log("mouseup")
    
})

window.addEventListener("mousemove", function(event){  // 移动
    mouseCurrentX = event.x;
    mouseCurrentY = event.y;
    // console.log("mousemove");
    
})

window.addEventListener("keydown", function(event){  // 键盘
    console.log(event.key)

    
});

window.addEventListener("keyup", function(event){  // 键盘
    console.log(event.key)

});

window.addEventListener("resize", function(){  // 尺寸变更监听，用于使得画布占满整个页面
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paint();
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

paint();
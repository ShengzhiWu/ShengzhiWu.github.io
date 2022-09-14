function fullFill(element)  // 设置元素尺寸，使得其和父元素尺寸相同
{
    const parent = element.parentNode;
    element.width = parent.offsetWidth;
    element.height = parent.offsetHeight;
}

const canvasResearches = document.querySelector("#canvasResearches");
fullFill(canvasResearches);
var ctxResearches = canvasResearches.getContext("2d");

var t = 0;

function paintCanvasResearches()
{

    ctxResearches.clearRect(0, 0, canvasResearches.width, canvasResearches.height);  // 清空画布
    // ctxResearches.translate(canvasResearches.width/2, canvasResearches.height/2-sizeF*0.1);
    var sizeF = canvasResearches.height*0.55;
    var canvasX = canvasResearches.width/2;
    var canvasY = canvasResearches.height/2-sizeF*0.1;
    nBodyData.forEach(orbit=>
        {
            ctxResearches.strokeStyle = "hsla(150, 100%, 30%, 40%)";
            ctxResearches.lineWidth = 3;
            ctxResearches.beginPath();
            ctxResearches.moveTo(orbit[orbit.length-1][0]*sizeF+canvasX, orbit[orbit.length-1][1]*sizeF+canvasY);
            orbit.forEach(p=>
                {
                    ctxResearches.lineTo(p[0]*sizeF+canvasX, p[1]*sizeF+canvasY);
                });
            ctxResearches.stroke();

            ctxResearches.fillStyle="hsla(150, 100%, 30%)";
            for(var i1=0;i1<nBodyN;i1++)
            {
                var t2 = (t+i1*orbit.length/nBodyN)%orbit.length;
                ctxResearches.beginPath();
                ctxResearches.arc(orbit[t2][0]*sizeF+canvasX, orbit[t2][1]*sizeF+canvasY, 5, 0, 2*Math.PI);
                ctxResearches.fill();
            }
        });
    // ctxResearches.restore();
}

setInterval(()=>
    {
        paintCanvasResearches();
        t += 2;
    }, 1000/30);

window.addEventListener("resize", function(){  // 尺寸变更监听，用于使得画布占满整个页面
    fullFill(canvasResearches);
    paintCanvasResearches();
});


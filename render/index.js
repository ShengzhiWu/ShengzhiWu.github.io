function fullFill(element)  // 设置元素尺寸，使得其和父元素尺寸相同
{
    const parent = element.parentNode;
    element.width = parent.offsetWidth;
    element.height = parent.offsetHeight;
}

const canvasResearches = document.querySelector("#canvasResearches");
fullFill(canvasResearches);
var ctxResearches = canvasResearches.getContext("2d");

function paintCanvasResearches()
{
    ctxResearches.clearRect(0, 0, canvasMain.width, canvasMain.height);  // 清空画布
    // ctxResearches.fillStyle = "cyan";
    // ctxResearches.fillRect(0, 0, 1000, 100);
}

paintCanvasResearches();

window.addEventListener("resize", function(){  // 尺寸变更监听，用于使得画布占满整个页面
    fullFill(canvasResearches);
    paintCanvasResearches();
});
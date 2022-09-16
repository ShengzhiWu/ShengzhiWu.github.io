bookrack = {};
bookrack.container = document.getElementById("bookrack-container");
bookrack.full = document.getElementById("full");

bookrack.setImageCentreLocation = function(element, x, y)  // 设置图像中心位置
{
    element.style.left = (x-element.width/2)+"px";
    element.style.top = (y-element.height/2)+"px";
}

bookrack.layer1AspectRatio = 2553/3451;  // 图片1高宽比
bookrack.layer2AspectRatio = 1612/1249;  // 图片2高宽比
bookrack.layer2SizeF = 3451/1249*838.7/*图片2洞对角线长*//1871.8/*图片1洞对角线长*/;  // 图片2相对于图片1的尺寸系数

bookrack.layerN = 5;  // 层数
bookrack.layers = [document.createElement('img')];
bookrack.distances = [1];
bookrack.layers[0].src = "assets/photographs/bookrack/layer-1.png";
bookrack.layers[0].title = "";
bookrack.layers[0].alt = "";
bookrack.layers[0].style["z-index"] = bookrack.layerN;
bookrack.layers[0].style.position = "absolute";

bookrack.dDistance = 1;  // 书架间距
for(var i1=1;i1<bookrack.layerN;i1++)
{
    var layer = document.createElement('img');
    layer.src = "assets/photographs/bookrack/layer-2.png";
    layer.title = "";
    layer.alt = "";
    bookrack.distances.push(bookrack.distances[i1-1]+bookrack.dDistance);
    layer.style["z-index"] = bookrack.layerN-i1;
    layer.style.position = "absolute";
    bookrack.layers.push(layer);
}
bookrack.layers.forEach(e=>{bookrack.container.appendChild(e);});  // 插入容器

bookrack.scrolling = function()  // 正在滚动
{
    const pageY = document.documentElement.scrollTop;  // 页面当前滚动到的位置
    const containerCentreY = bookrack.containerY+bookrack.containerHeight/2-pageY;  // 容器中心在页面中的显示坐标
    for(var i1=1;i1<bookrack.layerN;i1++)
    {
        bookrack.setImageCentreLocation(bookrack.layers[i1], bookrack.containerWidth/2, bookrack.containerHeight/2+(1-1/bookrack.distances[i1])*(bookrack.centreY-containerCentreY));
    }
}

bookrack.layout = function()  // 布局
{
    bookrack.width = bookrack.full.offsetWidth;  // 页面显示区域宽度
    bookrack.height = bookrack.full.offsetHeight;  // 页面显示区域高度
    bookrack.centreX = bookrack.width/2;
    bookrack.centreY = bookrack.height/2;

    bookrack.containerY = bookrack.container.offsetTop;
    bookrack.containerWidth = bookrack.container.offsetWidth;
    bookrack.containerHeight = bookrack.container.offsetHeight;

    if(bookrack.containerHeight/bookrack.containerWidth>bookrack.layer1AspectRatio)
    {
        bookrack.layers[0].height = bookrack.containerHeight;
        bookrack.layers[0].width = bookrack.layers[0].height/bookrack.layer1AspectRatio;
    }
    else
    {
        bookrack.layers[0].width = bookrack.containerWidth;
        bookrack.layers[0].height = bookrack.layers[0].width*bookrack.layer1AspectRatio;
    }

    bookrack.setImageCentreLocation(bookrack.layers[0], bookrack.containerWidth/2, bookrack.containerHeight/2);

    for(var i1=1;i1<bookrack.layerN;i1++)
    {
        bookrack.layers[i1].width = bookrack.layers[0].width/bookrack.layer2SizeF*bookrack.distances[0]/bookrack.distances[i1];
        bookrack.layers[i1].height = bookrack.layers[i1].width*bookrack.layer2AspectRatio;
        // bookrack.setImageCentreLocation(bookrack.layer, bookrack.containerWidth/2, bookrack.containerHeight/2);
    }
    bookrack.scrolling();
}

bookrack.layout();

window.addEventListener("resize", function(){  // 尺寸变更监听，用于使得画布占满整个页面
    bookrack.layout();
});
var ImagesResponsiveLayout = {};

function appear(element)
{
    var opacity = Number(element.style.opacity);
    if(opacity>=1)
        return;
    
    opacity += 0.03;
    if(opacity>=1.0)
    {
        element.style.opacity = 1;
    }
    else
    {
        element.style.opacity = opacity;
        setTimeout(()=>{appear(element);}, 1000/60);
    }
}

function config(container, width, children, finishedN, y0, heightMin, heightMax, gap)
{
    if(finishedN>=children.length)  // finished layout
        return;

    var w1 = 0;
    for(var i1=finishedN;i1<=children.length;i1++)
    {
        var imW, imH;
        if(i1==children.length)
        {
            imW = Infinity;
            imH = 1;
        }
        else{
            if(!children[i1].firstChild.complete)
            {
                setTimeout(()=>{config(container, width, children, finishedN, y0, heightMin, heightMax, gap);}, 30);
                return;
            }
            imW = children[i1].firstChild.naturalWidth;
            imH = children[i1].firstChild.naturalHeight;
        }

        var w2 = heightMin*imW/imH;
        var w3 = w1+w2+(i1==finishedN?0:gap);
        if(w3>width)
        {
            var n;  // number of images in the line
            if(i1==finishedN)
            {
                n = 1;
                w1 = w3;
            }
            else
            {
                n = i1-finishedN;
            }

            var h = Math.min(heightMax, heightMin*(width-(n-1)*gap)/(w1-(n-1)*gap));  // real line height without gap
            y0 += gap;
            var x = 0;
            for(var i2=0;i2<n;i2++)
            {
                var img = children[finishedN+i2].firstChild;
                img.height = h;
                img.style.left = x+"px";
                img.style.top = y0+"px";
                appear(img);

                x += img.naturalWidth*h/img.naturalHeight+gap;
            }

            finishedN += n;
            y0 += h;
            container.style.height = (y0+gap)+"px";
            setTimeout(()=>{config(container, width, children, finishedN, y0, heightMin, heightMax, gap);}, 0);
            return;
        }
        w1 = w3;
    }
}

ImagesResponsiveLayout.layout = function(containerId, heightMin, heightMax)
{
    var container = document.getElementById(containerId);
    var width = container.clientWidth
    var children = container.childNodes;
    var finishedN = 0;

    config(container, width, children, finishedN, 0, heightMin, heightMax, 7/*gap*/);
}

ImagesResponsiveLayout.addImages = function(containerId, pathSmall, pathOrigin, images, heightMin, heightMax)
{
    var container = document.getElementById(containerId);
    var content = "";
    images.forEach(e => {
        content += '<a href="'+pathOrigin+e+'"><img src="'+pathSmall+e+'" style="position:absolute; padding:0em; opacity:0;" height='+heightMin+'px title="'+e+'" alt="'+e+'"></a>';
    });
    container.innerHTML = content;
    
    setTimeout(()=>{ImagesResponsiveLayout.layout(containerId, heightMin, heightMax);}, 10);

    window.addEventListener("resize", function(){  // 尺寸变更监听，用于使得画布占满整个页面
        ImagesResponsiveLayout.layout(containerId, heightMin, heightMax);
    });
}
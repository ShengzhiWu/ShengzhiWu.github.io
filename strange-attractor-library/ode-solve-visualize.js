import * as THREE from "https://unpkg.com/three/build/three.module.js";

let renderer, scene, camera;
var cameraPhi = 0.5, cameraTheta = Math.PI/6, cameraDistance = 4;
var mouseX, mouseY;
var mouseXLast = 0, mouseYLast = 0;

// function calculateAmbientOcclusion(positions, colors, radius, strength, samplePer)  // This function changes the input array colors
// {
//     const numPoints = positions.length/3;
//     const shadow = new Float32Array(numPoints);
//     const f1 = -1/(2*radius*radius);

//     for(let i = 0; i<numPoints; i ++)
//     {
//         // console.log(i);
//         for(let j = Math.floor(Math.random()*samplePer); j<numPoints; j += samplePer)
//         {
//             const dx = positions[i*3]-positions[j*3];
//             const dy = positions[i*3+1]-positions[j*3+1];
//             const dz = positions[i*3+2]-positions[j*3+2];
//             const squaredDistance = dx*dx+dy*dy+dz*dz;
//             const shadowValue = Math.exp(f1*squaredDistance);
//             shadow[i] += shadowValue;
//             // if(squaredDistance<radius*radius)
//             // 	shadow[i] += squaredDistance/(radius*radius);
//         }
//     }

//     const f2 = -strength*samplePer/Math.pow(Math.sqrt(2*Math.PI)*radius, 3);
//     for(let i = 0; i<numPoints; i ++)
//     {
//         const factor = Math.exp(f2*shadow[i]);
//         colors[i*3] *= factor;
//         colors[i*3+1] *= factor;
//         colors[i*3+2] *= factor;
//     }
// }

function generatePointCloud(positions, colors) {

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    geometry.computeBoundingBox();

    const material = new THREE.PointsMaterial( { size: pointSize, vertexColors: true } );

    return new THREE.Points( geometry, material );

}

function generateAttractor(numPoints, dt, vFunction, startPoint, drop_early_points_num=0) {
    const positions = new Float32Array( numPoints * 3 );
    const colors = new Float32Array( numPoints * 3 );

    let p = new Float32Array(startPoint);
    for(let i = 0; i<drop_early_points_num; i ++) {
        const v = vFunction(p);
        for(let j = 0; j<p.length; j++)
            p[j] += v[j]*dt;
    }
    for(let i = 0; i<numPoints; i ++) {
        const v = vFunction(p);
        for(let j = 0; j<p.length; j++)
            p[j] += v[j]*dt;

        positions[3*i] = p[0];
        positions[3*i+1] = p[1];
        positions[3*i+2] = p[2];
    }

    // Rescale and center the geometry & color the particles based on coordinates
    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;
    let zMin = Infinity, zMax = -Infinity;
    for(let i = 0; i<numPoints; i++)
    {
        xMin = Math.min(xMin, positions[3*i]);
        xMax = Math.max(xMax, positions[3*i]);
        yMin = Math.min(yMin, positions[3*i+1]);
        yMax = Math.max(yMax, positions[3*i+1]);
        zMin = Math.min(zMin, positions[3*i+2]);
        zMax = Math.max(zMax, positions[3*i+2]);
    }
    const xRange = xMax-xMin;
    const yRange = yMax-yMin;
    const zRange = zMax-zMin;
    for(let i = 0; i<numPoints; i++)
    {
        colors[3*i] = (positions[3*i]-xMin)/xRange;
        colors[3*i+1] = (positions[3*i+1]-yMin)/yRange;
        colors[3*i+2] = (positions[3*i+2]-zMin)/zRange;
    }
    // for(let i = 0; i<numPoints; i++)
    // {
    // 	colors[3*i] = 1;
    // 	colors[3*i+1] = 1;
    // 	colors[3*i+2] = 1;
    // }
    const xCenter = (xMax+xMin)/2;
    const yCenter = (yMax+yMin)/2;
    const zCenter = (zMax+zMin)/2;
    // console.log(Math.max(xRange, yRange, zRange));
    const scale = 2./Math.max(xRange, yRange, zRange);
    for(let i = 0; i<numPoints; i++)
    {
        positions[3*i] = (positions[3*i]-xCenter)*scale;
        positions[3*i+1] = (positions[3*i+1]-yCenter)*scale;
        positions[3*i+2] = (positions[3*i+2]-zCenter)*scale;
    }

    // calculateAmbientOcclusion(positions, colors, 0.2, 2/numPoints, 10000);

    return generatePointCloud(positions, colors);
}

function setCameraPosition()  // Set camera position and direction based on diatance, phi and theta
{
    camera.position.set(
        cameraDistance*Math.cos(cameraTheta)*Math.cos(cameraPhi),
        cameraDistance*Math.sin(cameraTheta),
        cameraDistance*Math.cos(cameraTheta)*Math.sin(cameraPhi));
    camera.lookAt( scene.position );
    camera.updateMatrix();
}

// function animate() {
//     requestAnimationFrame( animate );
//     render();
// }

// function render() {
//     renderer.render( scene, camera );
// }

function init() {

    const container = document.getElementById( 'container' );
    const text = document.getElementById( 'text' );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.0001, 100 );
    setCameraPosition();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    renderer.render( scene, camera );

    const pointCloud = generateAttractor(step_num, dt, ode_function, start_point, drop_early_points_num);
    // pointCloud.scale.set(0.0005, 0.0005, 0.0005);
    // pointCloud.position.set( 0, 0, 0 );
    scene.add(pointCloud);
    renderer.render( scene, camera );

    // window.addEventListener('resize', function onWindowResize() {
    // 	camera.aspect = window.innerWidth / window.innerHeight;
    // 	camera.updateProjectionMatrix();

    // 	renderer.setSize( window.innerWidth, window.innerHeight );
    // });

    document.addEventListener( 'mousemove', function(event) {
        // console.log(event);
        mouseX = event.clientX / window.innerWidth;
        mouseY = event.clientY / window.innerHeight;
        const dx = mouseX-mouseXLast;
        const dy = mouseY-mouseYLast;
        mouseXLast = mouseX;
        mouseYLast = mouseY;
        if(event.buttons==1)  // Drag
        {
            cameraPhi += dx*4;
            cameraTheta += dy*4;
            cameraTheta = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraTheta));
            setCameraPosition();
            renderer.render( scene, camera );
        }
    });

    document.addEventListener( 'touchstart', function(event) {
        // console.log(event);
        mouseX = event.touches[0].clientX/window.innerWidth;
        mouseY = event.touches[0].clientY/window.innerHeight;
        mouseXLast = mouseX;
        mouseYLast = mouseY;
    });

    document.addEventListener( 'touchmove', function(event) {  // Drag
        // console.log(event);
        // mouseX = event.x / window.innerWidth;
        // mouseY = event.y / window.innerHeight;
        mouseX = event.touches[0].clientX/window.innerWidth;
        // text.innerHTML = mouseX;
        mouseY = event.touches[0].clientY/window.innerHeight;
        const dx = mouseX-mouseXLast;
        const dy = mouseY-mouseYLast;
        mouseXLast = mouseX;
        mouseYLast = mouseY;

        cameraPhi += dx*4;
        cameraTheta += dy*4;
        // cameraPhi += 0.01;
        cameraTheta = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraTheta));
        setCameraPosition();
        renderer.render( scene, camera );
    }, {passive: false});

    document.addEventListener( 'wheel', function(event) {
        // console.log(event);
        cameraDistance *= Math.pow(0.998, event.wheelDeltaY);
        setCameraPosition();
        renderer.render( scene, camera );
    });

}

init();
// animate();

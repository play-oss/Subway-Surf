var cubeRotation = 0;
var cubeRotation2 = 0;
var flag = 0;
var to_greyscale = 0;
// var level=0;
var flag_rotate=0;
var far_pt=0;
var flag_periodic = 0;
var flagvariable = 0;
var finalvar = 0;
var an = 0.01;

// var ctx;
var speedy=0;
main();
// var Mousetrap = require('mousetrap');
//
// Start here
//
// var ctx;
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
    width, height, border, srcFormat, srcType,
    pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
     } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
     }
   };
   image.src = url;

   return texture;
 }

 function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function changespeed()
{
  // console.log(far_pt);
  if(finalvar==0)
  {
    far_pt=0;
    speedy=0;
    flagvariable=0;
  }
  else
  {
    if(flagvariable==1 && Math.abs(far_pt-0.8)<=0.0001)
    {
      // console.log("dada");
      finalvar=0;
    }
    if(flagvariable==0)
      speedy+=0.02;
    if(far_pt<=-0.3||flagvariable==1)
    {
      flagvariable=1;
      speedy-=0.02;
    }
  }
}
function main() 
{
  flag=4;
  // console.log("bala");
  var score=0;
  var lives=3;
  const canvas = document.querySelector('#glcanvas');
  var textCanvas = document.getElementById("text");
  ctx = textCanvas.getContext("2d");
  // var ctx = canvas.getContext("2d");

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }


const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;



  const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;


  const periodic_fsSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying highp vec2 vTextureCoord;

  varying highp vec3 vLighting;
  uniform sampler2D uSampler;

  uniform lowp float shadows;
  uniform lowp float highlights;

  const mediump vec3 luminanceWeighting = vec3(0.3, 0.3, 0.3);


  void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    mediump float luminance = dot(texelColor.rgb, luminanceWeighting);

    //(shadows+1.0) changed to just shadows:
    mediump float shadow = clamp((pow(luminance, 1.0/shadows) + (-0.76)*pow(luminance, 2.0/shadows)) - luminance, 0.0, 1.0);
    mediump float highlight = clamp((1.0 - (pow(1.0-luminance, 1.0/(2.0-highlights)) + (-0.8)*pow(1.0-luminance, 2.0/(2.0-highlights)))) - luminance, -1.0, 0.0);
    lowp vec3 result = vec3(0.0, 0.0, 0.0) + ((luminance + shadow + highlight) - 0.0) * ((texelColor.rgb - vec3(0.0, 0.0, 0.0))/(luminance - 0.0));

    // blend toward white if highlights is more than 1
    mediump float contrastedLuminance = ((luminance - 0.5) * 1.5) + 1.5;
    mediump float whiteInterp = contrastedLuminance*contrastedLuminance*contrastedLuminance;
    mediump float whiteTarget = clamp(highlights, 1.0, 2.0) - 1.0;
    result = mix(result, vec3(1.0), whiteInterp*whiteTarget);

    // blend toward black if shadows is less than 1
    mediump float invContrastedLuminance = 1.0 - contrastedLuminance;
    mediump float blackInterp = invContrastedLuminance*invContrastedLuminance*invContrastedLuminance;
    mediump float blackTarget = 1.0 - clamp(shadows, 0.0, 1.0);
    result = mix(result, vec3(0.0), blackInterp*blackTarget);


    // gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    gl_FragColor = vec4(result.rgb * vLighting, texelColor.a);
  }
  `;

  const fsSource_greyScale = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;
  uniform sampler2D uSampler;
  void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    float gray = (texelColor.r * 0.299 + texelColor.g * 0.587 + texelColor.b * 0.144);
    vec3 grayscale = vec3(gray);


    gl_FragColor = vec4(gray * vLighting, texelColor.a);
  }
  `;

  const vsSource1 = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
  `;

  const fsSource1 = `
  varying lowp vec4 vColor;

  void main(void) {
    gl_FragColor = vColor;
  }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const shaderProgram_greyscale = initShaderProgram(gl, vsSource, fsSource_greyScale);
  const shaderProgram_periodic = initShaderProgram(gl, vsSource, periodic_fsSource);

  const shaderProgram2 = initShaderProgram(gl, vsSource1, fsSource1);
  // const shaderprogram = initshaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };


  const programInfo_periodic = {
    program: shaderProgram_periodic,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram_periodic, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram_periodic, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram_periodic, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram_periodic, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram_periodic, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram_periodic, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram_periodic, 'uSampler'),
    },
  };

  const programInfo_greyScale = {
    program: shaderProgram_greyscale,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram_greyscale, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram_greyscale, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram_greyscale, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram_greyscale, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram_greyscale, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram_greyscale, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram_greyscale, 'uSampler'),
    },
  };

const programInfo_greyScale1 = {
    program: shaderProgram_greyscale,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram_greyscale, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram2, 'aVertexColor'),
      //vertexNormal: gl.getAttribLocation(shaderProgram_greyscale, 'aVertexNormal'),
      //textureCoord: gl.getAttribLocation(shaderProgram_greyscale, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram_greyscale, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram_greyscale, 'uModelViewMatrix'),
     // normalMatrix: gl.getUniformLocation(shaderProgram_greyscale, 'uNormalMatrix'),
      //uSampler: gl.getUniformLocation(shaderProgram_greyscale, 'uSampler'),
    },
  };

  const programInfo1 = {
    program: shaderProgram2,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram2, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram2, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram2, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram2, 'uModelViewMatrix'),
    },
  };
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers_wall = initBuffers_wall(gl);
  const buffers_track = initBuffers_track(gl);
  const buffers_track1 = initBuffers_track1(gl);
  const buffers_track2 = initBuffers_track2(gl);
  const buffers_man = initBuffers_man(gl);
  const buffers_coin = initBuffers_coin(gl);
  const buffers_train = initBuffers_train(gl);
  const buffers_train1 = initBuffers_train1(gl);

  const buffers_obs = initBuffers_obs(gl);
  const buffers_obs1 = initBuffers_obs1(gl);
  const buffers_boot = initBuffers_boot(gl);
  const buffers_jet = initBuffers_jet(gl);
  const buffers_cloud = initBuffers_cloud(gl);

  

  //const buffers_wall1 = initBuffers_wall1(gl);

 // const buffers_obstacle = initBuffers_obstacle(gl);
  //const buffers_obstacle2 = initBuffers_obstacle2(gl);
  const texture1 = loadTexture(gl, 'cubetexture.jpeg');
  const man = loadTexture(gl, 'man.jpeg');
  const texturetrack = loadTexture(gl, 'track.jpeg');
  const texturecoin = loadTexture(gl, 'coin.jpeg');
  const texturetrain = loadTexture(gl, 'train.jpeg');
  const textureobs = loadTexture(gl, 'obs.jpeg');
  const textureobs1 = loadTexture(gl, 'obs1.png');
  const textureboot = loadTexture(gl, 'boot.jpeg');
  const texturejet = loadTexture(gl, 'jet.jpeg');
  const texturetrain1 = loadTexture(gl, 'train1.jpeg');
  const texturec = loadTexture(gl, 'cloud.jpeg');



var ss =0;
  var then = 0;
  var score = 0;

  // Draw the scene repeatedly
  function render(now) {

//collisions detection

for(var i=0;i<150;i++)
{
	if(manposx==coinposx[i]&&(manposy<=coinposy[i]+0.1))
		coinadd[i]=100;
}




    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    changespeed();
     if(to_greyscale==0)
     {

       if(flag_periodic==0)
         {
           score=drawScene_wall(gl, programInfo_periodic, buffers_wall, deltaTime,now,score,lives,texture1);
    lives=drawScene_man(gl, programInfo, buffers_man, deltaTime,now,score,lives,cubeRotation,cubeRotation2,man);
    lives=drawScene_track(gl, programInfo, buffers_track, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturetrack);
 lives=drawScene_track1(gl, programInfo1, buffers_track1, deltaTime,now,score,lives,cubeRotation,cubeRotation2);
    lives=drawScene_track2(gl, programInfo1, buffers_track2, deltaTime,now,score,lives,cubeRotation,cubeRotation2);
    lives=drawScene_coin(gl, programInfo, buffers_coin, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturecoin);
    lives=drawScene_train(gl, programInfo, buffers_train, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturetrain);
    lives=drawScene_obs(gl, programInfo, buffers_obs, deltaTime,now,score,lives,cubeRotation,cubeRotation2,textureobs);
    lives=drawScene_obs1(gl, programInfo, buffers_obs1, deltaTime,now,score,lives,cubeRotation,cubeRotation2,textureobs1);
    lives=drawScene_boot(gl, programInfo, buffers_boot, deltaTime,now,score,lives,cubeRotation,cubeRotation2,textureboot);
    lives=drawScene_jet(gl, programInfo, buffers_jet, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturejet);
    lives=drawScene_train1(gl, programInfo, buffers_train1, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturetrain1);
    lives=drawScene_cloud(gl, programInfo, buffers_cloud, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturec);


         }
       else
         {
         score=drawScene_wall(gl, programInfo, buffers_wall, deltaTime,now,score,lives,texture1);
    lives=drawScene_man(gl, programInfo, buffers_man, deltaTime,now,score,lives,cubeRotation,cubeRotation2,man);
    lives=drawScene_track(gl, programInfo, buffers_track, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturetrack);
     lives=drawScene_track1(gl, programInfo1, buffers_track1, deltaTime,now,score,lives,cubeRotation,cubeRotation2);
    lives=drawScene_track2(gl, programInfo1, buffers_track2, deltaTime,now,score,lives,cubeRotation,cubeRotation2);
    lives=drawScene_coin(gl, programInfo, buffers_coin, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturecoin);
    lives=drawScene_train(gl, programInfo, buffers_train, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturetrain);
    lives=drawScene_obs(gl, programInfo, buffers_obs, deltaTime,now,score,lives,cubeRotation,cubeRotation2,textureobs);
    lives=drawScene_obs1(gl, programInfo, buffers_obs1, deltaTime,now,score,lives,cubeRotation,cubeRotation2,textureobs1);
  lives=drawScene_boot(gl, programInfo, buffers_boot, deltaTime,now,score,lives,cubeRotation,cubeRotation2,textureboot);
    lives=drawScene_jet(gl, programInfo, buffers_jet, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturejet);
    lives=drawScene_train1(gl, programInfo, buffers_train1, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturetrain1);


         }
     }

     else
     {
      score=drawScene_wall(gl, programInfo_greyScale, buffers_wall, deltaTime,now,score,lives,texture1);
    lives=drawScene_man(gl, programInfo_greyScale, buffers_man, deltaTime,now,score,lives,cubeRotation,cubeRotation2,man);
    lives=drawScene_track(gl, programInfo_greyScale, buffers_track, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturetrack);
     lives=drawScene_track1(gl, programInfo_greyScale1, buffers_track1, deltaTime,now,score,lives,cubeRotation,cubeRotation2);
    lives=drawScene_track2(gl, programInfo_greyScale1, buffers_track2, deltaTime,now,score,lives,cubeRotation,cubeRotation2);
    lives=drawScene_coin(gl, programInfo_greyScale, buffers_coin, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturecoin);
    lives=drawScene_train(gl, programInfo_greyScale, buffers_train, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturetrain);
    lives=drawScene_obs(gl, programInfo_greyScale, buffers_obs, deltaTime,now,score,lives,cubeRotation,cubeRotation2,textureobs);
    lives=drawScene_obs1(gl, programInfo_greyScale, buffers_obs1, deltaTime,now,score,lives,cubeRotation,cubeRotation2,textureobs1);
lives=drawScene_boot(gl, programInfo_greyScale, buffers_boot, deltaTime,now,score,lives,cubeRotation,cubeRotation2,textureboot);
    lives=drawScene_jet(gl, programInfo_greyScale, buffers_jet, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturejet);
    lives=drawScene_train1(gl, programInfo_greyScale, buffers_train1, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturetrain1);


     }

  

    //lives=drawScene_track(gl, programInfo, buffers_track, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texturetrack);
   
    //lives=drawScene_man(gl, programInfo, buffers_man, deltaTime,now,score,lives,cubeRotation,cubeRotation2,man);
    
    // var n11=score%
//    drawScene_track(gl, programInfo, buffers_track, deltaTime,now,score,lives,texturetrack);

   // score=drawScene_wall(gl, programInfo, buffers_wall, deltaTime,now,score,lives,texture);
   // lives=drawScene_obstacle2(gl, programInfo1, buffers_obstacle2, deltaTime,now,score,lives,cubeRotation,cubeRotation2);


    requestAnimationFrame(render);
  }





  requestAnimationFrame(render);
}
//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
// var x=0;
var init_obstacle=-10;
var extraRotation = 0;
var to_translate = 0;
var num_val=-100;

Mousetrap.bind('d', function () {
 
 posr=1;
 posl=0;
})

Mousetrap.bind('a', function () 
{
 posl=1;
 posr=0;
 
})

Mousetrap.bind('w', function () {
 posu=1;

})

Mousetrap.bind('s', function () 
{
 posd=1;
})
Mousetrap.bind('g', function ()
{
  to_greyscale = 1 - to_greyscale;
})
Mousetrap.bind('j', function ()
{
  finalvar=1;
})

// function initBuffers_obstacle(gl) {

//   // Create a buffer for the cube's vertex positions.

//   const positionBuffer = gl.createBuffer();

//   // Select the positionBuffer as the one to apply buffer
//   // operations to from here out.

//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//   // Now create an array of positions for the cube.

//   const positions = [
//     // Front face
//     0.15,  1.34, -0.15,
//     -0.15,  1.34, -0.15,
//     -0.15,  1.34,  0.15,
//     0.15,  1.34,  0.15,

//     // Back face
//     0.15, -1.34,  0.15,
//     -0.15, -1.34,  0.15,
//     -0.15, -1.34, -0.15,
//     0.15, -1.34, -0.15,

//     // Top face
//     0.15,  1.34,  0.15,
//     -0.15,  1.34,  0.15,
//     -0.15, -1.34,  0.15,
//     0.15, -1.34,  0.15,

//     // Bottom face
//     0.15, -1.34, -0.15,
//     -0.15, -1.34, -0.15,
//     -0.15,  1.34, -0.15,
//     0.15,  1.34, -0.15,

//     // 15 face
//     -0.15,  1.34,  0.15,
//     -0.15,  1.34, -0.15,
//     -0.15, -1.34, -0.15,
//     -0.15, -1.34,  0.15,

//     // Left face
//     0.15,  1.34, -0.15,
//     0.15,  1.34,  0.15,
//     0.15, -1.34,  0.15,
//     0.15, -1.34, -0.15,
//     ];

//   // Now pass the list of positions into WebGL to build the
//   // shape. We do this by creating a Float32Array from the
//   // JavaScript array, then use it to fill the current buffer.

//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//   // Now set up the colors for the faces. We'll use solid colors
//   // for each face.

//   const faceColors = [
//     [128/255,  0.0,  0.0,  1.0],    // Front face: white
//     [1.0,  0.0,  0.0,  1.0],    // Back face: red
//     [255/255,  165/255,  0/255,  1.0],    // Top face: green
//     [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
//     [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
//     [128/255,  0.0,  0.0,  1.0],    // Left face: purple
//     ];


//   // Convert the array of colors into a table for all the vertices.

//   var colors = [];

//   for (var j = 0; j < faceColors.length; ++j) {
//     const c = faceColors[j];

//     // Repeat each color four times for the four vertices of the face
//     colors = colors.concat(c, c, c, c);
//   }

//   const colorBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//   // Build the element array buffer; this specifies the indices
//   // into the vertex arrays for each face's vertices.

//   const indexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

//   // This array defines each face as two triangles, using the
//   // indices into the vertex array to specify each triangle's
//   // position.

//   const indices = [
//     0,  1,  2,      0,  2,  3,    // front
//     4,  5,  6,      4,  6,  7,    // back
//     8,  9,  10,     8,  10, 11,   // top
//     12, 13, 14,     12, 14, 15,   // bottom
//     16, 17, 18,     16, 18, 19,   // right
//     20, 21, 22,     20, 22, 23,   // left
//     ];

//   // Now send the element array to GL

//   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
//     new Uint16Array(indices), gl.STATIC_DRAW);

//   return {
//     position: positionBuffer,
//     color: colorBuffer,
//     indices: indexBuffer,
//   };
// }


//   var vv=0;
//   var frotate_obs=0;
//   function drawScene_obstacle(gl, programInfo, buffers, deltaTime,now,score,lives) 
//   {
//     // score=12;
//     // var sc=20;
//     // ctx.font = "22px Arial";
//     // ctx.fillStyle = "#0095DD";
//     // ctx.fillText("Score: " + score  + "      Lives:  " + lives, 29, 40);
//   // gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
//   // gl.clearDepth(1.0);                 // Clear everything
//   // gl.enable(gl.DEPTH_TEST);           // Enable depth testing
//   // gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

//   // Clear the canvas before we start drawing on it.

//   // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//   // Create a perspective matrix, a special matrix that is
//   // used to simulate the distortion of perspective in a camera.
//   // Our field of view is 45 degrees, with a width/height
//   // ratio that matches the display size of the canvas
//   // and we only want to see objects between 0.1 units
//   // and 100 units away from the camera.

//   const fieldOfView = 45 * Math.PI / 180;   // in radians
//   const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
//   const zNear = 0.1;
//   const zFar = 100.0;
//   const projectionMatrix = mat4.create();

//   // note: glmatrix.js always has the first argument
//   // as the destination to receive the result.
//   mat4.perspective(projectionMatrix,fieldOfView,aspect,zNear,zFar);

//   // Set the drawing position to the "identity" point, which is
//   // the center of the scene.
//   const modelViewMatrix = mat4.create();

//   // Now move the drawing position a bit to where we want to
//   // start drawing the square.

//   mat4.translate(modelViewMatrix,     // destination matrix
//                  modelViewMatrix,     // matrix to translate
//                  [-0.0, 0.8, num_val+now*20]);  // amount to translate


//   // var x1 = -0.0;
//   // var y1 = 0.8;
//   var z1 = num_val+now*20;
//   // console.log(z1);
//   // console.log(cubeRotation);
//   // console.log(flag);
//   // console.log(flag_rotate);
//   // console.log(vv*flag_rotate+cubeRotation2);
//   if(Math.abs(z1)<=1 && Math.abs(cubeRotation)<=0.15 && flag_rotate==0)
//   {
//     flag--;
//     // lives=lives-1;
//     // exit();
//   }
//   else if(Math.abs(z1)<=1 && Math.abs(cubeRotation2+vv*flag_rotate)<=0.25 && flag_rotate==1)
//   {
//     console.log("Dada");
//     flag--;
//   }
//   if(flag==0)
//   {
//     lives--;
//     flag=4;
//   }
//   if(lives==0)
//   {
//     alert("YOU LOST, Click OK to play the game again!");
//     document.location.reload();
//   }
//   if(z1>=0)
//   {
//     vv=0;
//     var ff=parseInt(score/500);
//     num_val-=70 + ff*5;
//   }
//     // console.log("hey");
//   // console.log(to_translate);
//   // init_obstacle+=to_translate;
//   mat4.rotate(modelViewMatrix,  // destination matrix
//               modelViewMatrix,  // matrix to rotate
//               flag_rotate*vv+cubeRotation,     // amount to rotate in radians
//               [0, 0, 1]);       // axis to rotate around (Z)
//   // frotate_obs+=vv+cubeRotation;
//   // frotate_obs=frotate_obs%6;
//   // if(Math.abs(frotate_obs-frotate_tunnel)<=1)
//   //   console.log("hey");
//   vv=vv+0.01;
//   // console.log(vv+cubeRotation);

//   // mat4.rotate(modelViewMatrix,  // destination matrix
//   //             modelViewMatrix,  // matrix to rotate
//   //             20+// amount to rotate in radians
//   //             [0, 1, 0]);       // axis to rotate around (X)

//   // Tell WebGL how to pull out the positions from the position
//   // buffer into the vertexPosition attribute
//   {
//     const numComponents = 3;
//     const type = gl.FLOAT;
//     const normalize = false;
//     const stride = 0;
//     const offset = 0;
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
//     gl.vertexAttribPointer(
//       programInfo.attribLocations.vertexPosition,
//       numComponents,
//       type,
//       normalize,
//       stride,
//       offset);
//     gl.enableVertexAttribArray(
//       programInfo.attribLocations.vertexPosition);
//   }

//   // Tell WebGL how to pull out the colors from the color buffer
//   // into the vertexColor attribute.
//   {
//     const numComponents = 4;
//     const type = gl.FLOAT;
//     const normalize = false;
//     const stride = 0;
//     const offset = 0;
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
//     gl.vertexAttribPointer(
//       programInfo.attribLocations.vertexColor,
//       numComponents,
//       type,
//       normalize,
//       stride,
//       offset);
//     gl.enableVertexAttribArray(
//       programInfo.attribLocations.vertexColor);
//   }

//   // Tell WebGL which indices to use to index the vertices
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

//   // Tell WebGL to use our program when drawing

//   gl.useProgram(programInfo.program);

//   // Set the shader uniforms

//   gl.uniformMatrix4fv(
//     programInfo.uniformLocations.projectionMatrix,
//     false,
//     projectionMatrix);
//   gl.uniformMatrix4fv(
//     programInfo.uniformLocations.modelViewMatrix,
//     false,
//     modelViewMatrix);

//   {
//     const vertexCount = 36;
//     const type = gl.UNSIGNED_SHORT;
//     const offset = 0;
//     gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
//   }

//   // Update the rotation for the next draw

//   // cubeRotation += deltaTime;
//   return lives;
// }

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}


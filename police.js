var speedman = 0;
// var posr=0;
// var posl=0;
// var posu=0;
// var posd=0;
// var hflag=0;
// var jflag=0;
function initBuffers_police(gl) {

  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.

  const positions = [
    -0.050,  -1.00, -2.0,
  0.050,  -1.00,  -2.0,
   0.050, -1.190,  -2.0,
   -0.050, -1.190, -2.0,
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  const faceColors = [
    [0.0,  0.0,  0.0,  1.0],    // Front face: white
  ];

  // Convert the array of colors into a table for all the vertices.

  var colors = [];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

//-------------------------------------------------------------

 const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);


  const textureCoordinates = [
    // Front
    //0.0,  0.0,
    //1.0,  0.0,
    //1.0,  1.0,
    //0.0,  1.0,
    // Back
    //0.0,  0.0,
    //1.0,  0.0,
    //1.0,  1.0,
    //0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    // 0.0,  0.0,
    // 1.0,  0.0,
    // 1.0,  1.0,
    // 0.0,  1.0,

    // 0.0,  0.0,
    // 1.0,  0.0,
    // 1.0,  1.0,
    // 0.0,  1.0,
    // // Bottom
    // 0.0,  0.0,
    // 1.0,  0.0,
    // 1.0,  1.0,
    // 0.0,  1.0,
    

    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),gl.STATIC_DRAW);



    const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  const vertexNormals = [
    // Front
   

    
    0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                gl.STATIC_DRAW);

                //-------------------------------------------------------------------------


  return {
     position: positionBuffer,
    normal: normalBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}
var a=0;
var b=0;
// var counteru=0;
// var counterd=0;
// var manposx=0;
// var manposy=0;
// var counterh=0;
// var hei=0;
// var counterj=0;
function drawScene_police(gl, programInfo, buffers, deltaTime,now,score,lives,cubeRotation,cubeRotation2,texture) 
{
  //speedman -= 0.01;
// if(hflag==1)
// counterh+=0.01;
// if(posu==1)
// counteru+=0.01;
// if(posd==1)
// counterd+=0.01;
// if(jflag==1)
// counterj+=0.01;
// if(counteru == 0.16)
// {
//   b=0;
//   counteru =0;
//   posu=0;
//   //jflag=0;
// }
// if(counterj >= 0.8)
// {

//  counterj=0;
//   jflag=0;
//   b=0.3;
// }

// if(counterd == 0.16)
// {
//   b=0;
//   counterd =0;
//   posd=0;
// }

// if(counterh >= 2)
// {
//   hei=0;
//   counterh =0;
//   hflag=0;
//   an=0.06;
// }


// if(posr==1)
// {
// if(a==0)
//   a=0.607;
// if(a==-0.607)
//   a=0;
// posr=0;
// }

// if(posl==1)
// {
// if(a==0)
//   a=-0.607;
// if(a==0.607)
//   a=0;
// posl=0;
// }

// if(posu==1 && jflag!=1)
// {
//   b=0.3;
// }
// if(posu==1 && jflag==1)
// {
//   b=0.7;
// }

// if(posd==1)
// {
//   b=-0.2;
// }
// if(hflag==1)
// hei=0.8;
//speed -= 0.01;
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,fieldOfView,aspect,zNear,zFar);
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  // for(var i=0;i<1000;i++){
// manposx=a;
// manposy=speedman;
  var modelViewMatrix = mat4.create();
  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [manposx, 0.79, manposy + 1.2]);  // amount to translate
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              0,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
 const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }
  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  // 
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.textureCoord);
  }

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexNormal);
  }
  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix);
      // Specify the texture to map onto the faces.

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);
  {
    const vertexCount = 6;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

// }
    return lives;

  }

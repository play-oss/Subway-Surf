var speedwall=0;
function initBuffers_wall(gl) 
{
  // Create a buffer for the cube's vertex positions.
  const positionBuffer = gl.createBuffer();
  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.
const positions = [
  //-1.0, -1.0,  1.0,
   //1.0, -1.0,  1.0,
   //1.0,  1.0,  1.0,
  //-1.0,  1.0,  1.0,
  
  // Back face
  //-1.0, -1.0, -1.0,
  //-1.0,  1.0, -1.0,
   //1.0,  1.0, -1.0,
   //1.0, -1.0, -1.0,
  
  // Top face
  -3.0,  3000.0, -3.0,
  -3.0,  3000.0,  3.0,
   3.0,  3000.0,  3.0,
   3.0,  3000.0, -3.0,
  
  // Bottom face
  -3.0, -1.0, -3.0,
   3.0, -1.0, -3.0,
   3.0, -1.0,  3.0,
  -3.0, -1.0,  3.0,
  
  // Right face
   3.0, -3.0, -1.0,
   3.0,  3.0, -1.0,
   3.0,  3.0,  1.0,
   3.0, -3.0,  1.0,
  
  // Left face
  -3.0, -3.0, -1.0,
  -3.0, -3.0,  1.0,
  -3.0,  3.0,  1.0,
  -3.0,  3.0, -1.0,
  
  ];
  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),
    gl.STATIC_DRAW);

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
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    

    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),gl.STATIC_DRAW);



    const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  const vertexNormals = [
    // Front
   

    
    //0.0,  0.0,  1.0,
     //0.0,  0.0,  1.0,
     //0.0,  0.0,  1.0,
     //0.0,  0.0,  1.0,

    // Back
     //0.0,  0.0, -1.0,
     //0.0,  0.0, -1.0,
     //0.0,  0.0, -1.0,
     //0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                gl.STATIC_DRAW);
  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  // // Build the element array buffer; this specifies the indices
  // // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
     0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    //16, 17, 18,     16, 18, 19,   // right
    //20, 21, 22,     20, 22, 23,
    ];
//    for(var i=1;i<=200;i++)
  //  {
    //  for(var j=1;j<=48;j++)
     // {
       // indices.push(i*32+indices[j-1]);
     // }
    //}
  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    normal: normalBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}

//var frotate_tunnel=0;
//var jj=0.0; 

function drawScene_wall(gl, programInfo, buffers, deltaTime,now,score,lives,texture) 
{
  speedwall +=an;
  if(score%100==0)
  {
    flag_periodic=1-flag_periodic;
  }
      ctx.font = "22px Arial";
      ctx.fillStyle = "#000000";
      var level =parseInt(score/500);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillText("Score:" + score  + "  Lives:" + lives + " Level:" + level, 29, 40);
      score++;
      if(score%1000==0)
        flag_rotate=1-flag_rotate;


if(level==8)
  {alert("YOU WON, Click OK to play the game again!");
     document.location.reload();}


  gl.clearColor(27/255,179/255,245/255, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

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
  //var i;
 // extraRotation+=90*Math.PI/180;
  // tunnelrotation += i/50 *(45*Math.PI/180;)
for(var i =0;i<1000;i++)
{

  var modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
    mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [0.0, 0.0, -2*i+speedwall]);  // amount to translate
   // far_pt=0.8-speedy;


    mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
    //frotate_tunnel+=cubeRotation+extraRotation;
    //frotate_tunnel=frotate_tunnel%6;

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
    const vertexCount = 24;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

}
    return score;

  }



  //----------------------------------------------------------------------------------------------------------------

  
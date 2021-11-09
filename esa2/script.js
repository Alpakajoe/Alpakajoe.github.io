const canvas = document.getElementById('canvas');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const gl = canvas.getContext('experimental-webgl');

// pipeline setup + set background color 
gl.clearColor(0.2, 0.2, 0.2, 0);

// compile a vertex shader
const vsSource = 'attribute vec2 pos;'
    + 'void main(){gl_Position = vec4(pos, 0, 1); }';
const vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// compile a fragment shader + set line color
let fsSource = 'void main() { gl_FragColor = vec4(1); }';
const fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSource);
gl.compileShader(fs);

// link together into a program
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

// load vertex data into a buffer
    const vertices = new Float32Array([
        0, 0.35, // outline start
        0.03, 0.33,
        0.12, 0.48,
        0.03, 0.33,
        0.10, 0.28,
        0.54, 0.61,
        0.91, 0.68,
        0.98, 0.43,
        0.87, 0.27,
        0.78, -0.01,
        0.49, 0.03,
        0.73, -0.27,
        0.55, -0.59,
        0.22, -0.67,
        0.01, -0.32,
        0, -0.36,
        0, -0.36,
        -0.01, -0.32,
        -0.22, -0.67,
        -0.55, -0.59,
        -0.73, -0.27,
        -0.49, 0.03,
        -0.78, -0.01,
        -0.87, 0.27,
        -0.98, 0.43,
        -0.91, 0.68,
        -0.54, 0.61,
        -0.10, 0.28,
        -0.03, 0.33,
        -0.12, 0.48,
        -0.03, 0.33,
        0, 0.35, // outline end        
        0.03, 0.33, // right wing start         
        0.10, 0.28,
        0, 0.20,
        0.09, 0.20,
        0.10, 0.28,
        0.64, 0.31,
        0.54, 0.61,
        0.98, 0.43,
        0.54, 0.61,
        0.87, 0.27,
        0.64, 0.31,
        0.78, -0.01,
        0.64, 0.31,
        0.49, 0.03,
        0.10, 0.28,
        0.49, 0.03,
        0.03, -0.17,
        0.73, -0.27,
        0.33, -0.48,
        0.03, -0.17, 
        0.09, 0.20, 
        0, 0.20, 
        0, -0.36,     
        0.01, -0.32,
        0.55, -0.59,
        0.01, -0.32,
        0.03, -0.17, 
        0.01, -0.32,
        0, -0.36, // right wing end
        0, 0.35, // left wing start
        -0.03, 0.33,          
        -0.10, 0.28,
        0, 0.20,
        -0.09, 0.20,
        -0.10, 0.28,
        -0.64, 0.31,
        -0.54, 0.61,
        -0.98, 0.43,
        -0.54, 0.61,
        -0.87, 0.27,
        -0.64, 0.31,
        -0.78, -0.01,
        -0.64, 0.31,
        -0.49, 0.03,
        -0.10, 0.28,
        -0.49, 0.03,
        -0.03, -0.17,
        -0.73, -0.27,
        -0.33, -0.48,
        -0.03, -0.17, 
        -0.09, 0.20, 
        0, 0.20, 
        0, -0.36,     
        -0.01, -0.32,
        -0.55, -0.59,
        -0.01, -0.32,
        -0.03, -0.17, 
        -0.01, -0.32,
        0, -0.36, // left wing end
    ]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// bind vertex buffer to attribute variable
    const posAttrib = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);

// clear framebuffer and render primitives
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);



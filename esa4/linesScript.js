 const canvas = document.getElementById('canvas');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const gl = canvas.getContext('experimental-webgl');

  // pipeline setup + set background color 
  gl.clearColor(0.2, 0.2, 0.2, 0);

  // Backface culling
  gl.frontFace(gl.CCW);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  // // Depth(Z)-Buffer.
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  // Polygon offset of rastered Fragments.
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.polygonOffset(1.0, 1.0);

  // Compile vertex shader.
  const vsSource = ''
    + 'attribute vec3 pos;'
    + 'attribute vec4 col;'
    + 'varying vec4 color;'
    + 'void main(){'
    + 'color = col;'
    + 'gl_Position = vec4(pos * 0.1, 1);'
    + '}';

  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsSource);
  gl.compileShader(vs);

  // Compile fragment shader.
  const fsSouce = 'precision mediump float;'
    + 'varying vec4 color;'
    + 'void main() {'
    + 'gl_FragColor = color;'
    + '}';

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsSouce);
  gl.compileShader(fs);

  // Link shader together into a program.

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, 'pos');
  gl.linkProgram(prog);
  gl.useProgram(prog);

  // Enneper

  const {
    enneperVertices, enneperIndicesLines, enneperIndicesTriangles,
  } = createenneperSurfaceVertexData();

  // Setup position vertex buffer object.
  const vboPos = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
  gl.bufferData(gl.ARRAY_BUFFER, enneperVertices, gl.STATIC_DRAW);

  // Bind vertex buffer to attribute variable.
  const posAttrib = gl.getAttribLocation(prog, 'pos');
  gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posAttrib);

  // Setup constant color.
  const colAttrib = gl.getAttribLocation(prog, 'col');

  // Setup lines index buffer object.
  const enneperIboLines = createIBO(enneperIndicesLines);

  // Setup tris index buffer object.
  const enneperIboTriangles = createIBO(enneperIndicesTriangles);

  // Clear framebuffer and render primitives.
  // eslint-disable-next-line no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const enneperLinesColor = {
    r: 0.9, g: 0.45, b: 0.88, a: 0,  
  };

  const enneperTrianglesColor = {
  };

  setupIboRendering(colAttrib, enneperIboTriangles, gl.TRIANGLES, enneperTrianglesColor);
  setupIboRendering(colAttrib, enneperIboLines, gl.LINES, enneperLinesColor);

  // Torus

  const { torusVertices, torusIndicesLines, torusIndicesTriangles } = createTorusVertexData();

  // Setup position vertex buffer object.
  const torusVboPos = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, torusVboPos);
  gl.bufferData(gl.ARRAY_BUFFER, torusVertices, gl.STATIC_DRAW);

  // Bind vertex buffer to attribute variable.
  const torusPosAttrib = gl.getAttribLocation(prog, 'pos');
  gl.vertexAttribPointer(torusPosAttrib, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(torusPosAttrib);

  // Setup constant color.
  const torusColAttrib = gl.getAttribLocation(prog, 'col');
  const torusIboLines = createIBO(torusIndicesLines);
  const torusIboTriangles = createIBO(torusIndicesTriangles);

  const torusLinesColor = {
  r: 1, g: 1, b: 1, a: 1,
  };

  const torusTrianglesColor = {
  };

  setupIboRendering(torusColAttrib, torusIboTriangles, gl.TRIANGLES, torusTrianglesColor);
  setupIboRendering(torusColAttrib, torusIboLines, gl.LINES, torusLinesColor);

  function createenneperSurfaceVertexData() {
    const _vertices = [];
    const _indicesLines = [];
    const _indicesTriangles = [];

    const m = 64;
    const n = 64;

    const rangeU = { min: -1.77, max: 1.77 };
    const rangeV = { min: -1.77, max: 1.77 };

    const du = (rangeU.max - rangeU.min) / n;
    const dv = (rangeV.max - rangeV.min) / m;

    // Counter for entries in index array.
    let counterLines = 0;
    let counterTriangles = 0;

    for (let u = rangeU.min, i = 0; i <= n; i++, u += du) {
      for (let v = rangeV.min, j = 0; j <= m; j++, v += dv) {
        const iVertex = i * (m + 1) + j;

        // Enneper Surface
        const x = u - (Math.pow(u, 3) / 3) + u * Math.pow(v, 2); 
        const y = v - (Math.pow(v, 3) / 3) + Math.pow(u, 2) * v;
        const z = Math.pow(u, 2) - Math.pow(v, 2);

        // Set vertex positions.
        _vertices[iVertex * 3] = x;
        _vertices[iVertex * 3 + 1] = y;
        _vertices[iVertex * 3 + 2] = z;

        // Set index.
        // Line on beam.
        if (j > 0 && i > 0) {
          _indicesLines[counterLines++] = iVertex - 1;
          _indicesLines[counterLines++] = iVertex;
        }

        // Line on ring.
        if (j > 0 && i > 0) {
          _indicesLines[counterLines++] = iVertex - (m + 1);
          _indicesLines[counterLines++] = iVertex;
        }

        // Set index.
        // Two Triangles.

        if (j > 0 && i > 0) {
          _indicesTriangles[counterTriangles++] = iVertex;
          _indicesTriangles[counterTriangles++] = iVertex - 1;
          _indicesTriangles[counterTriangles++] = iVertex - (m + 1);

          _indicesTriangles[counterTriangles++] = iVertex - 1;
          _indicesTriangles[counterTriangles++] = iVertex - (m + 1) - 1;
          _indicesTriangles[counterTriangles++] = iVertex - (m + 1);
        }
      }
    }

    return {
      enneperVertices: new Float32Array(_vertices),
      enneperIndicesLines: new Uint16Array(_indicesLines),
      enneperIndicesTriangles: new Uint16Array(_indicesTriangles),
    };
  }

  function createTorusVertexData() {
    const _vertices = [];
    const _indicesLines = [];
    const _indicesTriangles = [];

    const m = 30;
    const n = 30;

    const rangeU = { min: 0, max: (Math.PI * 2) };
    const rangeV = { min: 0, max: (Math.PI * 2) };

    const du = (rangeU.max - rangeU.min) / n;
    const dv = (rangeV.max - rangeV.min) / m;

    // Counter for entries in index array.
    let counterLines = 0;
    let counterTriangles = 0;

    const r = 1;
    const R = 9;

    for (let u = rangeU.min, i = 0; i <= n; i++, u += du) {
      for (let v = rangeV.min, j = 0; j <= m; j++, v += dv) {
        const iVertex = i * (m + 1) + j;

        // Torus Surface
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v);

        // Set vertex positions.
        _vertices[iVertex * 3] = x;
        _vertices[iVertex * 3 + 1] = y;
        _vertices[iVertex * 3 + 2] = z;

        // Set index.
        // Line on beam.
        if (j > 0 && i > 0) {
          _indicesLines[counterLines++] = iVertex - 1;
          _indicesLines[counterLines++] = iVertex;
        }

        // Line on ring.
        if (j > 0 && i > 0) {
          _indicesLines[counterLines++] = iVertex - (m + 1);
          _indicesLines[counterLines++] = iVertex;
        }

        // Set index.
        // Two Triangles.

        if (j > 0 && i > 0) {
          _indicesTriangles[counterTriangles++] = iVertex;
          _indicesTriangles[counterTriangles++] = iVertex - 1;
          _indicesTriangles[counterTriangles++] = iVertex - (m + 1);

          _indicesTriangles[counterTriangles++] = iVertex - 1;
          _indicesTriangles[counterTriangles++] = iVertex - (m + 1) - 1;
          _indicesTriangles[counterTriangles++] = iVertex - (m + 1);
        }
      }
    }

    return {
      torusVertices: new Float32Array(_vertices),
      torusIndicesLines: new Uint16Array(_indicesLines),
      torusIndicesTriangles: new Uint16Array(_indicesTriangles),
    };
  }

  function setupIboRendering(colorAttribute, ibo, renderingType, color) {
    const {
      r, g, b, a,
    } = color;

    // eslint-disable-next-line no-restricted-globals,max-len
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a) || ![gl.TRIANGLES, gl.LINES].includes(renderingType)) {
      console.error('Pay attention to the rendering attributes', color, renderingType);
      return;
    }

    gl.vertexAttrib4f(colorAttribute, r, g, b, a);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.drawElements(renderingType, ibo.numberOfElements, gl.UNSIGNED_SHORT, 0);
  }

  function createIBO(indices) {
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    ibo.numberOfElements = indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  }
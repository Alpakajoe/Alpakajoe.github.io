export const enneper = ((() => {
    function createVertexData() {
        const m = 64;
        const n = 64;

        this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
        const { vertices } = this;
        this.normals = new Float32Array(3 * (n + 1) * (m + 1));
        const { normals } = this;

        this.indicesLines = new Uint16Array(2 * 2 * n * m);
        const { indicesLines } = this;
        this.indicesTris = new Uint16Array(3 * 2 * n * m);
        const { indicesTris } = this;

            
        const rangeU = { min: -2, max: 2 };
        const rangeV = { min: -2, max: 2 };

        const du = (rangeU.max - rangeU.min) / n;
        const dv = (rangeV.max - rangeV.min) / m;

        let iLines = 0;
        let iTris = 0;

        for (let u = rangeU.min, i = 0; i <= n; i++, u += du) {
            for (let v = rangeV.min, j = 0; j <= m; j++, v += dv) {
                const iVertex = i * (m + 1) + j;

        const x = 0.1 * (u - (Math.pow(u, 3) / 3) + u * Math.pow(v, 2)); 
        const y = 0.1 * (v - (Math.pow(v, 3) / 3) + Math.pow(u, 2) * v);
        const z = 0.1 * (Math.pow(u, 2) - Math.pow(v, 2));
  
          // Set vertex positions.
          vertices[iVertex * 3] = x;
          vertices[iVertex * 3 + 1] = y;
          vertices[iVertex * 3 + 2] = z;
  
          // Calc and set normals.
          const nx = Math.cos(u) * Math.cos(v);
          const ny = Math.cos(u) * Math.sin(v);
          const nz = Math.sin(u);
          normals[iVertex * 3] = nx;
          normals[iVertex * 3 + 1] = ny;
          normals[iVertex * 3 + 2] = nz;
  
          // Set index.
          // Line on beam.
          if (j > 0 && i > 0) {
            indicesLines[iLines++] = iVertex - 1;
            indicesLines[iLines++] = iVertex;
          }
          // Line on ring.
          if (j > 0 && i > 0) {
            indicesLines[iLines++] = iVertex - (m + 1);
            indicesLines[iLines++] = iVertex;
          }
  
          // Set index.
          // Two Triangles.
          if (j > 0 && i > 0) {
            indicesTris[iTris++] = iVertex;
            indicesTris[iTris++] = iVertex - 1;
            indicesTris[iTris++] = iVertex - (m + 1);
            //
            indicesTris[iTris++] = iVertex - 1;
            indicesTris[iTris++] = iVertex - (m + 1) - 1;
            indicesTris[iTris++] = iVertex - (m + 1);
          }
        }
      }
    }
  
    return {
      createVertexData,
    };
  })());
  

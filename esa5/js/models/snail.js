import { _setPositionsArray, _setIndexLines, _setIndexTris } from './vertexData.js';

const name = "snail";

var snail = (function() {

    function createVertexData() {
        const m = 12;
        const n = 12;

        this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
        const { vertices } = this;
        this.normals = new Float32Array(3 * (n + 1) * (m + 1));
        const { normals } = this;

        this.indicesLines = new Uint16Array(2 * 2 * n * m);
        const { indicesLines } = this;
        this.indicesTris = new Uint16Array(3 * 2 * n * m);
        const { indicesTris } = this;

             
        const rangeU = { min: 0, max: 2*Math.PI };
        const rangeV = { min: -Math.PI, max: Math.PI };
      
        const du = (rangeU.max - rangeU.min) / n;
        const dv = (rangeV.max - rangeV.min) / m;
      
        let iLines = 0;
        let iTris = 0;

        for (let u = rangeU.min, i = 0; i <= n; i++, u += du) {
            for (let v = rangeV.min, j = 0; j <= m; j++, v += dv) {
                const iVertex = i * (m + 1) + j;

                const x = 0.1 * (u * Math.cos(v) * Math.sin(u)); 
                const y = 0.1 * (u * Math.cos(u) * Math.cos(v));
                const z = 0.1 * (-u * Math.sin(v));

                // Set vertex positions.
                vertices[iVertex * 3] = x;
                vertices[iVertex * 3 + 1] = y + 0.8;
                vertices[iVertex * 3 + 2] = z - 2;

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
        createVertexData: createVertexData
    }

}());
export { name, snail };

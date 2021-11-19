import { _setPositionsArray, _setIndexLines, _setIndexTris } from './vertexData.js';

const name = "hyperbolicOctahedron";

var hyperbolicOctahedron = (function() {

    function createVertexData() {
        const m = 32,
            n = 8 * m;

        // Positions.
        this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
        let vertices = this.vertices;
        // Normals.
        this.normals = new Float32Array(3 * (n + 1) * (m + 1));
        let normals = this.normals;
        // Index data.
        this.indicesLines = new Uint16Array(2 * 2 * n * m);
        let indicesLines = this.indicesLines;
        this.indicesTris = new Uint16Array(3 * 2 * n * m);
        let indicesTris = this.indicesTris;

        const du = 12 * Math.PI / n,
            dv = 2 * Math.PI / m;
        // Counter for entries in index array.
        let iLines = 0,
            iTris = 0;

        // Loop angle u.
        for (let i = 0, u = 0; i <= n; i++, u += du) {
            // Loop angle v.
            for (let j = 0, v = 0; j <= m; j++, v += dv) {

                const iVertex = i * (m + 1) + j;

                const x = Math.pow(Math.cos(u) * Math.cos(v), 3),
                    y = Math.pow(Math.sin(u) * Math.cos(v), 3),
                    z = Math.pow(Math.sin(v), 3);

                // Set vertex positions.
                _setPositionsArray(vertices, iVertex, { px: x, py: y, pz: z })

                // Calc and set normals.
                const nx = Math.cos(u) * Math.cos(v),
                    ny = Math.cos(u) * Math.sin(v),
                    nz = Math.sin(u);
                _setPositionsArray(normals, iVertex, { px: nx, py: ny, pz: nz })

                // Set index.
                if (j > 0 && i > 0) {
                    // Line on beam and on ring.
                    iLines = _setIndexLines(iLines, indicesLines, iVertex, m);
                    // Two Triangles.
                    iTris = _setIndexTris(iTris, indicesTris, iVertex, m);
                }
            }
        }
    }

    return {
        createVertexData: createVertexData
    }

}());
export { name, hyperbolicOctahedron };
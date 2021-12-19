import { _setPositionsArray, _setIndexLines, _setIndexTris } from './vertexData.js';

const name = "plane";

var plane = (function() {

    function createVertexData() {
        const n = 40,
            m = n;

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

        const du = 100 / n,
            dv = 100 / m;
        // Counter for entries in index array.
        let iLines = 0,
            iTris = 0;

        // Loop angle u.
        for (let i = 0, u = -50; i <= n; i++, u += du) {
            // Loop angle v.
            for (let j = 0, v = -50; j <= m; j++, v += dv) {

                const iVertex = i * (m + 1) + j;

                const x = u,
                    y = 0,
                    z = v;

                // Set vertex positions.
                _setPositionsArray(vertices, iVertex, { px: x, py: y, pz: z })

                _setPositionsArray(normals, iVertex, { px: 0, py: 1, pz: 0 })

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

export { name, plane };
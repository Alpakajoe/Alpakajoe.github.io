import { _setPositionsArray, _setIndexLines, _setIndexTris } from './vertexData.js';

const name = "torus";

var torus = (function() {

    function createVertexData() {
        const n = 16,
            m = 2*n;

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

        const du = 2 * Math.PI / n,
            dv = 2 * Math.PI / m;
        const r = 0.2,
            R = 0.7;
        // Counter for entries in index array.
        let iLines = 0,
            iTris = 0;

        // Loop angle u.
        for (let i = 0, u = 0; i <= n; i++, u += du) {
            // Loop angle v.
            for (let j = 0, v = 0; j <= m; j++, v += dv) {

                const iVertex = i * (m + 1) + j;

                const cosU = Math.cos(u),
                    cosV = Math.cos(v),
                    sinU = Math.sin(u),
                    sinV = Math.sin(v);

                const x = 0.7 * ((R + r * cosU) * cosV),
                    y = 0.7 * ((R + r * cosU) * sinV),
                    z = 0.7 * (r * sinU);

                // Set vertex positions.
                _setPositionsArray(vertices, iVertex, { px: x, py: y, pz: z });

                // Calc and set normals.
                const nx = cosU * cosV,
                    ny = cosU * sinV,
                    nz = sinU;
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

export { name, torus };
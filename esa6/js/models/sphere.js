import { _calcVertexLengthForSphere } from './vertexData.js';

const name = "sphere";
var sphere = (function() {
    let iVertex = 0;

    function createVertexData() {
        let recursionDepth = document.getElementById('recursionDepth').value;
        
        let vertices = [];
        // Normals.
        //this.normals = new Float32Array(3 * numPoints);
        let normals = [];
        // Index data.
        let indicesLines = [],
            indicesTris = [];


        // create 12 vertices of a icosahedron 
        createVerticesOfIcosahedron(vertices, normals);

        // create 20 triangles of the icosahedron
        createTrianglesOfIcosahedron(indicesTris, indicesLines);


        // refine triangles
        for (let i = 0; i < recursionDepth; i++) {
            let newTris = [];
            let newLines = [];

            for (let j = 0; j < indicesTris.length; j += 3) {
                // replace triangle by 4 triangles
                let v1 = getMiddlePoint(indicesTris[j], indicesTris[j + 1], vertices, normals),
                    v2 = getMiddlePoint(indicesTris[j + 1], indicesTris[j + 2], vertices, normals),
                    v3 = getMiddlePoint(indicesTris[j + 2], indicesTris[j], vertices, normals);

                addIndicesTris(newTris, newLines, { v1: indicesTris[j], v2: v1, v3: v3 });
                addIndicesTris(newTris, newLines, { v1: indicesTris[j + 1], v2: v2, v3: v1 });
                addIndicesTris(newTris, newLines, { v1: indicesTris[j + 2], v2: v3, v3: v2 });
                addIndicesTris(newTris, newLines, { v1: v1, v2: v2, v3: v3 });
            }

            indicesTris = newTris;
            indicesLines = newLines;
        }

        this.vertices = Float32Array.from(vertices);
        this.normals = Float32Array.from(normals);
        this.indicesLines = Uint16Array.from(indicesLines);
        this.indicesTris = Uint16Array.from(indicesTris);
    }

    function getMiddlePoint(_point1, _point2, vertices, normals) {

        // Calculate coordinates of mid.
        let middleX = (vertices[3 * _point1] + vertices[3 * _point2]) / 2.0;
        let middleY = (vertices[3 * _point1 + 1] + vertices[3 * _point2 + 1]) / 2.0;
        let middleZ = (vertices[3 * _point1 + 2] + vertices[3 * _point2 + 2]) / 2.0;

        // Return index if already saved.
        for (let i = 0; i < vertices.length; i += 3) {
            if ((vertices[i] === middleX) && (vertices[i + 1] === middleY) && (vertices[i + 2] === middleZ)) {
                return i / 3;
            }
        }
        return addVertex({ x: middleX, y: middleY, z: middleZ }, vertices, normals);
    }

    function addIndicesTris(_tris, _lines, _trisVertices) {
        // Add index data.
        _tris.push(
            _trisVertices.v1,
            _trisVertices.v2,
            _trisVertices.v3
        );
        _lines.push(
            _trisVertices.v1,
            _trisVertices.v2,
            _trisVertices.v2,
            _trisVertices.v3,
            _trisVertices.v3,
            _trisVertices.v1
        );
    }

    function addVertex(_vertex, vertices, normals) {
        let vertexLength = _calcVertexLengthForSphere({ vx: _vertex.x, vy: _vertex.y, vz: _vertex.z });

        let x = _vertex.x / vertexLength,
            y = _vertex.y / vertexLength,
            z = _vertex.z / vertexLength;

        // Set vertex positions for x, y, z
        vertices.push(x, y, z);
        // Set normals
        normals.push(x, y, z);

        //return index of current vertices
        return (vertices.length / 3) - 1;
    }

    function createVerticesOfIcosahedron(vertices, normals) {
        let t = (1.0 + Math.sqrt(5.0)) / 2.0;

        addVertex({ x: -1, y: t, z: 0 }, vertices, normals);
        addVertex({ x: 1, y: t, z: 0 }, vertices, normals);
        addVertex({ x: -1, y: -t, z: 0 }, vertices, normals);
        addVertex({ x: 1, y: -t, z: 0 }, vertices, normals);

        addVertex({ x: 0, y: -1, z: t }, vertices, normals);
        addVertex({ x: 0, y: 1, z: t }, vertices, normals);
        addVertex({ x: 0, y: -1, z: -t }, vertices, normals);
        addVertex({ x: 0, y: 1, z: -t }, vertices, normals);

        addVertex({ x: t, y: 0, z: -1 }, vertices, normals);
        addVertex({ x: t, y: 0, z: 1 }, vertices, normals);
        addVertex({ x: -t, y: 0, z: -1 }, vertices, normals);
        addVertex({ x: -t, y: 0, z: 1 }, vertices, normals);
    }

    function createTrianglesOfIcosahedron(indicesTris, indicesLines) {
        // 5 triangles around point 0
        addIndicesTris(indicesTris, indicesLines, { v1: 0, v2: 11, v3: 5 });
        addIndicesTris(indicesTris, indicesLines, { v1: 0, v2: 5, v3: 1 });
        addIndicesTris(indicesTris, indicesLines, { v1: 0, v2: 1, v3: 7 });
        addIndicesTris(indicesTris, indicesLines, { v1: 0, v2: 7, v3: 10 });
        addIndicesTris(indicesTris, indicesLines, { v1: 0, v2: 10, v3: 11 });

        // 5 adjacent triangles
        addIndicesTris(indicesTris, indicesLines, { v1: 1, v2: 5, v3: 9 });
        addIndicesTris(indicesTris, indicesLines, { v1: 5, v2: 11, v3: 4 });
        addIndicesTris(indicesTris, indicesLines, { v1: 11, v2: 10, v3: 2 });
        addIndicesTris(indicesTris, indicesLines, { v1: 10, v2: 7, v3: 6 });
        addIndicesTris(indicesTris, indicesLines, { v1: 7, v2: 1, v3: 8 });

        // 5 triangles around point 3
        addIndicesTris(indicesTris, indicesLines, { v1: 3, v2: 9, v3: 4 });
        addIndicesTris(indicesTris, indicesLines, { v1: 3, v2: 4, v3: 2 });
        addIndicesTris(indicesTris, indicesLines, { v1: 3, v2: 2, v3: 6 });
        addIndicesTris(indicesTris, indicesLines, { v1: 3, v2: 6, v3: 8 });
        addIndicesTris(indicesTris, indicesLines, { v1: 3, v2: 8, v3: 9 });

        // 5 adjacent triangles
        addIndicesTris(indicesTris, indicesLines, { v1: 4, v2: 9, v3: 5 });
        addIndicesTris(indicesTris, indicesLines, { v1: 2, v2: 4, v3: 11 });
        addIndicesTris(indicesTris, indicesLines, { v1: 6, v2: 2, v3: 10 });
        addIndicesTris(indicesTris, indicesLines, { v1: 8, v2: 6, v3: 7 });
        addIndicesTris(indicesTris, indicesLines, { v1: 9, v2: 8, v3: 1 });
    }


    return {
        createVertexData: createVertexData
    }

}());
export { name, sphere }

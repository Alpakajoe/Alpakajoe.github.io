var _calcVertexLengthForSphere = function(_positionsData) {
    let x = Math.pow(_positionsData.vx, 2),
        y = Math.pow(_positionsData.vy, 2),
        z = Math.pow(_positionsData.vz, 2);
    return Math.sqrt(x + y + z);
};

var _setPositionsArray = function(_positionsArray, _iVertex, _positionsData, _arrayLength) {
    _arrayLength ? _arrayLength : _arrayLength = 1;
    _positionsArray[_iVertex * 3] = _positionsData.px / _arrayLength;
    _positionsArray[_iVertex * 3 + 1] = _positionsData.py / _arrayLength;
    _positionsArray[_iVertex * 3 + 2] = _positionsData.pz / _arrayLength;
    //return _positionsArray;
};

var _setIndexLines = function(_iLines, _indicesLines, _iVertex, _m) {
    // Line on beam.
    _indicesLines[_iLines++] = _iVertex - 1;
    _indicesLines[_iLines++] = _iVertex;
    // Line on ring.
    _indicesLines[_iLines++] = _iVertex - (_m + 1);
    _indicesLines[_iLines++] = _iVertex;
    return _iLines;
};

var _setIndexTris = function(_iTris, _indicesTris, _iVertex, _m) {
    _indicesTris[_iTris++] = _iVertex;
    _indicesTris[_iTris++] = _iVertex - 1;
    _indicesTris[_iTris++] = _iVertex - (_m + 1);

    _indicesTris[_iTris++] = _iVertex - 1;
    _indicesTris[_iTris++] = _iVertex - (_m + 1) - 1;
    _indicesTris[_iTris++] = _iVertex - (_m + 1);

    return _iTris;
};

export { _setPositionsArray, _setIndexLines, _setIndexTris, _calcVertexLengthForSphere };
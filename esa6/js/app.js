import * as Torus from './models/torus.js';
import * as Sphere from './models/sphere.js'
import * as Plane from './models/plane.js';


window.onload = function() {
    app.start();
}

var app = (function() {
    let canvas;
    var gl;

    // The shader program object is also used to
    // store attribute and uniform locations.
    var prog;

    // Array of model objects.
    var models = [];
    let torusRotateMemory = [0,0,0];
    let orbitTranslate, torusRotate;

    // Model that is target for user input.
    var interactiveModel;
    let usedInteractiveModel = false;

    var camera = {
        // Initial position of the camera.
        eye: [0, 1, 4],
        // Point to look at.
        center: [0, 0, 0],
        // Roll and pitch of the camera.
        up: [0, 1, 0],
        // Opening angle given in radian.
        // radian = degree*2*PI/360.
        fovy: 60.0 * Math.PI / 180,
        // Camera near plane dimensions:
        // value for left right top bottom in projection.
        lrtb: 2.0,
        // View matrix.
        vMatrix: mat4.create(),
        // Projection matrix.
        pMatrix: mat4.create(),
        // Projection types: ortho, perspective, frustum.
        projectionType: "perspective",
        // Angle to X-Axis
        xAngle: -1.4,
        //xAngle: 0,
        // Angle to y-Axis
        //yAngle: 0,
        yAngle: 0.08726646259971647,
        // Angle to Z-Axis for c--amera when orbiting the center
        // given in radian.
        zAngle: 0,
        // Distance in XZ-Plane from center when orbiting.
        distance: 3,
    };

    function start() {
        init();
        render();
    }

    function init() {
        initWebGL();
        initShaderProgram();
        initUniforms()
        initModels();
        initEventHandler();
        initPipline();
    }

    function initWebGL() {
        // Get canvas and WebGL context.
        canvas = document.getElementById('canvas');
        gl = canvas.getContext('experimental-webgl');
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    }

    function initPipline() {
        gl.clearColor(0.22, 0.22, 0.22, 1);

        // Backface culling.
        gl.frontFace(gl.CCW);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        // Depth(Z)-Buffer.
        gl.enable(gl.DEPTH_TEST);

        // Polygon offset of rastered Fragments.
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(0.5, 0);

        // Set viewport.
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

        // Init camera.
        // Set projection aspect ratio.
        camera.aspect = gl.viewportWidth / gl.viewportHeight;
    }

    function initShaderProgram() {
        // Init vertex shader.
        var vs = initShader(gl.VERTEX_SHADER, "vertexshader");
        // Init fragment shader.
        var fs = initShader(gl.FRAGMENT_SHADER, "fragmentshader");
        // Link shader into a shader program.
        prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.bindAttribLocation(prog, 0, "aPosition");
        gl.linkProgram(prog);
        gl.useProgram(prog);
    }

    function initShader(shaderType, SourceTagId) {
        var shader = gl.createShader(shaderType);
        var shaderSource = document.getElementById(SourceTagId).text;
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(SourceTagId + ": " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    function initUniforms() {
        // Projection Matrix.
        prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");

        // Model-View-Matrix.
        prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");

        // Normals
        prog.nMatrixUniform = gl.getUniformLocation(prog, "uNMatrix");

        prog.colorUniform = gl.getUniformLocation(prog, "uColor");
    }
    const fill = "fill",
        fillwireframe = "fillwireframe",
        wireframe = "wireframe";

    let torus = {
        type: Torus,
        fillstyle: fill,
        color: [205 / 255, 220 / 255, 57 / 255, 1],
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        scale: [0.7, 0.7, 0.4]
    };

    let plane = {
        type: Plane,
        fillstyle: wireframe,
        color: [0, 0, 0, 0.25],
        translate: [0, -0.8, 0],
        rotate: [0, 0, 0],
        scale: [1, 1, 1]
    };
    let spheres = {
        0: {
            type: Sphere,
            fillstyle: fillwireframe,
            color: [48/255, 63/255, 159/255, 1],
            translate: [1.9696155060244163 + 2, 0.34729635533386005, 0.030384493975583737],
            rotate: [0, 180, 270],
            scale: [0.3, 0.3, 0.3]
        },
        1: {
            type: Sphere,
            fillstyle: fillwireframe,
            color: [0.8, 0.6, 0, 1],
            translate: [1.6527036446661394, 1.969615506024416, 1.969615506024416],
            rotate: [120, 0, 270],
            scale: [0.254, 0.254, 0.254]
        },
        2: {
            type: Sphere,
            fillstyle: fillwireframe,
            color: [0, 0.7, 0.9, 1],
            translate: [0.030384493975583737, -0.34729635533386005, -0.34729635533386005],
            rotate: [20, 120, 200],
            scale: [0.13, 0.13, 0.13]
        },
        3: {
            type: Sphere,
            fillstyle: fillwireframe,
            color: [0.5, 0.1, 0.37, 1],
            translate: [2.34729635533386, -1.9696155060244163, -1.9696155060244163],
            rotate: [120, 0, 270],
            scale: [0.1, 0.1, 0.1]
        },
    };

    function setTranslate(_object, _model) {
        _object.translate = _model.translate
    }

    function setRotate(_object, _model) {
        _object.rotate = _model.rotate
    }
    function initModels() {
        if (models.length > 0) {
            setTranslate(torus, models[0]);
            setRotate(torus, models[0]);
            for (let idx in spheres) {
                let modelID = parseInt(idx) + 2;
                setTranslate(spheres[idx], models[modelID]);
                setRotate(spheres[idx], models[modelID]);
            };
        }
        models = [];

        createModel(Torus, torus.fillstyle, torus.color, torus.translate, torus.rotate, torus.scale);
        createModel(Plane, plane.fillstyle, plane.color, plane.translate, plane.rotate, plane.scale);
        for (let idx in spheres) {
            createModel(spheres[idx].type, spheres[idx].fillstyle,
                spheres[idx].color, spheres[idx].translate, spheres[idx].rotate, spheres[idx].scale);
        };

        interactiveModel = models[0];
    }

    function createModel(geometryname, fillstyle, color, translate, rotate, scale) {
        var model = {};
        model.fillstyle = fillstyle;
        model.color = color;
        initDataAndBuffers(model, geometryname);
        initTransformations(model, translate, rotate, scale);

        models.push(model);
    }

    function initTransformations(model, translate, rotate, scale) {
        // Store transformation vectors.
        model.translate = translate;
        model.rotate = rotate;
        model.scale = scale;

        // Create and initialize Model-Matrix.
        model.mMatrix = mat4.create();

        // Create and initialize Model-View-Matrix.
        model.mvMatrix = mat4.create();

        // Create and initialize Normals-Matrix.
        model.nMatrix = mat3.create();
    }

    /**
     * Init data and buffers for model object.
     * 
     * @parameter model: a model object to augment with data.
     * @parameter geometryname: string with name of geometry.
     */
    function initDataAndBuffers(model, geometry) {
        geometry[geometry.name].createVertexData.apply(model);
        model.name = geometry.name;

        // Setup position vertex buffer object.
        model.vboPos = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
        gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
        // Bind vertex buffer to attribute variable.
        prog.positionAttrib = gl.getAttribLocation(prog, 'aPosition');
        gl.enableVertexAttribArray(prog.positionAttrib);

        // Setup normal vertex buffer object.
        model.vboNormal = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
        gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);
        // Bind buffer to attribute variable.
        prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
        gl.enableVertexAttribArray(prog.normalAttrib);

        // Setup lines index buffer object.
        model.iboLines = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines,
            gl.STATIC_DRAW);
        model.iboLines.numberOfElements = model.indicesLines.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        // Setup triangle index buffer object.
        model.iboTris = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris,
            gl.STATIC_DRAW);
        model.iboTris.numberOfElements = model.indicesTris.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    function stopEvent(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function changeRecursiveDepthValue(currentRecursionDepth, ifIncrease) {
        let inputVal = currentRecursionDepth.value;
        if (ifIncrease && inputVal != currentRecursionDepth.max) {
            currentRecursionDepth.value = ++inputVal; 
        } else if (!ifIncrease && inputVal != currentRecursionDepth.min) {
            currentRecursionDepth.value = --inputVal;
        }
        start();
    }
    function initEventHandler() {
        // Rotation step.
        let deltaRotate = Math.PI / 36;
        let deltaTranslate = 0.05;

        const degree_90 = Math.PI / 2,
            degree_270 = Math.PI * 1.5,
            degree_360 = Math.PI * 2;

        if (!orbitTranslate) {
            orbitTranslate = deltaRotate * 2;
            torusRotate = orbitTranslate;
        }
        const r = 2;


        function selfRotatingModel(_model, _factor, _sign, _torusRotate) {
            let rotate = _factor * _sign * _torusRotate;
            _model.rotate[0] += rotate;
            _model.rotate[1] += rotate;
            _model.rotate[2] -= rotate;
        }

        const recursionDepth = document.getElementById("recursionDepth");
        const increaseBtn = document.getElementById("increaseBtn");
        const decreaseBtn = document.getElementById("decreaseBtn");

        function rememberedTorus() {
            const x = models[0].rotate[0];
            const y = models[0].rotate[1];
            const z = models[0].rotate[2];
            usedInteractiveModel = true;
            torusRotateMemory[0] = x;
            torusRotateMemory[1] = y;
            torusRotateMemory[2] = z;
        }
        window.onkeydown = function(event) {
            const key = event.code ? event.code : event.key; //event.which and event.keyCode are deprecated

            const camera_yPos_w = Math.abs(camera.yAngle + deltaRotate),
                camera_yPos_s = Math.abs(camera.yAngle - deltaRotate);

            // Use shift key to change sign.
            var sign = event.shiftKey ? -1 : 1;

            // Rotate interactive Model.
            switch (key) {
                case 'KeyX':
                    if (!usedInteractiveModel) rememberedTorus();
                    interactiveModel.rotate[0] += sign * deltaRotate;
                    break;
                case 'KeyZ':
                    if (!usedInteractiveModel) rememberedTorus();                
                    interactiveModel.rotate[1] += sign * deltaRotate;
                    break;
                case 'KeyY':
                    if (!usedInteractiveModel) rememberedTorus();                   
                    interactiveModel.rotate[2] += sign * deltaRotate;
                    break;
                case 'KeyK':
                    if (usedInteractiveModel) {
                        usedInteractiveModel = false;
                        models[0].rotate = torusRotateMemory;
                        torusRotateMemory = [];
                    }
                    orbitTranslate += sign * deltaRotate;

                    selfRotatingModel(models[0], 1, sign, torusRotate);

                    for (let i = 2; i < models.length; i++) {
                        let radian = orbitTranslate + (i - 2) * degree_90;
                        models[i].translate[0] = Math.cos(radian) * r + r;
                        models[i].translate[1] = Math.sin(radian) * r;
                        models[i].translate[2] = Math.sin(radian) * r;

                        selfRotatingModel(models[i], 1, sign, torusRotate);
                    }
                    break;
            }


            // View transformation with lookAt
            switch (key) {
                case "ArrowUp":
                    if (
                        camera_yPos_w <= degree_90 ||
                        (camera_yPos_w < degree_360 && camera_yPos_w > degree_270)
                    ) {
                        camera.up = [0, 1, 0];
                    } else if (camera_yPos_w < degree_270 && camera_yPos_w > degree_90) {
                        camera.up = [0, -1, 0];
                    } else {
                        //console.log(camera_yPos_w, deltaRotate, degree_360, degree_270, degree_90);
                        camera.yAngle = 0;
                    }
                    camera.yAngle += deltaRotate;
                    break;
                case "ArrowLeft":
                    camera.xAngle -= deltaRotate;
                    break;
                case "ArrowDown":
                    if (
                        camera_yPos_s <= degree_90 ||
                        (camera_yPos_s < degree_360 && camera_yPos_s > degree_270)
                    ) {
                        camera.up = [0, 1, 0];
                    } else if (camera_yPos_s < degree_270 && camera_yPos_s > degree_90) {
                        camera.up = [0, -1, 0];
                    } else {
                        //console.log(camera_yPos_s, deltaRotate, degree_360, degree_270, degree_90);
                        camera.yAngle = 0;
                    }
                    camera.yAngle -= deltaRotate;
                    break;
                case "ArrowRight":
                    camera.xAngle += deltaRotate;
                    break;
            }

            // Change projection of scene.
            switch (key) {
                case "KeyO":
                    camera.projectionType = "ortho";
                    camera.lrtb = 2;
                    break;
                case "KeyF":
                    camera.projectionType = "frustum";
                    camera.lrtb = 1.2;
                    break;
                case "KeyP":
                    camera.projectionType = "perspective";
                    break;
            }

            // Camera move and orbit.
            switch (key) {
                case "KeyA":
					camera.eye[0] += - 1 * deltaTranslate;
					camera.center[0] += - 1 * deltaTranslate;
                    break;
				case "KeyD":
					camera.eye[0] += 1 * deltaTranslate;
					camera.center[0] += 1 * deltaTranslate;
                    break;
                case"KeyW":
					camera.eye[1] += 1 * deltaTranslate;
					camera.center[1] += 1 * deltaTranslate;
                    break;
                case "KeyS":
                    camera.eye[1] += - 1 * deltaTranslate;
					camera.center[1] += - 1 * deltaTranslate;
                    break;           
                case "NumpadSubtract":
                case "Slash":
                    // Camera fovy in radian.
                    camera.fovy += sign * 5 * Math.PI / 180;
                    break;
                case "NumpadAdd":
                case "BracketRight":
                    // Camera fovy in radian.
                    camera.fovy -= sign * 5 * Math.PI / 180;
                    break;
                case "Shift":
                    if (camera.eye[1] > .84 || !cameraLocked) {
                    camera.eye[1] += -1 * deltaTranslate;
                    }
                    //console.log(camera.eye[1]);
                    break;
            }
            render();
        };

        increaseBtn.addEventListener('click', event => {
            //console.log("increase");
            stopEvent(event);
            changeRecursiveDepthValue(recursionDepth, true);
        }, false);

        decreaseBtn.addEventListener('click', event => {
            //console.log("decrease");
            stopEvent(event);
            changeRecursiveDepthValue(recursionDepth, false);
        }, false);
        // ### End: ESA05 
    }

    /**
     * Run the rendering pipeline.
     */
    function render() {
        // Clear framebuffer and depth-/z-buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        setProjection();
        calculateCameraOrbit();

        // Set view matrix depending on camera.
        mat4.lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

        // Loop over models.
        for (var i = 0; i < models.length; i++) {
            // Update modelview for model.
            updateTransformations(models[i]);

            // Set uniforms for model.
            gl.uniformMatrix4fv(prog.mvMatrixUniform, false,
                models[i].mvMatrix);
            gl.uniform4fv(prog.colorUniform, models[i].color);
            // Set uniforms for nomals
            gl.uniformMatrix3fv(prog.nMatrixUniform, false,
                models[i].nMatrix);

            draw(models[i]);
        }
    }

    function calculateCameraOrbit() {
        var x = 0,
            y = 1,
            z = 2;

        camera.eye[x] = camera.center[x];
        camera.eye[y] = camera.center[y];
        camera.eye[z] = camera.center[z];

        camera.eye[x] +=
            camera.distance * Math.sin(camera.xAngle) * Math.cos(camera.yAngle);
        camera.eye[y] += camera.distance * Math.sin(camera.yAngle);
        camera.eye[z] +=
            camera.distance * Math.cos(camera.xAngle) * Math.cos(camera.yAngle);
    }

    function setProjection() {
        // Set projection Matrix.
        switch (camera.projectionType) {
            case ("ortho"):
                var v = camera.lrtb;
                mat4.ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
                break;
            case ("frustum"):
                var v = camera.lrtb;
                mat4.frustum(camera.pMatrix, -v / 2, v / 2, -v / 2, v / 2, 1, 10);
                break;
            case ("perspective"):
                mat4.perspective(camera.pMatrix, camera.fovy,
                    camera.aspect, 1, 10);
                break;
        }
        // Set projection uniform.
        gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
    }

    /**
     * Update model-view matrix for model.
     */
    function updateTransformations(model) {

        // Use shortcut variables.
        var mMatrix = model.mMatrix;
        var mvMatrix = model.mvMatrix;

        // Reset matrices to identity.         
        mat4.identity(mMatrix);
        mat4.identity(mvMatrix);

        // Translate.
        mat4.translate(mMatrix, mMatrix, model.translate);
        // Rotate.
        mat4.rotateX(mMatrix, mMatrix, model.rotate[0]);
        mat4.rotateY(mMatrix, mMatrix, model.rotate[1]);
        mat4.rotateZ(mMatrix, mMatrix, model.rotate[2]);
        // Scale
        mat4.scale(mMatrix, mMatrix, model.scale);

        // Combine view and model matrix
        // by matrix multiplication to mvMatrix.        
        mat4.multiply(mvMatrix, camera.vMatrix, mMatrix);

        // Calculate normal matrix from model-view matrix.
        mat3.normalFromMat4(model.nMatrix, mvMatrix);

    }

    function draw(model) {
        // Setup position VBO.
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
        gl.vertexAttribPointer(prog.positionAttrib, 3, gl.FLOAT, false,
            0, 0);

        // Setup normal VBO.
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
        gl.vertexAttribPointer(prog.normalAttrib, 3, gl.FLOAT, false, 0, 0);

        // Setup rendering tris.
        var fill = (model.fillstyle.search(/fill/) != -1);
        if (fill) {
            gl.enableVertexAttribArray(prog.normalAttrib);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
            gl.drawElements(gl.TRIANGLES, model.iboTris.numberOfElements,
                gl.UNSIGNED_SHORT, 0);
        }

        // Setup rendering lines.
        var wireframe = (model.fillstyle.search(/wireframe/) != -1);
        if (wireframe) {
            gl.disableVertexAttribArray(prog.normalAttrib);
            gl.vertexAttrib3f(prog.normalAttrib, 0, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
            gl.drawElements(gl.LINES, model.iboLines.numberOfElements,
                gl.UNSIGNED_SHORT, 0);
        }
    }

    // App interface.
    return {
        start: start
    }

}());

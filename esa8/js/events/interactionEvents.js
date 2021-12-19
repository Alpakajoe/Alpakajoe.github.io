/*jslint devel: true*/
"use strict";

// ### Start: ESA08

var _moveTwoLightsOnOrbit = function (_key,_lights, _deltaTranslateLight,_deltaRotate,_radius) {
    switch (_key) {
        
        case ('KeyL'):              
            /*console.log("vorher");
            console.log(_lights[0].position[0], _lights[0].position[2])
            console.log(_lights[1].position[0], _lights[1].position[2])*/

            _deltaTranslateLight += _deltaRotate;
            _lights[0].position[0] = Math.cos(_deltaTranslateLight) * _radius;
            _lights[0].position[2] = Math.sin(_deltaTranslateLight) * _radius;
            _lights[1].position[0] = Math.cos(Math.PI + _deltaTranslateLight) * _radius;
            _lights[1].position[2] = Math.sin(Math.PI + _deltaTranslateLight) * _radius;

            /*console.log("nachher differenz");
            console.log(_lights[0].position[0], _lights[0].position[2])
            console.log(_lights[1].position[0], _lights[1].position[2])*/
            
            break;
    }

    return _deltaTranslateLight;
};
// ### End: ESA08 Lichter auf Kreisbahn

var _rotateInteractiveModel = function (_key, _model, _value) {
    switch (_key) {
        case ('KeyX'):
            _model.rotate[0] += _value;
            break;
        case ('KeyY'):
            _model.rotate[1] += _value;
            break;
        case ('KeyZ'):
            _model.rotate[2] += _value;
            break;
    }
};

var _scaleInteractiveModel = function (_key, _model, _value) {
    switch (_key) {
        case ('KeyS'):
            _model.scale[0] *= 1 + _value;
            _model.scale[1] *= 1 - _value;
            _model.scale[2] *= 1 + _value;
            break;
    }
};

var _changeSceneProjection = function (_key, _camera) {
    switch (_key) {
        case ('KeyO'):
            _camera.projectionType = "ortho";
            _camera.lrtb = 2;
            break;
        case ('KeyF'):
            _camera.projectionType = "frustum";
            _camera.lrtb = 1.2;
            break;
        case ('KeyP'):
            _camera.projectionType = "perspective";
            break;
    }
};

var _moveCameraAndOrbit = function (_key, _camera,
    _rotate,
    _translate,
    _fovy,
    _lrtb) {
    // Camera move and orbit.
    switch (_key) {
        case "KeyC":
            // Orbit camera.
            _camera.zAngle += _rotate;
            break;
        case "KeyH":
            // Move camera up and down.
            _camera.eye[1] += _translate;
            break;
        case "KeyM":
            // Camera distance to center.
            _camera.distance -= _translate;
            break;
        case "Slash":
        case "NumpadSubtract":
            // Camera fovy in radian.
            _camera.fovy += _fovy;
            break;
        case "BracketRight":
        case "NumpadAdd":
            // Camera fovy in radian.
            _camera.fovy -= _fovy;
            break;
        case "KeyB":
            // Camera near plane dimensions.
            _camera.lrtb += _lrtb;
            break;
    }
};


var _rotateCamera = function (_key, _camera, _deltaRotate) {
    const degree_90 = Math.PI / 2,
        degree_270 = Math.PI * 1.5,
        degree_360 = Math.PI * 2;

    const camera_yPos_w = Math.abs(_camera.yAngle + _deltaRotate),
        camera_yPos_s = Math.abs(_camera.yAngle - _deltaRotate);

    switch (_key) {
        case "KeyW":
            if (
                camera_yPos_w <= degree_90 ||
                (camera_yPos_w < degree_360 && camera_yPos_w > degree_270)
            ) {
                _camera.up = [0, 1, 0];
            } else if (camera_yPos_w < degree_270 && camera_yPos_w > degree_90) {
                _camera.up = [0, -1, 0];
            } else {
                _camera.yAngle = 0;
            }
            _camera.yAngle += _deltaRotate;
            break;
        case "KeyA":
            _camera.xAngle -= _deltaRotate;
            break;
        case "KeyS":
            if (
                camera_yPos_s <= degree_90 ||
                (camera_yPos_s < degree_360 && camera_yPos_s > degree_270)
            ) {
                _camera.up = [0, 1, 0];
            } else if (camera_yPos_s < degree_270 && camera_yPos_s > degree_90) {
                _camera.up = [0, -1, 0];
            } else {
                //console.log(camera_yPos_s, deltaRotate, degree_360, degree_270, degree_90);
                _camera.yAngle = 0;
            }
            _camera.yAngle -= _deltaRotate;
            break;
        case "KeyD":
            _camera.xAngle += _deltaRotate;
            break;
    }
};

var addEvent = function (el, eventType, handler) {
    //console.log("addEvent");
    if (el.addEventListener) { // DOM Level 2 browsers
        el.addEventListener(eventType, handler, false);
    } else if (el.attachEvent) { // IE <= 8
        el.attachEvent('on' + eventType, handler);
    } else { // ancient browsers
        el['on' + eventType] = handler;
    }
};

var _goToURL = function (_id, _url) {
    //console.log("goToUrl",_id,_url);
    addEvent(_id, 'click', function () {
        window.location.href = _url;
    });
};

export { _goToURL,_moveTwoLightsOnOrbit,_rotateInteractiveModel, _scaleInteractiveModel, _changeSceneProjection, _moveCameraAndOrbit, _rotateCamera };


window.onload = () => {
    let flowerDegree = 0;
    let rotatingInterval;
    const imageArray = [];
    const flower = document.getElementById('flower');
  
    // to choose the correct image, the angle/step will increase 
    const getFlowerPath = (angle) => (`resources/flower-${angle}-degree.png`);

    // function to load all images to avoid stagnation 
    function loadImages() {
        for (let i = 0; i < 10; i++) {
            let image = new Image();
            image.src = getFlowerPath(i*36);
            imageArray.push(image);
        }
    }
    loadImages();

    const stopRotation = () => {
        clearInterval(rotatingInterval);
        rotatingInterval = undefined;
    };

    const rotateImage = (clockwise) => {
        if (clockwise) {
            rotationAngle += 36;
            if (rotationAngle >= 360) {
                rotationAngle = rotationAngle - 360;
            }
            flower.setAttribute('src', getFlowerPath(rotationAngle));
            return;
        }
        rotationAngle -= 36;
            if (rotationAngle < 0) {
                rotationAngle = rotationAngle + 360;
            }
        flower.setAttribute('src', getFlowerPath(rotationAngle));
    };

    const rotateContinuosly = () => {
        rotatingInterval = setInterval(() => {
            rotateImage(true);
        }, 80);
    }

    window.onkeydown = ((event) => {
        if (event.key === 'f') {
            if (!rotatingInterval) {
                rotateContinuosly();
                return;
            }
            stopRotation();
            return;
        }
        if (event.key === 'r') {
          rotateImage(true);
          return;
        }    
        if (event.key === 'l') {
          rotateImage(false);
        }
      });
} 
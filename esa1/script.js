window.onload = () => {
    let rotationAngle = 0;
    let rotationInterval;
    let characterAnimationStep = 1;
    const imageArray = [];
    const moon = document.getElementById('moon');
    const character = document.getElementById('character');
  
    const getMoonImagePath = (angle) => (`resources/moon-${angle}-degree.png`);
    const getCharacterImagePath = (step) => (`resources/character-${step}.png`);

    function loadImages() {
        for (let i = 0; i < 30; i++) {
            let image = new Image();
            image.src = getMoonImagePath(i*12);
            imageArray.push(image);
        }
    }

    loadImages();

    setInterval(() => {
        character.setAttribute('src', getCharacterImagePath(characterAnimationStep));
        characterAnimationStep === 16 ? characterAnimationStep = 1 : characterAnimationStep++;
    }, 200);

    const stopRotation = () => {
        clearInterval(rotationInterval);
        rotationInterval = undefined;
    };

    const rotate = (clockwise) => {
        if (clockwise) {
            rotationAngle += 12;
            if (rotationAngle >= 360) {
                rotationAngle = rotationAngle - 360;
            }
            moon.setAttribute('src', getMoonImagePath(rotationAngle));
            return;
        }
        rotationAngle -= 12;
            if (rotationAngle < 0) {
                rotationAngle = rotationAngle + 360;
            }
        moon.setAttribute('src', getMoonImagePath(rotationAngle));
    };

    const continuousRotation = () => {
        rotationInterval = setInterval(() => {
            rotate(true);
        }, 80);
    }

    window.onkeydown = ((event) => {
        if (event.key === 'c') {
            if (!rotationInterval) {
                continuousRotation();
                return;
            }

            stopRotation();
            return;
        }

        if (event.key === 'r') {
          rotate(true);
          return;
        }
    
        if (event.key === 'l') {
          rotate(false);
        }
      });
} 
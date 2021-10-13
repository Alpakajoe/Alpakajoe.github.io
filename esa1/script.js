window.onload = () => {
    let angle = 0;    
    let interval;    
    const maxDegree = 360;
    let degree = maxDegree/10;
    const flower = document.getElementById('flower');  
    const getFlowerPath = (angle) => (`resources/flower_degree/flower-${angle}.png`);
   
    const rotate = (clockwise) => {
        if (clockwise) {
            angle += degree;
            if (angle >= maxDegree) {
                angle = angle - maxDegree;
            }
            flower.setAttribute('src', getFlowerPath(angle));
            return;
        }
        angle -= degree;
            if (angle < 0) {
                angle = angle + maxDegree;
            }
        flower.setAttribute('src', getFlowerPath(angle));
    };

    const stopRotation = () => {
        clearInterval(interval);
        interval = undefined;
    };
    
    const continuousRotation = () => {
        interval = setInterval(() => {
            rotate(true);
        }, 100);
    }

    window.onkeydown = ((event) => {
        if (event.key === 'a') {
            if (!interval) {
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
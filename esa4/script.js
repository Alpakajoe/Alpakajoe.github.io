window.onload = () => {

  let linesBtn = document.getElementById("linesBtn");
  addEvent(linesBtn, 'click', function() {
      window.location.href = "index.html";
  });

  let colorBtn = document.getElementById("colorBtn");
  addEvent(colorBtn, 'click', function() {
      window.location.href = "color.html";
  });

  let ownBtn = document.getElementById("ownBtn");
  addEvent(ownBtn, 'click', function() {
      window.location.href = "own.html";
});


function addEvent(el, eventType, handler) {
  if (el.addEventListener) { 
      el.addEventListener(eventType, handler, false);
  } else if (el.attachEvent) { 
      el.attachEvent('on' + eventType, handler);
  } else { 
      el['on' + eventType] = handler;
  }
}
}

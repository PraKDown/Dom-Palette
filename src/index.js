window.onload = function () {
  let action;
  const bucket = document.querySelector(".bucket");
  const picker = document.querySelector(".picker");
  const move = document.querySelector(".move");
  const transform = document.querySelector(".transform");
  const elems = document.querySelectorAll(".elem");
  const body = document.querySelector("body");
  const save = document.querySelector(".save");
  const load = document.querySelector(".load");
  const previos = document.querySelector(".prev");
  const current = document.querySelector(".cur");
  let zIndex = 1;
  const LEFT_CANVAS_BORDER = 10;
  const RIGHT_CANVAS_BORDER = 190;
  
  function paintBucket() {
    action = "paintBucket";
    body.style.cursor = "url('./palette/bucket.webp'), auto";
  }

  function chooseColor() {
    action = "chooseColor";
    body.style.cursor = "url('./palette/color-picker.webp'), auto";
  }

  function moveAction() {
    action = "moveAction";
    body.style.cursor = "url('./palette/move.webp'), auto";
  }

  function transformation() {
    action = "transformation";
    body.style.cursor = "url('./palette/transform.webp'), auto";
  }

  function loadChanges() {
    elems.forEach((elem, index) => {
      let keyOfStorage = "check" + index;
      let style = JSON.parse(localStorage.getItem(keyOfStorage));
      for (let key in style) {
        elem.style[key] = style[key];
      }
    })
    body.style.cursor = "auto";
  }

  function saveChanges() {
    elems.forEach((elem, index) => {
      let keyOfStorage = "check" + index;
      localStorage.removeItem(keyOfStorage);
      localStorage.setItem(keyOfStorage, JSON.stringify(elem.style));  
    })
    body.style.cursor = "auto";
  }

  document.addEventListener("keydown", event => {
    switch (event.keyCode) {
      case 80:
        paintBucket();
        break;
      case 67:
        chooseColor();
        break;
      case 77:
        moveAction();
        break;
      case 84:
        transformation();
        break;
      case 83:
        saveChanges();
        break;
      case 76:
        loadChanges();
        break;
      default:
        break;
    }
  });

  bucket.addEventListener("click", paintBucket);

  picker.addEventListener("click", chooseColor);

  move.addEventListener("click", moveAction);

  transform.addEventListener("click", transformation);

  elems.forEach((elem) => {
    elem.addEventListener('click' , function () {
      switch (action) {
        case "paintBucket":
          elem.style.backgroundColor = current.style.backgroundColor;
          break;
        case "transformation":
          if (elem.style.borderRadius === "100%") elem.style.borderRadius = "";
          else elem.style.borderRadius = "100%";
          break;
        default:
          break;
      }
    } ) ; 
  })

  body.addEventListener("click", (event) => {
    if (action === "chooseColor") {
      previos.style.backgroundColor = current.style.backgroundColor;
      current.style.backgroundColor = window.getComputedStyle(event.target).backgroundColor;
    } 
  });

  function moveAt(e , elem) {
    elem.style.left = e.pageX - elem.offsetWidth / 2 + 'px';
    elem.style.top = e.pageY - elem.offsetHeight / 2 + 'px';
  }

  elems.forEach((elem, index) => {
    elem.onmousedown = function(e) {
      if (action === "moveAction") {
        let x1 = Number(elem.style.left.split("px")[0]);
        let y1 = Number(elem.style.top.split("px")[0]);
        moveAt(e, elem);
        elem.style.zIndex = ++zIndex; 
        document.onmousemove = function(e) {
          moveAt(e, elem);
        }
        elem.onmouseup = function(e) {
          elems.forEach((elem2, index2) => {
            if (index != index2) {
              let x2 = +elem2.style.left.split("px")[0];
              let y2 = +elem2.style.top.split("px")[0];
              const IS_X_INSIDE_CANVAS = e.pageX > x2 + LEFT_CANVAS_BORDER &&  e.pageX < x2 + RIGHT_CANVAS_BORDER;
              const IS_Y_INSIDE_CANVAS = e.pageY > y2 + LEFT_CANVAS_BORDER && e.pageY < y2 + RIGHT_CANVAS_BORDER;

              if (IS_X_INSIDE_CANVAS && IS_Y_INSIDE_CANVAS) {
                elem2.style.left = x1 + "px";
                elem2.style.top = y1 + "px";
              }
            }
          })
          document.onmousemove = null;
          elem.onmouseup = null;
        }
      }
    }
    elem.ondragstart = function() {
      return false;
    }; 
  })

  save.addEventListener("click", saveChanges)

  load.addEventListener("click", loadChanges)

}
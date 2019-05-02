window.onload = function () {
  let action = undefined;
  let bucket = document.querySelector(".bucket");
  let picker = document.querySelector(".picker");
  let move = document.querySelector(".move");
  let transform = document.querySelector(".transform");
  let elems = document.querySelectorAll(".elem");
  let body = document.querySelector("body");
  let save = document.querySelector(".save");
  let load = document.querySelector(".load");
  let zind = 1;
  
  function buck() {
    action = 1;
    body.style.cursor = "url('./palette/bucket.webp'), auto";
  }

  function pick() {
    action = 2;
    body.style.cursor = "url('./palette/color-picker.webp'), auto";
  }

  function mo() {
    action = 3;
    body.style.cursor = "url('./palette/move.webp'), auto";
  }

  function trans() {
    action = 4;
    body.style.cursor = "url('./palette/transform.webp'), auto";
  }

  function lo() {
    for (let i = 0; i < elems.length; i++) {
      let m = "check" + i;
      let styl = JSON.parse(localStorage.getItem(m));
      for (let key in styl) {
        elems[i].style[key] = styl[key];
      }
    }
    body.style.cursor = "auto";
  }

  function sa() {
    for (let i = 0; i < elems.length; i++) {
      let m = "check" + i;
      localStorage.removeItem(m);
      localStorage.setItem(m, JSON.stringify(elems[i].style));  
    }
    body.style.cursor = "auto";
  }

  document.addEventListener("keydown", event => {
    switch (event.keyCode) {
      case 80:
        buck();
        break;
      case 67:
        pick();
        break;
      case 77:
        mo();
        break;
      case 84:
        trans();
        break;
      case 83:
        sa();
        break;
      case 76:
        lo();
        break;
      default:
        break;
    }
  });

  bucket.addEventListener("click", buck);

  picker.addEventListener("click", pick);

  move.addEventListener("click", mo);

  transform.addEventListener("click", trans);

  for (let i = 0 ; i < elems.length; i++) {
    let el = elems[i];
    el.addEventListener('click' , function () {
      switch (action) {
        case 1:
          el.style.backgroundColor = document.querySelectorAll(".car")[0].style.backgroundColor;
          break;
        case 4:
          if (el.style.borderRadius === "100%") el.style.borderRadius = "";
          else el.style.borderRadius = "100%";
          break;
        default:
          break;
      }
    } ) ; 
  }

  body.addEventListener("click", (event) => {
    if (action === 2) {
      document.querySelectorAll(".prev")[0].style.backgroundColor = document.querySelectorAll(".car")[0].style.backgroundColor
      document.querySelectorAll(".car")[0].style.backgroundColor = window.getComputedStyle(event.target).backgroundColor
    } 
  });

  function moveAt(e , elem) {
    elem.style.left = e.pageX - elem.offsetWidth / 2 + 'px';
    elem.style.top = e.pageY - elem.offsetHeight / 2 + 'px';
  }


  for (let i = 0 ; i < elems.length; i++) {
    elems[i].onmousedown = function(e) {
      if (action === 3) {
        let x1 = Number(elems[i].style.left.split("px")[0]);
        let y1 = Number(elems[i].style.top.split("px")[0]);
        moveAt(e, elems[i]);
        elems[i].style.zIndex = ++zind; 
        document.onmousemove = function(e) {
          moveAt(e, elems[i]);
        }
        elems[i].onmouseup = function(e) {
          for (let j = 0; j < elems.length; j++) {
            if (j != i) {
              let x2 = Number(elems[j].style.left.split("px")[0]);
              let y2 = Number(elems[j].style.top.split("px")[0]);

              if (e.pageX > x2 + 10 && e.pageX < x2 + 190 && e.pageY > y2 + 10 && e.pageY < y2 + 190) {
                elems[j].style.left = x1 + "px";
                elems[j].style.top = y1 + "px";
                break;
              }
            }
          }

          document.onmousemove = null;
          elems[i].onmouseup = null;
        }
      }
    }
    elems[i].ondragstart = function() {
      return false;
    }; 
  }

  save.addEventListener("click", sa)

  load.addEventListener("click", lo)

}
function clear () {
  ctx.clearRect(0,0, canvas.width, canvas.height);
}


function draw_fps () {
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.font = "12px Open Sans Condensed";
  ctx.fillText(`fps: ${fps_view}`, canvas.width - 25, 25);
}


function generate_grounds (ct = 10) {
  let sgr = [];
  for (let i = 0; i < ct; i++) {
    let x = 170 * i;
    let ground = addSprite('media/image/ground/ground.png', x, yground, 170, 90, true);
    sgr.push(ground);
  }
  return sgr;
}

function generate_apples (grounds) {
  let apples = [];
  let ap = 0; // Кол-во яблок в чанке
  let ma = 2; // Максимум яблок в чанке
  let ox = 0; // пропущенно px камней

  for (let i = 0; i < grounds.length; i++) {
    if (ap < ma) {
      let xs = grounds[i].x + 45 + rand(-30, 30);
      let ys = grounds[i].y - 13;
      let apple = addSprite('media/image/apple/apple.png', xs, ys, 15, 15, true);
      apples.push(apple);
      ap++;
    } else {
      if (ox < chunk_size) {
        ox += grounds[i].x;
      } else {
        ox = 0;
        ap = 0;
      }
    }
  }
  return apples;
}


function generate_fly_grounds (ct = 10) {
  let sgr = [];
  let x = 300;
  let y = 400;
  for (let i = 0; i < ct; i++) {
    let dipX = rand(-50, 50);
    let dipY = rand(-69, 69);
    x += 200 + dipX;
    let gr = addSprite('media/image/ground/fly-ground.png', x, y + dipY, 90, 25, true);
    gr.collision.draw = false;
    gr.collision.x = 3;
    gr.collision.y = -10;
    gr.collision.w = 85;
    gr.collision.h = 10;
    gr.collision.color = "darkBlue";
    sgr.push(gr);
  }
  return sgr;
}

function spawn_enemies (ct = 6) {
  let enemies = [];
  let x = 0;
  let y = 470;
  for (let i = 0; i < ct; i++) {
    let dipX = rand(-150, 150);
    x += 800 + dipX;
    let enemy = new Enemy(x, y, rand(1,2) == 1 ? 'right' : 'left');
    enemies.push(enemy);
  }
  return enemies;
}

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}



/* Загрузка картинки в память (переменную) */
function loadImage (path) {
  let elem = document.createElement("img"); // Создаем сущность IMG
  elem.src = path; // Присваеваем этой сущьности атрибут src равный пути до картинки

  /* Описываем сам возвращаемый объект */
  let prop = {
    element: elem, // Исходник нашей картинки

    /*

    Name: Функция рисования картинки на холст

    x - координата x, y - координата y;
    w - ширина, h - высота;
    cm (camera) - будет ли объект отображаться с учетом движения камеры.
    mr (mirror) - будет ли объект отражен по оси X;

    */
    draw (x, y, w, h, cm = true, mr = false) {
      if (cm === true) { // Если камера вкл
        if (mr === true) { // Если отражение вкл
          ctx.save(); // Запоминаем настройки холста
          ctx.translate(x*2 + w, 0); // Прокручиваем холст на X * 2 + widht
          ctx.scale(-1, 1); // Отражаем холст по X

          // Отрисовываем изображение на отраженном холсте с уч. камеры
          ctx.drawImage(prop.element, camera.x + x, camera.y + y, w, h);
          ctx.restore(); // Восстанавливаем холст
        }
        else if (mr === false) { // Если отражение выкл
          // Отрисовываем изображение с уч. камеры
          ctx.drawImage(prop.element, -camera.x + x, -camera.y + y, w, h);
        }
      }
      else if (cm === false) { // Если камера выкл
        if (mr === true) { // Если отражение вкл
          ctx.save();
          ctx.translate(x*2 + w, 0);
          ctx.scale(-1, 1);
          // Отрисовываем изображение на отраженном холсте без уч. камеры
          ctx.drawImage(prop.element, x, y, w, h);
          ctx.restore();
        }
        else if (mr === false) { // Если отражение выкл
          // Отрисовываем изображение без уч. камеры
          ctx.drawImage(prop.element, x, y, w, h);
        }
      }

    }
  }

  elem.onload = () => gameLoad.add_progress(1);
  gameLoad.all++;
  return prop;
}

/* Создание спрайта (игрового объекта) */

function addSprite (src, x, y, w, h, cam = true, mirror = false) {
  let el;
  if (typeof src == "string") el = loadImage(src)
  else el = src;

  let prop = {
    img: el,
    x: x,
    y: y,
    w: w,
    h: h,
    c: cam,
    m: mirror,
    collision: {
      x: x,
      y: y,
      w: w,
      h: h,
      color: "white",
      draw: false,
    },

    /*

    Name: Функция отображения спрайта на холст

    x - координата x, y - координата y;
    w - ширина, h - высота;
    c (camera) - будет ли объект отображаться с учетом камеры.
    m (mirror) - будет ли объект отражен по Y;

    Мы просто перебрасываем все параметры в функцию отрисовки у изображения.
    */

    draw (x = this.x, y = this.y, w = this.w, h = this.h, c = this.c, m = this.m) {
      this.img.draw(x,y,w,h,c,m);
      if (this.collision.draw) {
        ctx.fillStyle = this.collision.color;
        let x = this.x + this.collision.x;
        let y = this.y + this.collision.y;
        // console.log(x);

        if (c) ctx.fillRect(x - camera.x, y - camera.y, this.collision.w, this.collision.h);
        else ctx.fillRect(x, y, this.collision.w, this.collision.h);
      }
    },
    get_col() {
      return {
        x: this.x + this.collision.x,
        y: this.y + this.collision.y,
        w: this.collision.w,
        h: this.collision.h,
      };
    }

  }
  return prop;
}


function addAnimation (path, template, amount, speed, props) {
  let prop = {
    frames: (() => {
      let s = [];
      while (s.length < amount) {
        let sp = addSprite(path + template + ` (${s.length + 1}).png`, 0, 0, props.w, props.h, props.c, props.m);
        s.push(sp);
        // console.log('Загрузка кадра анимации ' + template);
      }
      return s;
    })(),
    currentFrame: 1,
    count: amount,
    speed: speed,
    changeFrameBufferMax: 1000 / speed,
    changeFrameBuffer: 0,
    w: props.w,
    h: props.h,
    c: props.c,


    addBuffer (ms) {
      this.changeFrameBuffer += ms;
      while (this.changeFrameBuffer >= this.changeFrameBufferMax) {
        this.changeFrameBuffer -= this.changeFrameBufferMax;
        this.currentFrame++;
      }
      if (this.currentFrame >= this.count) {
        this.currentFrame = 1;
      }
    },

    draw (x, y, d) {
      this.frames[(this.currentFrame - 1)].draw(x, y, this.w, this.h, this.c, d);
    }
  }
  return prop;
}


function addSound (path) {
  let el = document.createElement('audio');
  el.src = path;
  el.preload = "auto";
  let prop = {
    element: el,
    play () {
      this.element.currentTime = 0;
      this.element.play();
    }
  };
  return prop;
}

function drawHP(hp, maxHP){
  ctx.fillStyle = "red";
  let hpW = 200;
  let hpWPh = hpW / maxHP;

  ctx.fillRect(10, 10, hp * hpWPh, 25)
  ctx.strokeRect(10, 10, hpW, 25)
}

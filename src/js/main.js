// Находим canvas по id;
let canvas = document.querySelector("#canvas");
let text_progress = document.querySelector(".load_progress");
/*
Говорим canvas как мы его будем использовать
И получаем контекст для работы.
*/
let ctx = canvas.getContext("2d");
// Устанавливаем ширину и высату canvas;
canvas.width = 800;
canvas.height = 600;
let gameWidth = 3200;
let pause = true;
let gameLoad = {
  progress: 0,
  all: 0,
  procent: 0,
  add_progress(count) {
    this.progress += count;
    this.procent = Math.round((100 / this.all) * this.progress);
    this.update_view_load_text();
  },
  update_view_load_text() {
    let text = `Загрузка игры ${this.procent}%`;
    text_progress.innerText = text;
  }
}



window.onload = function () {
  // Запуск игры
  canvas.style.display = "block";
  text_progress.style.display = "none";
  timestamp = Date.now();
  update();
}




// Основные переменные
let progress = 0;
let fps = 0;
let fps_view = 0;
let timestamp = 0;
let yground = 510;
let dirMove = 'stop';
let chunk_size = 1200;

// Создание таймера
let timer = new Timer();
let player = new Player();
let keyController = new KeyController();


let camera = {
  x: 0,
  y: 0,
  change_x (x) {
    this.x += x;
    if (this.x < 0) this.x = 0;
    else if (this.x > gameWidth - canvas.width) this.x = gameWidth - canvas.width;
  }
}
let backgrounds = [
  addSprite('media/image/background/2.jpg', 0, 0, 800, 600, true),
  addSprite('media/image/background/1.png', 800, 0, 800, 600, true),
  addSprite('media/image/background/2.jpg', 1600, 0, 800, 600, true),
  addSprite('media/image/background/1.png', 2400, 0, 800, 600, true)
];

// let wolf = Resourse.add(path, 'image', 'wolf');

let grounds = generate_grounds(20);
let fly_grounds = generate_fly_grounds(30);
let apples = generate_apples(fly_grounds);
let enemies = spawn_enemies(3);




window.onkeydown = (e) => { keyController.activateKey(e.code) }
window.onkeyup = (e) => { keyController.disabledKey(e.code) }


/* *** Игровой цикл *** */

// Функция обсчета данных
function update () {
  progress = Date.now() - timestamp; // вычисляем сколько времени прошло между кадрами.
  // camera.x++
  /* Тут код просчета данных */
  timer.add_time(progress); // <--- Каждый кадр добавляем время в таймер и пытаемся обновить его.
  fps+= 1;

  player.move(keyController.getActiveKey());
  enemies.forEach(enemy => { enemy.move() });
  /* Конец кода просчета данных */
  draw(); // Вызываем отрисовку
  requestAnimationFrame(update); // Вызваем функцию update сразу, как только браузер будет готов.
}

// Функция отрисовки
function draw () {
  clear(); // Очищаем экран
  /* Тут код отрисовки */

  backgrounds.forEach(background => { background.draw() });
  grounds.forEach(ground => { ground.draw() });
  apples.forEach(apple => { apple.draw() });
  fly_grounds.forEach(fly_ground => { fly_ground.draw() });
  player.draw();
  enemies.forEach(enemy => { enemy.draw() });
  timer.draw();
  draw_fps();

  /* Конец кода отрисовки */
  timestamp = Date.now(); // Запоминаем время отрисовки кадра
}

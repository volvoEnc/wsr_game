class Timer {
  constructor () {
    this.bufferTime = 0; // Буффер времени, ждем пока накопиться секунда
    this.viewTime = "00:00"; // Время для вывода на дисплей в формате mm:ss
    this.secTime = 0; // Кол-во секунды

    this.m = 0; // Минуты в формате mm
    this.s = 0; // Секунды в формате ss
  }

  // Добавление времени
  add_time (ms) {
    this.bufferTime += ms;
    // Контролируем переполнение буфера
    while (this.bufferTime >= 1000) {
      this.bufferTime -= 1000;
      this.secTime += 1;
      fps_view = fps;
      fps = 0;
      player.change_hp('sub', 1);
    }
    // Вызываем функцию пересчета таймера
    this.update();
  }


  // Функция пересчета времени таймера
  update () {
    this.m = Math.floor(this.secTime / 60); // Вычисляем минуты
    this.s = this.secTime - (this.m * 60);  // Вычисляем секунды

    if (this.m < 10) this.m = `0${this.m}`; // Делаем верный формат
    if (this.s < 10) this.s = `0${this.s}`; // Делаем верный формат

    this.viewTime = `${this.m}:${this.s}`; // // Делаем верный формат
  }

  // Отрисовываем таймер
  draw () {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "32px Open Sans Condensed";
    ctx.fillText(this.viewTime, canvas.width / 2, 45); // Отрисовываем таймер по центру
  }
}

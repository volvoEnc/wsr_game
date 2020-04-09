class Enemy {
  constructor(x, y, direction) {
    this.x = x; // x - волка
    this.dipX = 500; // Максимум сколько волк может двигаться от места спавна
    this.cdipX = this.dipX / 2; // Максимум сколько волк может двигаться от места спавна (в одну сторону)
    this.y = y;  // y - волка
    this.w = 100;
    this.h = 50;

    this.speed = 100;
    this.sps = 0;

    this.direction = direction == 'right' ? false : true;
    this.animations = {
      run: addAnimation("media/image/enemy/wolf/", "Run", 8, 12, {w: this.w, h: this.h, c: true}),
    };
    this.currentAnimation = this.animations.run;

    this.buffer = {
      attack: { // Наносим урон не чаще чем 1 раз в секунду
        max: 1000,
        current: 1000
      }
    }
  }

  move() {
    this.sps = this.speed / 1000 * progress;
    this.cdipX += this.sps;
    if (this.direction == false) this.x += this.sps;
    else if (this.direction == true) this.x -= this.sps;

    if (this.cdipX > this.dipX) {
      this.cdipX = 0;
      this.direction = !this.direction;
    }
  }

  attack(status) {
    if (status) {
      if (this.buffer.attack.current >= this.buffer.attack.max) {
        this.buffer.attack.current = 0;
        player.change_hp('sub', 30);
      }
      else {
        this.buffer.attack.current += progress;
      }
    } else {
      if (this.buffer.attack.current >= this.buffer.attack.max) this.buffer.attack.current += progress;
    }
  }

  draw() {
    this.currentAnimation.addBuffer(progress);
    this.currentAnimation.draw(this.x, this.y, this.direction);
  }
}

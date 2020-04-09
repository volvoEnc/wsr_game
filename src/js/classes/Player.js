class Player {
  constructor(type) {
    this.type = type;
    this.w = 75;
    this.h = 75;
    this.mx = -22;
    this.x = 30;
    this.myc = (yground - this.h + 5);
    this.my = this.myc;
    this.y = this.my;

    this.collision = {
      x: 20,
      y: 25,
      w: 20,
      h: 40,
      draw: false,
      type: "",
    }

    this.dirM = false;
    this.ustalos = -50;
    this.animations = {
      run:      addAnimation("media/image/players/ricardo/", "Run", 8, 12, {w: this.w, h: this.h, c: true}),
      jump:     addAnimation("media/image/players/ricardo/", "Jump", 10, 5, {w: this.w, h: this.h, c: true}),
      stop:     addAnimation("media/image/players/ricardo/", "Slide", 5, 5, {w: this.w, h: this.h, c: true}),
    }
    this.sounds = {
    }
    this.currentAnimation = this.animations.stop;
    this.maxHp = 100;
    this.hp = this.maxHp;

    this.score = 0;

    this.speed = 220;
    this.sps = 0;
    this.speedo = 800;
    this.dspeedo = 200;

    this.jumpStatus = 'stop', // Статус прыжка
    this.currentJumpSpeed = 0; // Текущая скорость в полете
    this.jumpSpeed = 500; // Начальна скорость прыжка
    this.slowdown = 1000; // Замедление - ускорение в сек
  }

  move (direction) {


    if (direction.jump == true) {
      if (this.jumpStatus == 'stop') {
        this.jumpStatus = "jumpUp";
        this.currentJumpSpeed = this.jumpSpeed;
        this.animations.jump.currentFrame = 1;
      }
    }
    this.jumpController();
    this.groundController();
    this.collect_apple();
    this.enemy_attack();


    if (direction.left == true)  {
      this.sps = (this.speed / 1000) * progress;
      this.currentAnimation =  this.animations.run;
      this.dirM = true;
      if (this.x + (this.w / 2) >= (canvas.width / 2) && this.x + (this.w / 2) <= gameWidth - (canvas.width / 2)) {
        camera.change_x(-this.sps)
      }
      this.x -= this.sps;
    }

    else if (direction.right == true) {
      if (this.x >= gameWidth - this.w) {
        return;
      }
      this.sps = (this.speed / 1000) * progress;
      this.currentAnimation = this.animations.run;
      this.dirM = false;
      if (this.x + (this.w / 2) >= (canvas.width / 2) && this.x + (this.w / 2) <= gameWidth - (canvas.width / 2)) {
        camera.change_x(this.sps)
      }
      this.x += this.sps;
    }

    else {
      this.currentAnimation =  this.animations.stop;
    }


    if (this.jumpStatus == "jumpUp" || this.jumpStatus == "jumpDown") {
      this.currentAnimation =  this.animations.jump;
    }
  }



  check_collision (cx, cy, cw, ch) {
    let x = !this.dirM ? this.x + this.collision.x : this.x - this.collision.x + this.w - this.collision.w;
    let y = this.y + this.collision.y;
    let x2 = this.collision.w + x;
    let y2 = this.collision.h + y;

    let cx2 = cw + cx;
    let cy2 = ch + cy;

    if ( ( (x2 > cx && x2 < cx2) || (x2 > cx2 && x < cx2) ) && ( (y > cy && y < cy2) || (y < cy && y2 > cy) ) ) {
      return true;
    } else {
      return false;
    }
  }

  jumpController() {
    if (this.jumpStatus == "jumpUp") {
      this.currentJumpSpeed -= ( this.slowdown / 1000 ) * progress;
      if (this.currentJumpSpeed <= 0) {
        this.currentJumpSpeed = 0;
        this.jumpStatus = "jumpDown";
        return;
      }
      let dpf = ( this.currentJumpSpeed / 1000 ) * progress;
      this.y -= dpf;
    }
    else if (this.jumpStatus == "jumpDown") {
      this.currentJumpSpeed += ( this.slowdown / 1000 ) * progress;
      if (this.y + this.collision.h - 30 >= this.my) {
        this.currentJumpSpeed = 0;
        this.y = this.myc;
        this.jumpStatus = "stop";
        return;
      }
      let dpf = ( this.currentJumpSpeed / 1000 ) * progress;
      this.y += dpf;
    }
  }


  groundController() {
    let gro = false;
    fly_grounds.forEach(item => {
      let cl = item.get_col();
      if (this.check_collision(cl.x, cl.y, cl.w, cl.h)) {
        gro = true;
        if (this.jumpStatus == 'jumpDown') {
          this.currentJumpSpeed = 0;
          this.jumpStatus = 'stop'
          this.y = item.y - this.h + 5;
        }
      }
    });
    if (this.y != this.myc && this.jumpStatus == 'stop' && gro == false) {
      this.jumpStatus = "jumpDown";
    }
  }

  collect_apple() {
    apples.forEach((apple, i) => {
      if (this.check_collision(apple.x, apple.y, apple.w, apple.h)) {
        apples.splice(i, 1);
        player.change_hp('add', 5);
      }
    });

  }


  enemy_attack() {
    enemies.forEach(enemy => {
      if (this.check_collision(enemy.x, enemy.y, enemy.w, enemy.h)) enemy.attack(true);
      else enemy.attack(false);
    });
  }



  change_hp(type, count) {
    if (type == 'sub') {
      this.hp -= count;
      if (this.hp <= 0) {
        alert('You death!');
        window.location.reload();
      }
    }
    else if (type == 'add') {
      this.hp += count;
      if (this.hp > this.maxHp) {
        this.hp = this.maxHp;
      }
    }
  }




  draw () {
    drawHP(this.hp, this.maxHp)
    this.currentAnimation.addBuffer(progress);
    this.currentAnimation.draw(this.x, this.y, this.dirM);
    if (this.collision.draw) {
      ctx.fillStyle = "red";
      let x = !this.dirM ? this.x + this.collision.x : this.x - this.collision.x;
      let y = this.y + this.collision.y;

      if (!this.dirM) ctx.fillRect(x - camera.x, y - camera.y, this.collision.w, this.collision.h);
      else ctx.fillRect(x + this.w - this.collision.w - camera.x, y - camera.y, this.collision.w, this.collision.h);

    }
  }


}

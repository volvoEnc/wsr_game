class KeyController {
  constructor() {
    this.keyMap = {
      right: false,
      left: false,
      jump: false,
      down: false,
      spawnBullet: false
    }
  }

  activateKey (code) {
    // console.log(code);
    if (code == 'KeyD' || code == 'ArrowRight') this.keyMap.right = true;
    else if (code == 'KeyA' || code == 'ArrowLeft') this.keyMap.left = true;
    if (code == 'KeyW' || code == 'ArrowUp') this.keyMap.jump = true;
    if (code == 'KeyE') this.keyMap.spawnBullet = true;
  }
  disabledKey (code) {
    if (code == 'KeyD' || code == 'ArrowRight') this.keyMap.right = false;
    else if (code == 'KeyA' || code == 'ArrowLeft') this.keyMap.left = false;
    if (code == 'KeyW' || code == 'ArrowUp') this.keyMap.jump = false;
    if (code == 'KeyE') this.keyMap.spawnBullet = false;
  }

  getActiveKey () {
    return this.keyMap;
  }
}

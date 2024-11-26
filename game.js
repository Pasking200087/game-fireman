let game; // Игра будет создана после нажатия кнопки

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

document.querySelector('.start-button').addEventListener('click', () => {
  document.querySelector('.start-button').style.display = 'none';
  document.querySelector('.score').style.display = 'block';

  game = new Phaser.Game(config);
});

let player, cursors, fireGroup, score = 0, scoreText, extinguishAnimation;

function preload() {
  this.load.image('player', 'https://via.placeholder.com/40x40?text=P');
  this.load.image('fire', 'https://via.placeholder.com/30x30?text=F');
  this.load.image('extinguisher', 'https://via.placeholder.com/20x20?text=E');
  this.load.spritesheet('fireAnim', 'https://via.placeholder.com/30x30?text=F+A', { frameWidth: 30, frameHeight: 30 });
  this.load.spritesheet('extinguishAnim', 'https://via.placeholder.com/40x40?text=E+A', { frameWidth: 40, frameHeight: 40 });
}

function create() {
  player = this.physics.add.sprite(400, 300, 'player');
  player.setCollideWorldBounds(true);

  fireGroup = this.physics.add.group({
    key: 'fire',
    repeat: 5,
    setXY: { x: 100, y: 100, stepX: 150 }
  });

  fireGroup.children.iterate(fire => {
    fire.setBounce(1).setCollideWorldBounds(true);
    fire.play('burning');
  });

  this.anims.create({
    key: 'burning',
    frames: this.anims.generateFrameNumbers('fireAnim', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  extinguishAnimation = this.anims.create({
    key: 'extinguish',
    frames: this.anims.generateFrameNumbers('extinguishAnim', { start: 0, end: 3 }),
    frameRate: 10,
    hideOnComplete: true
  });

  scoreText = document.querySelector('.score');
  updateScore();

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.overlap(player, fireGroup, extinguishFire, null, this);
}

function update() {
  player.setVelocity(0);

  if (cursors.left.isDown) {
    player.setVelocityX(-200);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-200);
  } else if (cursors.down.isDown) {
    player.setVelocityY(200);
  }

  if (cursors.space && cursors.space.isDown) {
    playExtinguishAnimation();
  }
}

function extinguishFire(player, fire) {
  fire.play('extinguish');
  fire.on('animationcomplete', () => fire.destroy());
  score += 10;
  updateScore();
}

function updateScore() {
  scoreText.textContent = `Очки: ${score}`;
}

function playExtinguishAnimation() {
  player.play('extinguish', true);
}

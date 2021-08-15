class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, position, index) {
    super(scene, -100, -100, "card");
    this.position = position;
    this.index = index;
    this.scene = scene;
    this.setOrigin(0.5, 0);
    this.scene.add.existing(this);
    this.setInteractive();
  }

  playAnimation(start = true) {
    this.scene.tweens.add({
      targets: this,
      x: start ? this.position.x : -this.width,
      y: start ? this.position.y : -this.height,
      ease: "Linear",
      duration: 500,
    });
  }

  open() {
    this.scene.sounds.card.play();
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: "Linear",
      duration: 150,
      onComplete: () => {
        this.setTexture("card" + this.index);
        this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          ease: "Linear",
          duration: 150,
        });
      },
    });
  }

  close() {
    this.scene.sounds.card.play();
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: "Linear",
      duration: 150,
      onComplete: () => {
        this.setTexture("card");
        this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          ease: "Linear",
          duration: 150,
        });
      },
    });
    this.setTexture("card" + this.index);
  }
}

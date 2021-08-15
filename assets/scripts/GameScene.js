class GameScene extends Phaser.Scene {
  sounds = {};
  cards = [];
  finded = [];
  selected = null;
  twoSelected = false;
  constructor() {
    super("Game");
  }
  preload() {
    this.load.image("bg", "assets/sprites/background.png");
    for (let index of ["", 1, 2, 3, 4, 5]) {
      this.load.image(`card${index}`, `assets/sprites/card${index}.png`);
    }
    for (let name of this.sys.game.config.sounds) {
      this.load.audio(`${name}_sound`, `assets/sounds/${name}.mp3`);
    }
  }
  create() {
    this.timeout = this.sys.game.config.timeout;
    this.createSounds();
    this.createTimer();
    this.createBackground();
    this.createText();
    this.createCards();
    this.input.on("gameobjectdown", this.onCardClicked, this);
  }

  createSounds() {
    for (let name of this.sys.game.config.sounds) {
      this.sounds[name] = this.sound.add(`${name}_sound`);
    }
    this.sounds.theme.play({
      volume: 0.1,
    });
  }

  createBackground() {
    const bg = this.add.sprite(0, 0, "bg").setOrigin(0, 0);
  }

  onTimerTick() {
    this.timeoutText.setText(`Time: ${--this.timeout}`);
    if (this.timeout <= 0) {
      this.sounds.timeout.play();
      this.cards.forEach((card, index) => {
        setTimeout(() => card.playAnimation(false), 100 * index);
      });
      setTimeout(() => this.newGame(), 1500);
    }
  }

  createTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true,
    });
  }

  createText() {
    this.timeoutText = this.add.text(10, 330, `Time: ${this.timeout}`, {
      font: "26px Fira Code",
      fill: "yellow",
    });
  }

  createCards() {
    const positions = this.getCardPositions();
    const indexes = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
    Phaser.Utils.Array.Shuffle(indexes);
    for (let pos of positions) {
      const index = indexes.pop();
      this.cards.push(new Card(this, pos, index));
      this.cards.forEach((card, index) => {
        setTimeout(() => card.playAnimation(), 100 * index);
      });
    }
  }

  onCardClicked(pointer, card) {
    this.CardClickHandler(card);
    if (this.finded.length === this.cards.length) {
      this.sounds.success.play();
      this.cards.forEach((card, index) => {
        setTimeout(() => card.playAnimation(false), 100 * index);
      });
      setTimeout(() => this.newGame(), 1500);
    }
  }

  CardClickHandler(card) {
    if (this.twoSelected) {
    } else if (!this.selected) {
      this.selected = card;
      card.open();
    } else {
      if (this.selected === card || this.finded.includes(card)) {
      } else if (card.index === this.selected.index) {
        card.open();
        this.finded.push(card);
        this.finded.push(this.selected);
        this.selected = null;
        this.sounds.complete.play();
      } else {
        card.open();
        this.twoSelected = true;
        setTimeout(() => this.closeLastCards(card), 300);
      }
    }
  }

  closeLastCards(card) {
    this.selected.close();
    this.selected = null;
    card.close();
    this.twoSelected = false;
  }

  newGame() {
    for (let card of this.cards) {
      card.close();
      setTimeout(() => {
        card.destroy();
      }, 300);
    }
    setTimeout(() => {
      this.cards = [];
      this.finded = [];
      this.selected = null;
      this.twoSelected = false;
      this.createCards();
    }, 300);
    this.timeout = this.sys.game.config.timeout;
  }

  getCardPositions() {
    const positions = [];
    const cardTexture = this.textures.get("card").getSourceImage();
    const startWidth =
      (this.sys.game.config.width -
        (cardTexture.width * (this.sys.game.config.columns - 1) +
          5 * (this.sys.game.config.columns - 1))) /
      2;
    const startHeight =
      (this.sys.game.config.height -
        (cardTexture.height * this.sys.game.config.rows +
          5 * (this.sys.game.config.rows - 1))) /
      2;
    for (let row = 0; row < this.sys.game.config.rows; row++) {
      for (let column = 0; column < this.sys.game.config.columns; column++) {
        positions.push({
          x: startWidth + column * (cardTexture.width + 5),
          y: startHeight + row * (cardTexture.height + 5),
        });
      }
    }
    return positions;
  }
}

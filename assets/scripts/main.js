const initConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: new GameScene(),
};
const customConfig = {
  rows: 2,
  columns: 5,
  timeout: 30,
  sounds: ["card", "complete", "success", "theme", "timeout"],
};

const game = new Phaser.Game(initConfig);
game.config = { ...game.config, ...customConfig };

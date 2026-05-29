export function createGameLoop(callback: () => void) {
  let running = false;

  function loop() {
    if (!running) return;

    callback();
    requestAnimationFrame(loop);
  }

  return {
    start() {
      running = true;
      requestAnimationFrame(loop);
    },
    stop() {
      running = false;
    },
  };
}

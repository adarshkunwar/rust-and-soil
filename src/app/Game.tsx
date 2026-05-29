import { useEffect, useRef } from "react";
import { createGameLoop } from "../engine/gameLoop";
import { createInput } from "../engine/input";
import { handleInteraction } from "../systems/interactionSystem";
import { createMap } from "../world/map";
import { updateGrowth } from "../systems/growthSystem";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  console.log("game started");

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    console.log(ctx);

    canvas.width = 800;
    canvas.height = 600;

    const input = createInput();
    const game = {
      map: createMap(),
      player: {
        x: 5,
        y: 5,
        speed: 0.1,
      },
      selectedAction: "till",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      handleInteraction(game, e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);

    const loop = createGameLoop(() => {
      update(game, input);
      render(ctx!, game);
    });

    const growthInterval = setInterval(() => {
      console.log("TICK");
      updateGrowth(game);
    }, 500);

    loop.start();

    return () => {
      clearInterval(growthInterval);
      window.removeEventListener("keydown", handleKeyDown);
      loop.stop();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ border: "1px solid black" }} />;
};

function update(game: any, input: any) {
  if (input.keys["w"]) {
    game.player.y -= 1;
    input.keys["w"] = false; // prevent continuous spam
  }

  if (input.keys["s"]) {
    game.player.y += 1;
    input.keys["s"] = false;
  }

  if (input.keys["a"]) {
    game.player.x -= 1;
    input.keys["a"] = false;
  }

  if (input.keys["d"]) {
    game.player.x += 1;
    input.keys["d"] = false;
  }
}

function render(ctx: CanvasRenderingContext2D, game: any) {
  ctx.clearRect(0, 0, 800, 600);

  const tileSize = 32;

  for (let row of game.map) {
    for (let tile of row) {
      ctx.fillStyle = "#4caf50";
      ctx.fillRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);

      ctx.strokeStyle = "#000";
      ctx.strokeRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
    }
  }

  // player
  ctx.fillStyle = "red";
  ctx.fillRect(
    game.player.x * tileSize,
    game.player.y * tileSize,
    tileSize,
    tileSize,
  );
}

export default Game;

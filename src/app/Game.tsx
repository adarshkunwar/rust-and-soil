import { useEffect, useRef, useState } from "react";
import { createGameLoop } from "../engine/gameLoop";
import { createInput } from "../engine/input";
import { handleInteraction } from "../systems/interactionSystem";
import { createMap } from "../world/map";
import { updateGrowth } from "../systems/growthSystem";
import { applyTool } from "../systems/toolSystem";
import type { Game } from "../types/game";
import type { ToolType } from "../types/tools";

const GameScreen = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolType>("hoe");

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    console.log(ctx);

    canvas.width = 800;
    canvas.height = 600;

    const input = createInput();
    const game: Game = {
      map: createMap(),
      player: {
        x: 5,
        y: 5,
        speed: 0.1,
      },
      selectedTool: tool,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      handleInteraction(game, e.key.toLowerCase());
    };

    const handleKeyOperationDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "1") {
        game.selectedTool = "hoe";
        setTool("hoe");
      }

      if (key === "2") {
        game.selectedTool = "seed";
        setTool("seed");
      }

      if (key === "3") {
        game.selectedTool = "hand";
        setTool("hand");
      }

      if (key === "e") {
        applyTool(game);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleKeyOperationDown);

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
      window.removeEventListener("keydown", handleKeyOperationDown);
      window.removeEventListener("keydown", handleKeyDown);
      loop.stop();
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />

      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "10px",
          fontFamily: "monospace",
        }}
      >
        <div>1 Hoe | 2 Seed | 3 Hand</div>
        <div>Selected: {tool}</div>
      </div>
    </div>
  );
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

function render(ctx: CanvasRenderingContext2D, game: Game) {
  ctx.clearRect(0, 0, 800, 600);

  const tileSize = 32;

  for (let row of game.map) {
    for (let tile of row) {
      // Always set a default so style can't "leak" from prior tiles.
      ctx.fillStyle = "#4caf50";

      if (tile.type === "tilled") ctx.fillStyle = "#8b5a2b";
      else if (tile.type === "planted") ctx.fillStyle = "#f5deb3";
      else if (tile.type === "ready") ctx.fillStyle = "#ffd54f";
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

export default GameScreen;

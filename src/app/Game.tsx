import { useCallback, useEffect, useRef, useState } from "react";
import { createGameLoop } from "../engine/gameLoop";
import { createInput } from "../engine/input";
import { createMap, MAP_WIDTH } from "../world/map";
import { updateGrowth } from "../systems/growthSystem";
import { applyTool } from "../systems/toolSystem";
import type { Game } from "../types/game";
import { TOOLS } from "../constants/tools.const";
import type { ToolType } from "../types/tools";
import { SPRITES } from "../constants/sprite.const";
import DeathScreen from "../ui/DeathScreen";

const INITIAL_POWER = 6;

const GameScreen = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolType>(TOOLS.hoe);
  const [resources, setResouces] = useState<number>(0);
  const [power, setPower] = useState<number>(INITIAL_POWER);
  const powerRef = useRef<number>(INITIAL_POWER);
  const [runId, setRunId] = useState(0);

  const setPowerSynced = useCallback(
    (updater: number | ((prev: number) => number)) => {
      setPower((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        powerRef.current = next;
        return next;
      });
    },
    [setPower],
  );

  const handleRetry = useCallback(() => {
    setTool(TOOLS.hoe);
    setResouces(0);
    setPowerSynced(INITIAL_POWER);
    setRunId((v) => v + 1);
  }, [setPowerSynced, setTool, setResouces, setRunId]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");

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
      selectedTool: TOOLS.hoe,
    };

    const handleKeyOperationDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (powerRef.current < 1) {
        if (key === "r" || key === "enter") handleRetry();
        return;
      }

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
        applyTool(game, setResouces);
      }
    };

    window.addEventListener("keydown", handleKeyOperationDown);

    let growthInterval: number | undefined;
    const loop = createGameLoop(() => {
      update(game, input, powerRef.current, setPowerSynced);
      render(ctx!, game);
    });

    growthInterval = window.setInterval(() => {
      if (powerRef.current < 1) return;

      const next = Math.max(powerRef.current - 1, 0);
      setPowerSynced(next);

      if (next < 1) {
        loop.stop();
        if (growthInterval !== undefined) {
          clearInterval(growthInterval);
          growthInterval = undefined;
        }
        return;
      }

      updateGrowth(game);
    }, 500);

    loop.start();

    return () => {
      if (growthInterval !== undefined) clearInterval(growthInterval);
      window.removeEventListener("keydown", handleKeyOperationDown);
      loop.stop();
    };
  }, [runId, setPowerSynced, handleRetry]);

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

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "10px",
          fontFamily: "monospace",
        }}
      >
        <div>Crops: {resources}</div>
        <div>Power: {power}</div>
      </div>

      {power < 1 ? <DeathScreen onRetry={handleRetry} /> : null}
    </div>
  );
};

function update(
  game: Game,
  input: { keys: Record<string, boolean> },
  power: number,
  setPower: (next: number) => void,
) {
  if (power < 1) return;

  if (game.player.x == MAP_WIDTH - 1) {
    setPower(100);
  }

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
      const x = tile.x * tileSize;
      const y = tile.y * tileSize;

      if (tile.type === "weed") {
        if (SPRITES.grass.complete) {
          ctx.drawImage(SPRITES.grass, x, y, tileSize, tileSize);
        } else {
          ctx.fillStyle = "#4caf50";
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      } else if (tile.type === "tilled") {
        if (SPRITES.tilled.complete) {
          ctx.drawImage(SPRITES.tilled, x, y, tileSize, tileSize);
        } else {
          ctx.fillStyle = "#8b5a2b";
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      } else if (tile.type === "planted") {
        if (SPRITES.planted.complete) {
          ctx.drawImage(SPRITES.planted, x, y, tileSize, tileSize);
        } else {
          ctx.fillStyle = "#f5deb3";
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      } else if (tile.type === "ready") {
        if (SPRITES.ready.complete) {
          ctx.drawImage(SPRITES.ready, x, y, tileSize, tileSize);
        } else {
          ctx.fillStyle = "#ffd54f";
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      } else if (tile.type === "water") {
        if (SPRITES.water.complete) {
          ctx.drawImage(SPRITES.water, x, y, tileSize, tileSize);
        } else {
          ctx.fillStyle = "#3f7fbf";
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }

      ctx.strokeStyle = "#000";
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }

  // player

  if (SPRITES.robot_top_down.complete) {
    ctx.drawImage(
      SPRITES.robot_top_down,
      game.player.x * tileSize,
      game.player.y * tileSize,
      tileSize,
      tileSize,
    );
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(
      game.player.x * tileSize,
      game.player.y * tileSize,
      tileSize,
      tileSize,
    );
  }
}

export default GameScreen;

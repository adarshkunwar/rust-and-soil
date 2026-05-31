import { useCallback, useEffect, useRef, useState } from "react";
import { createGameLoop } from "../engine/gameLoop";
import { createInput } from "../engine/input";
import { MAP_HEIGHT, MAP_WIDTH } from "../world/map";
import { updateGrowth } from "../systems/growthSystem";
import { applyTool } from "../systems/toolSystem";
import type { Game } from "../types/game";
import { TOOLS } from "../constants/tools.const";
import type { ToolType } from "../types/tools";
import { SPRITES } from "../constants/sprite.const";
import DeathScreen from "../ui/DeathScreen";
import ShopScreen from "../ui/ShopScreen";
import { game } from "../entities/game.entity";

const GameScreen = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolType>(TOOLS.hoe);
  const [power, setPower] = useState<number>(game.player.power);
  const powerRef = useRef<number>(game.player.power);
  const [runId, setRunId] = useState(0);
  const [isShopOpen, setIsShopOpen] = useState(false);

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
    setPowerSynced(game.player.power);
    setRunId((v) => v + 1);
  }, [setPowerSynced, setTool, setRunId]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    const input = createInput();

    const handleKeyOperationDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      console.log(key);

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
        applyTool(game, () => setIsShopOpen(true));
      }

      if (key === "escape") {
        if (isShopOpen) setIsShopOpen(false);
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
  }, [isShopOpen, runId, setPowerSynced, handleRetry]);

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
        <div>Power: {power}</div>

        <div>
          {Object.entries(game.inventory).map(([item, count]) => (
            <div key={item}>
              {item}: {count}
            </div>
          ))}
        </div>
      </div>

      {isShopOpen ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShopScreen game={game} />
        </div>
      ) : null}
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
    game.player.y = game.player.y < 1 ? 0 : game.player.y - 1;
    game.player.direction = "up";
    input.keys["w"] = false; // prevent continuous spam
  }

  if (input.keys["s"]) {
    game.player.y =
      game.player.y > MAP_HEIGHT - 2 ? MAP_HEIGHT - 1 : game.player.y + 1;
    game.player.direction = "down";
    input.keys["s"] = false;
  }

  if (input.keys["a"]) {
    game.player.x = game.player.x < 1 ? 0 : game.player.x - 1;
    game.player.direction = "left";
    input.keys["a"] = false;
  }

  if (input.keys["d"]) {
    game.player.x =
      game.player.x > MAP_WIDTH - 2 ? MAP_WIDTH - 1 : game.player.x + 1;
    game.player.direction = "right";
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
      } else if (tile.type === "store") {
        if (SPRITES.store.complete) {
          // background
          ctx.drawImage(SPRITES.grass, x, y, tileSize, tileSize);

          // foreground
          ctx.drawImage(SPRITES.store, x, y, tileSize, tileSize);
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

      // ctx.strokeStyle = "#000";
      // ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }

  // player

  const rotations = {
    up: 0,
    right: Math.PI / 2,
    down: Math.PI,
    left: -Math.PI / 2,
  };

  const x = game.player.x * tileSize;
  const y = game.player.y * tileSize;

  if (SPRITES.robot_top_down.complete) {
    ctx.save();

    ctx.translate(x + tileSize / 2, y + tileSize / 2);
    ctx.rotate(rotations[game.player.direction]);

    ctx.drawImage(
      SPRITES.robot_top_down,
      -tileSize / 2,
      -tileSize / 2,
      tileSize,
      tileSize,
    );
    ctx.restore();
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

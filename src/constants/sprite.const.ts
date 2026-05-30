import grassImg from "../assets/Grass.png";
import tilledImg from "../assets/Tilled.png";
import plantedImg from "../assets/Planted.png";
import readyImg from "../assets/Ready.png";
import WaterImg from "../assets/Water.png";

export const SPRITES = {
  grass: new Image(),
  tilled: new Image(),
  water: new Image(),
  planted: new Image(),
  ready: new Image(),
};

SPRITES.grass.src = grassImg;
SPRITES.tilled.src = tilledImg;
SPRITES.water.src = WaterImg;
SPRITES.planted.src = plantedImg;
SPRITES.ready.src = readyImg;

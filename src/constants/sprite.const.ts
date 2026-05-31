import grassImg from "../assets/Grass.png";
import tilledImg from "../assets/Tilled.png";
import plantedImg from "../assets/Planted.png";
import readyImg from "../assets/Ready.png";
import WaterImg from "../assets/Water.png";
import RoboTopImg from "../assets/Robo-top-down.png";
import StoreImg from "../assets/Store.png";

export const SPRITES = {
  grass: new Image(),
  tilled: new Image(),
  water: new Image(),
  planted: new Image(),
  ready: new Image(),
  robot_top_down: new Image(),
  store: new Image(),
};

SPRITES.grass.src = grassImg;
SPRITES.tilled.src = tilledImg;
SPRITES.water.src = WaterImg;
SPRITES.planted.src = plantedImg;
SPRITES.ready.src = readyImg;
SPRITES.robot_top_down.src = RoboTopImg;
SPRITES.store.src = StoreImg;

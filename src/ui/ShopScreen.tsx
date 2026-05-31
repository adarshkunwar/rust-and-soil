import { useState } from "react";
import { ITEMS } from "../constants/items.const";
import type { Game } from "../types/game";
import type { BaseItem } from "../types/items.types";

const ShopScreen = ({ game }: { game: Game }) => {
  const [money, setMoney] = useState(50);

  // BUY ITEM
  const buyItem = (item: BaseItem) => {
    if (money < item.buyPrice) return;

    setMoney(money - item.buyPrice);

    game.inventory[item.name] = (game.inventory[item.name] || 0) + 1;
  };

  // SELL ITEM
  const sellItem = (item: BaseItem) => {
    if ((game.inventory[item.name] || 0) <= 0) return;

    setMoney(money + item.sellPrice);

    game.inventory[item.name] = (game.inventory[item.name] || 0) - 1;
  };

  const renderItem = (item: BaseItem) => {
    const owned = game.inventory[item.name] || 0;

    return (
      <div
        key={item.id}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          display: "flex",
        }}
      >
        <div>
          <strong>{item.name}</strong>
        </div>

        <div>Buy: {item.buyPrice} </div>
        <div>Sell: {item.sellPrice} </div>
        <div>Owned: {owned}</div>

        <div style={{ marginTop: "5px" }}>
          {item.buyPrice > 0 && (
            <button onClick={() => buyItem(item)}>Buy</button>
          )}

          {item.sellPrice > 0 && owned > 0 && (
            <button onClick={() => sellItem(item)}>Sell</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Shop</h2>

      <div>Money: {money}</div>

      <hr />

      <h3>Seeds</h3>
      {ITEMS.seeds.map(renderItem)}

      <h3>Crops</h3>
      {ITEMS.crops.map(renderItem)}
    </div>
  );
};

export default ShopScreen;

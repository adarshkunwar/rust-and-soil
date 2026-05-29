export function createInput() {
  const keys: Record<string, boolean> = {};

  window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    console.log("keys", keys);
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  return { keys };
}

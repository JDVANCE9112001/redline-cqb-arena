# RED SHIFT

A browser 3D survival FPS. Time slows to 1/30 speed while the player stands still.
Survive eight waves to win. Rifle elites wear a face sticker and require two hits.
Defeating three elites unlocks a shotgun that fires sixteen pellets in a disc spread.
On death, enemies break into directional, physics-driven glass fragments.

Map and gameplay integration contract: [MAP_GAMEPLAY_CONTRACT.md](MAP_GAMEPLAY_CONTRACT.md).
House map handoff: [MAP_HANDOFF.md](MAP_HANDOFF.md).
Final collaboration and merge workflow: [COLLABORATION_AGREEMENT.md](COLLABORATION_AGREEMENT.md).

Controls: WASD to move, mouse to aim, left click to fire, Q or right click to throw
the pistol, 1/2 to switch weapons, Escape to pause, R to restart, and M to mute.

The Pistol_2, AssaultRifle2_2, and modified Shotgun_ShortStock models come from Quaternius's
Ultimate Gun Pack (CC0 1.0). The enemy face image was supplied by the game's owner.

## 本地运行

在解压后的目录打开终端，运行 `python -m http.server 8000`，然后在浏览器打开
`http://localhost:8000/`。游戏使用 JavaScript 模块，需要通过本地网页服务器运行。


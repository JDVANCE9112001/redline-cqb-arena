# RED SHIFT

A browser 3D survival FPS. Time slows to 1/30 speed while the player stands still.
Survive eight waves to win. Ordinary enemies break in one hit; elites take two body
hits or one headshot. Elites carry rifles; later waves add MAC-10s, rifles, and
shotguns to the regular enemy loadouts. Weapons have one finite supply and no manual reload: defeat an
enemy, pick up its weapon, or throw your current weapon with Q. Drops disappear
after 30 seconds. The shotgun has six shells, fires four pellets, and cycles one
shell at a time automatically.
On death, enemies break into directional, physics-driven glass fragments.

Map and gameplay integration contract: [MAP_GAMEPLAY_CONTRACT.md](MAP_GAMEPLAY_CONTRACT.md).
House map handoff: [MAP_HANDOFF.md](MAP_HANDOFF.md).
Final collaboration and merge workflow: [COLLABORATION_AGREEMENT.md](COLLABORATION_AGREEMENT.md).

Controls: WASD to move, mouse to aim, left click to fire, Q to throw your current
weapon, E to pick up a weapon, Escape to pause, R to restart, and M to mute.

The Pistol_2 and AssaultRifle2_2 models come from Quaternius's Ultimate Gun Pack
(CC0 1.0). The revolver and M1014 models were supplied in the handoff package. The
enemy face image was supplied by the game's owner.

## 本地运行

在解压后的目录打开终端，运行 `python -m http.server 8000`，然后在浏览器打开
`http://localhost:8000/`。游戏使用 JavaScript 模块，需要通过本地网页服务器运行。


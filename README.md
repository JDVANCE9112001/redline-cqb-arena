# RED SHIFT

A browser 3D survival FPS. Time slows to 1/30 speed while the player stands still.
Survive eight waves to win. Ordinary enemies break in one hit; elites take two body
hits or one headshot. Elites usually carry rifles; the first wave-two elite
guarantees an M1014 drop, and later elites may carry one. Shotguns appear more
often in regular enemy loadouts as the waves progress. Weapons have one finite supply and no manual reload: defeat an
enemy, pick up its weapon, or throw your current weapon with Q. Drops disappear
after 30 seconds. The shotgun has six shells, fires four pellets, and cycles one
shell at a time automatically.
On death, enemies break into directional, physics-driven glass fragments.

Map and gameplay integration contract: [MAP_GAMEPLAY_CONTRACT.md](MAP_GAMEPLAY_CONTRACT.md).
House map handoff: [MAP_HANDOFF.md](MAP_HANDOFF.md).
Final collaboration and merge workflow: [COLLABORATION_AGREEMENT.md](COLLABORATION_AGREEMENT.md).

Controls: WASD to move, mouse to aim, tap to fire the revolver and hold left click
to auto-fire the MAC-10 or rifle. Q throws your current weapon, E picks up a weapon,
Escape pauses, R restarts, and M mutes.

The Pistol_2, AssaultRifle2_2, and modified Shotgun_ShortStock models come from
Quaternius's Ultimate Gun Pack (CC0 1.0). The M1014 model and common-enemy kill
sound are from the supplied handoff package. The enemy face image was supplied by the game's owner.

## 本地运行

在解压后的目录打开终端，运行 `python -m http.server 8000`，然后在浏览器打开
`http://localhost:8000/`。游戏使用 JavaScript 模块，需要通过本地网页服务器运行。


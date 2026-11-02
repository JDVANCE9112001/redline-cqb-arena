# 地图分支交接

本分支负责地图。完整字段定义见 [MAP_GAMEPLAY_CONTRACT.md](MAP_GAMEPLAY_CONTRACT.md)。

## 已交付

- `assets/house-map.js` 创建一张单层现代住宅，包含客厅、餐厅、厨房、卧室、书房、门厅与中央通道；现有八波战斗均在这一张地图进行。
- `window.RED_SHIFT_MAP` 在生成房屋后发布。玩家脚底出生点为 `(0, 0, 11)`，朝向 `0.35` 弧度。
- 26 个已验证的敌人出生点分布在六个区域；全部位于可行走地面，全部可由玩家出生点通过导航网格到达。
- 67 个可见实体对应的碰撞箱；地面高度为 0；`findDropSpot` 在附近 2.4 米范围搜索合法地面。
- `navGrid` 为 0.5 米网格、60×56 格。地图方提供 `isOpen`，玩法方实现 A*；对角移动需检查相邻正交格，避免穿墙角。
- 敌人死亡碎块已读取房屋碰撞箱和地面高度，仍使用视觉效果专用的简化半径。

## 玩法方合并时

1. 保留 `index.html` 顶部的 `createHouseArena` 导入、`ensureRooms()` 中的建图与 `window.RED_SHIFT_MAP = house.map`。
2. 由 MapBridge 读取 `playerSpawn`、`enemySpawns`、`colliders`、`groundHeightAt`、`findDropSpot`、`navGrid`。地图没有提供弹药、武器或波次战斗逻辑。
3. `spawnEnemies()` 仍保留旧候选坐标，玩法方用 MapBridge 改为读取 `enemySpawns`，再实现按房间分散与 A*。地图分支没有改这段战斗函数，便于独立合并。
4. `index.html` 的 `addRoomBox` 现在为碰撞箱提供绝对 `bottom`，请保留。旧版碰撞代码暂时仍按 XZ 检查，地图接口和碎块物理已使用高度信息。
5. 武器掉落应使用 `findDropSpot` 返回的脚底坐标；返回 `null` 时安全回退。不要把掉落物计时和死亡碎块的 4 秒清理混用。

## 已验证与待联调

浏览器内确认：房屋载入无脚本错误、玩家可用 W 移动、八波模式正常进入第一波；26 个出生点全部合法且从玩家位置可达。预览时约 185 次绘制调用，碎块为每次死亡 35 块、一个 BatchedMesh。家具旁和门口仍需与玩法方的 A*、拾取系统共同测试。当前敌人 AI 仍是旧的直线移动，后部房间可能卡住；正式合并前由玩法方接入导航网格。

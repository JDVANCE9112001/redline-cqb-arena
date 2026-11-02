# 地图分支交接

本分支负责地图。完整字段定义见 [MAP_GAMEPLAY_CONTRACT.md](MAP_GAMEPLAY_CONTRACT.md)。

## 已交付

- `assets/house-map.js` 创建一张单层现代住宅，包含客厅、餐厅、厨房、卧室、书房、门厅与中央通道；现有八波战斗均在这一张地图进行。
- `window.RED_SHIFT_MAP` 在生成房屋后发布。玩家脚底出生点为 `(0, 0, 11)`，朝向 `0.35` 弧度。
- 26 个敌人出生点分布在六个区域；生成时检查至少 0.5 米障碍净空，并与玩家出生点保持安全距离。
- 67 个可见实体对应的碰撞箱；地面高度为 0；`findDropSpot` 在附近 2.4 米范围搜索合法地面。
- `navGrid` 为 0.5 米网格、60×56 格。地图方提供 `isOpen`，玩法方实现 A*；对角移动需检查相邻正交格，避免穿墙角。
- 敌人死亡碎块已读取房屋碰撞箱和地面高度，仍使用视觉效果专用的简化半径。

## 玩法方合并时

1. 保留 `index.html` 顶部的 `createHouseArena` 导入、`ensureRooms()` 中的建图与 `window.RED_SHIFT_MAP = house.map`。
2. 由 MapBridge 读取 `playerSpawn`、`enemySpawns`、`colliders`、`groundHeightAt`、`findDropSpot`、`navGrid`。地图没有提供弹药、武器或波次战斗逻辑。
3. `spawnEnemies()` 仍保留旧候选坐标，玩法方用 MapBridge 改为读取 `enemySpawns`，再实现按房间分散与 A*。地图分支没有改这段战斗函数，便于独立合并。
4. `index.html` 的 `addRoomBox` 现在为碰撞箱提供绝对 `bottom`，请保留。旧版碰撞代码暂时仍按 XZ 检查，地图接口和碎块物理已使用高度信息。
5. 武器掉落应使用 `findDropSpot` 返回的脚底坐标；返回 `null` 时安全回退。不要把掉落物计时和死亡碎块的 4 秒清理混用。

## 当前状态与联调

此前浏览器检查确认房屋载入、玩家移动和首波启动正常。地图分支提供出生点、碰撞与导航数据；玩法方接入 A* 和拾取后，仍需共同验收门口寻路、家具旁拾取和碎块碰撞。当前敌人 AI 仍是旧的直线移动，未接入导航网格前可能在隔墙或家具附近卡住。协作流程见 [COLLABORATION_AGREEMENT.md](COLLABORATION_AGREEMENT.md)。

## 新地图实验版

- `assets/house-map-v2.js` 是独立的第二版住宅布局，包含更开阔的中央客厅、中心箱体、加密的隔墙、家具掩体、侧翼房间和环形通道；尺寸为 36×34 米。
- `map-preview.html` 提供独立查看器，可切换碰撞箱、出生点和导航网格，也可进入第一人称查看；本地服务运行时从 `http://127.0.0.1:8765/map-preview.html` 打开。
- 本地 `index.html` 已接入 v2 并默认使用新地图，添加 `?map=v1` 可切回旧地图。v2 有 26 个敌人出生点、109 个碰撞箱和 72×68 的导航网格；地图版敌人使用导航网格绕障碍，并调低侦测距离、移动速度和连射强度。GitHub Pages 尚未发布这次游戏接入改动。

# 房屋地图与玩法对接约定（v1）

地图方发布 `window.RED_SHIFT_MAP`；玩法方只读取它，不读取房屋建模内部对象。地图尚未接入时，玩法方的 MapBridge 使用当前旧地图数据。坐标单位为米，Y 轴向上；出生点、掉落点和地面高度均采用**脚底世界坐标**，`yaw` 使用弧度。

```js
window.RED_SHIFT_MAP = {
  version: 1,
  playerSpawn: { x: 0, y: 0, z: 0, yaw: 0 },
  enemySpawns: [
    { id: 'living-01', x: 0, y: 0, z: 0, room: 'living', waveMin: 1, waveMax: 8 }
  ],
  colliders: [
    { minX: 0, maxX: 1, minZ: 0, maxZ: 1, bottom: 0, top: 1, walkable: false }
  ],
  groundHeightAt(x, z) { /* 返回有限的脚底 Y */ },
  isWalkable(x, z, radius = 0) { /* 返回布尔值 */ },
  findDropSpot(x, z, radius = .2) { /* 返回 { x, y, z } 或 null */ },
  navGrid: {
    originX: 0, originZ: 0, cellSize: .5, width: 1, height: 1,
    isOpen(ix, iz) { /* 敌人半径 .30 米可通过时返回 true */ }
  }
};
```

## 地图方交付

- 至少 20 个有唯一 `id` 的敌人出生点，分布在客厅、卧室、厨房、门厅和走廊。每点有 `room`、`waveMin`、`waveMax`，与墙和家具保持至少 0.5 米净空，与玩家出生点保持安全距离。
- `colliders` 与可见实体一致。`bottom`、`top` 是绝对世界高度；沙发、床、桌、柜和墙都提供 AABB。薄装饰不添加挡人的大碰撞箱。`walkable` 只表示顶面允许角色站立。
- `groundHeightAt` 返回该位置实际可站立的脚底高度；第一版全屋同层可返回 0。`findDropSpot` 搜索附近合法位置，失败时返回 `null`。
- `navGrid.isOpen` 在地图生成时预计算可通行格子，门口和家具转角预留敌人半径。地图方提供网格，玩法方实现 A* 和移动；对角移动不得穿过被封闭的墙角。
- 地图加载完成后发布接口，且在玩家与敌人生成前可用。地图切换或重建时同步更新接口数据。

## 玩法方交付

- MapBridge 优先读取 `RED_SHIFT_MAP.version === 1`，缺失时使用旧地图。敌人出生按 `room` 分散，从符合当前波次的点选择；掉落物使用 `findDropSpot` 与 `groundHeightAt`，不得写死 Y=0。
- 所有敌人 1 HP。保留精英外观与高级武器定位，取消击杀 3 名精英解锁散弹枪。
- 单武器槽。左轮 6 发；步枪 15 发；冲锋枪 20 发；散弹枪 6 发、每枪 4 颗弹丸。所有武器无法换弹。初始武器为左轮；普通手枪不作为独立掉落武器；散弹枪模型保持现有版本。
- 敌人掉落所持武器，靠近按 E 拾取，30 秒**现实时间**后清理。地图找不到合法掉落点时，玩法方做安全回退或不生成掉落物。
- 子弹、霰弹、投掷物命中时向 `damageEnemy(enemy, point, normal, impact)` 传实际运动方向。近战可复用 `impact.direction/power/radius/source`，不要以相机方向代替攻击方向。

## 碎块与联调

当前死亡效果采用约 35 个实体代理块、BatchedMesh、命中冲量和扭矩；物理运动遵循现有时间流速，前 0.12 秒有可见的分离动画。最多同时保留 4 次死亡效果，每次约 4 秒现实时间后清理。碎块读取 `RED_SHIFT_MAP.colliders` 和 `groundHeightAt`；在旧地图上读取现有碰撞数据并使用 Y=0 地面。碎块碰撞使用简化半径，属于视觉效果，不改变角色碰撞。

合并前共同验证：八波出生、房间与门口寻路、家具旁击碎、墙体与地面碎块碰撞、拾取位置、6 发左轮、30 秒清理和帧率。两方从同一基线分别开发；地图方只提交场景与接口，玩法方只提交战斗机制，合并时逐段检查 `index.html` 的差异。完整分工和合并流程见 [COLLABORATION_AGREEMENT.md](COLLABORATION_AGREEMENT.md)。

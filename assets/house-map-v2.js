// RED SHIFT map preview v2. Geometry and spatial API are intentionally isolated
// from combat code so the layout can be reviewed before it replaces the current map.
export function createHouseArenaV2({ THREE, addRoomBox, addRoomPlane, addRoomLight, roomsRoot, skyTexture }) {
  const room = {
    name: 'HOUSE_V2', title: 'THE OPEN HOUSE', level: 1, half: 18,
    group: new THREE.Group(), colliders: [], randomColliders: [], randomSpots: [],
    bounds: { minX: -17.55, maxX: 17.55, minZ: -16.55, maxZ: 16.55 },
    spawn: new THREE.Vector3(0, 1.72, 13.2), yaw: 0
  };
  room.group.name = 'ROOM_HOUSE_V2';
  roomsRoot.add(room.group);

  const mat = {
    wall: new THREE.MeshStandardMaterial({ color: 0xe7e9e7, roughness: .84 }),
    trim: new THREE.MeshStandardMaterial({ color: 0xc9cecc, roughness: .78 }),
    floor: new THREE.MeshStandardMaterial({ color: 0xb8bfbd, roughness: .93 }),
    ceiling: new THREE.MeshStandardMaterial({ color: 0xdfe5e4, roughness: .92 }),
    livingFloor: new THREE.MeshStandardMaterial({ color: 0xc8cfcc, roughness: .96 }),
    diningFloor: new THREE.MeshStandardMaterial({ color: 0xd2cec4, roughness: .96 }),
    kitchenFloor: new THREE.MeshStandardMaterial({ color: 0xc2ccca, roughness: .94 }),
    bedroomFloor: new THREE.MeshStandardMaterial({ color: 0xd0ccc5, roughness: .97 }),
    studyFloor: new THREE.MeshStandardMaterial({ color: 0xc3cbce, roughness: .96 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x9b8f7e, roughness: .82 }),
    fabric: new THREE.MeshStandardMaterial({ color: 0xaab6b5, roughness: .95 }),
    studyFabric: new THREE.MeshStandardMaterial({ color: 0x40596d, roughness: .94 }),
    rug: new THREE.MeshStandardMaterial({ color: 0x536b79, roughness: .98 }),
    light: new THREE.MeshStandardMaterial({ color: 0xf9f9f5, roughness: .92 }),
    red: new THREE.MeshStandardMaterial({ color: 0xb9162b, roughness: .72 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xd9eef1, transparent: true, opacity: .28, depthWrite: false, roughness: .12, side: THREE.DoubleSide })
  };
  const box = (m, w, h, d, x, y, z, opts = {}) => addRoomBox(room, m, w, h, d, x, y, z, opts);
  const solid = (m, w, h, d, x, y, z, opts = {}) => box(m, w, h, d, x, y, z, { solid: true, cast: Math.max(w, h, d) >= 1.2, ...opts });
  const floor = (w, d, x, z, m = mat.floor) => box(m, w, .035, d, x, .018, z, { ignoreRay: true });
  const wallX = (x, z1, z2) => solid(mat.wall, .28, 4.55, z2 - z1, x, 2.275, (z1 + z2) / 2);
  const wallZ = (z, x1, x2) => solid(mat.wall, x2 - x1, 4.55, .28, (x1 + x2) / 2, 2.275, z);

  // Floors stay open to the sky in the viewer so the whole plan is readable.
  addRoomPlane(room, mat.floor, 36, 34, 0, 0, 0, -Math.PI / 2);
  floor(9.2, 10.4, 0, 9.0, mat.livingFloor);
  floor(9.5, 8.4, 10.3, 7.0, mat.diningFloor);
  floor(9.2, 7.6, 10.3, -8.0, mat.kitchenFloor);
  floor(9.4, 8.0, -10.8, -10.6, mat.bedroomFloor);
  floor(9.4, 7.4, -10.8, -.8, mat.studyFloor);

  // Exterior shell: long window openings with glass, plus a centered entry door.
  solid(mat.wall, 36, .55, .3, 0, .275, -16.85);
  solid(mat.wall, 16.2, .55, .3, -9.9, .275, 16.85);
  solid(mat.wall, 16.2, .55, .3, 9.9, .275, 16.85);
  solid(mat.wall, 36, .72, .3, 0, 4.22, -16.85);
  solid(mat.wall, 36, .72, .3, 0, 4.22, 16.85);
  for (const x of [-14.5, -9.0, -3.5, 3.5, 9.0, 14.5]) {
    solid(mat.wall, .34, 2.95, .36, x, 2.15, -16.85);
    solid(mat.wall, .34, 2.95, .36, x, 2.15, 16.85);
  }
  for (const x of [-11.75, -6.25, 0, 6.25, 11.75]) {
    solid(mat.glass, 4.95, 2.78, .07, x, 2.15, -16.85, { cast: false });
    if (Math.abs(x) > 2.5) solid(mat.glass, 4.95, 2.78, .07, x, 2.15, 16.85, { cast: false });
  }
  // Leave a front entry gap between the two center columns.
  for (const x of [-1.8, 1.8]) solid(mat.wall, .34, 2.95, .36, x, 2.15, 16.85);
  // Correct the bottom/top strips across the door with trim, not a blocker.
  box(mat.wood, 2.9, .08, .34, 0, 3.76, 16.85, { ignoreRay: true });
  for (const side of [-1, 1]) {
    solid(mat.wall, .3, .55, 34, side * 17.85, .275, 0);
    solid(mat.wall, .3, .72, 34, side * 17.85, 4.22, 0);
    for (const z of [-13.4, -7.8, -2.2, 3.4, 9.0, 14.2])
      solid(mat.wall, .34, 2.95, .38, side * 17.85, 2.15, z);
    for (const z of [-10.6, -5.0, .6, 6.2, 11.8]) {
      solid(mat.glass, .07, 2.78, 5.15, side * 17.85, 2.15, z, { cast: false });
      box(mat.trim, .08, .06, 5.15, side * 17.79, .72, z, { ignoreRay: true });
      box(mat.trim, .08, .06, 5.15, side * 17.79, 3.58, z, { ignoreRay: true });
    }
    const sky = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.DoubleSide, depthWrite: false });
    addRoomPlane(room, sky, 32, 6, side * 20.4, 2.75, 0, 0, side < 0 ? Math.PI / 2 : -Math.PI / 2, { receive: false, ignoreRay: true });
  }
  const door = box(mat.wood, 2.7, 2.86, .10, -1.35, 1.53, 15.5, { ignoreRay: true });
  door.rotation.y = Math.PI / 2;
  box(mat.wood, .09, .09, .07, -1.35, 1.48, 14.2, { ignoreRay: true });

  // Interior partitions keep doors broad and preserve a loop around the central room.
  for (const [a, b] of [[-15.65, -11.6], [-8.6, -4.1], [-1.1, 4.3], [7.4, 11.5], [14.4, 15.65]]) wallX(-5.35, a, b);
  for (const [a, b] of [[-15.65, -11.2], [-7.5, -2.0], [2.2, 5.8], [9.6, 15.65]]) wallX(5.35, a, b);
  // Short wing dividers define study/bedroom and kitchen/dining without sealing them.
  wallZ(-5.8, -15.65, -12.4); wallZ(-5.8, -9.2, -5.35);
  wallZ(-1.6, 5.35, 8.0); wallZ(-1.6, 11.8, 15.65);
  wallZ(5.8, -5.35, -1.35); wallZ(5.8, 1.35, 5.35);
  // Full-height partitions make the entry foyer and rear storage room feel like
  // proper rooms, with wide doorways that keep the house route readable.
  wallZ(6.0, -5.35, -1.45); wallZ(6.0, 1.45, 5.35);
  wallZ(-12.0, -5.35, -1.45); wallZ(-12.0, 1.45, 5.35);

  // Enclose a compact pantry off the kitchen. The existing shelf becomes its
  // visual anchor; the doorway stays wide enough for both the player and AI.
  wallX(11.35, -7.5, -5.35); wallX(11.35, -3.55, -1.8);
  wallZ(-7.5, 11.35, 13.35); wallZ(-7.5, 14.95, 17.6);
  wallZ(-1.8, 11.35, 11.8); wallZ(-1.8, 15.65, 17.6);
  wallX(17.6, -7.5, -1.8);

  // Furniture builders: every substantial object uses the same visible/collision dimensions.
  const table = (x, z, w, d, h = .78, m = mat.wood) => {
    solid(m, w, h, d, x, h / 2, z);
    box(mat.light, w + .08, .06, d + .08, x, h + .03, z, { ignoreRay: true });
  };
  const sofa = (x, z, w = 3.2, yaw = 0, upholstery = mat.fabric) => {
    const parts = [[w, .62, 1.35, 0, .31, 0], [w, .82, .24, 0, .92, -.56], [w - .24, .18, .92, 0, .70, .02], [.26, .64, 1.32, -w / 2 + .13, .70, 0], [.26, .64, 1.32, w / 2 - .13, .70, 0]];
    for (const [pw, ph, pd, ox, py, oz] of parts) {
      const meshX = x + ox * Math.cos(yaw) + oz * Math.sin(yaw);
      const meshZ = z - ox * Math.sin(yaw) + oz * Math.cos(yaw);
      solid(upholstery, pw, ph, pd, meshX, py, meshZ, { ry: yaw });
    }
  };
  const shelf = (x, z, w = 1.6, h = 2.5) => {
    solid(mat.trim, w, h, .62, x, h / 2, z);
    for (let y = .45; y < h - .2; y += .52) box(mat.wood, w + .04, .05, .66, x, y, z, { ignoreRay: true });
    for (let i = -1; i <= 1; i++) box(mat.red, .09, .25, .18, x + i * w * .24, 1.05, z + .32, { ignoreRay: true });
  };
  const plant = (x, z) => {
    solid(mat.wood, .52, .48, .52, x, .24, z);
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(.5, 1), mat.fabric);
    crown.position.set(x, .98, z); crown.userData.ignoreRay = true; room.group.add(crown);
  };

  // Central living room: open loop lanes around a landmark crate and layered furniture cover.
  sofa(-3.55, 10.5, 3.7, Math.PI / 2);
  table(-2.0, 7.8, 1.9, 1.05, .46);
  solid(mat.wood, 2.9, 1.35, 1.35, 0, .675, 1.2, { cast: true });
  box(mat.red, 2.35, .16, 1.42, 0, 1.38, 1.2, { ignoreRay: true });
  sofa(3.6, 10.1, 3.3, -Math.PI / 2);
  solid(mat.trim, 2.4, .72, .52, 4.5, .36, 8.0);
  // Keep the long sightline beside the console clear; the screen was visual-only.
  floor(6.8, 5.8, 0, 9.4, mat.livingFloor);
  plant(-4.5, 13.6); plant(4.45, 13.6);

  // Dining and kitchen on the east side; the central island is waist-high cover.
  table(10.5, 8.2, 3.5, 1.65, .8);
  for (const [x, z] of [[8.4, 8.2], [12.6, 8.2], [10.5, 6.8], [10.5, 9.6]]) {
    solid(mat.trim, .65, .55, .65, x, .275, z);
    box(mat.fabric, .67, .11, .67, x, .61, z, { ignoreRay: true });
  }
  shelf(15.0, 12.2, 1.5, 2.4);
  solid(mat.trim, 7.8, .9, 1.15, 10.6, .45, -14.3);
  solid(mat.trim, 1.12, .9, 7.0, 15.1, .45, -9.8);
  table(9.2, -8.0, 3.2, 1.6, .92, mat.trim);
  box(mat.red, .62, .14, .62, 9.2, .98, -8.0, { ignoreRay: true });
  shelf(15.1, -3.8, 1.5, 2.45);

  // West rooms: bedroom and study. Low objects create alternate cover routes.
  solid(mat.wood, 3.6, .52, 3.9, -10.6, .26, -11.1);
  box(mat.light, 3.45, .2, 3.72, -10.6, .62, -11.1, { ignoreRay: true });
  box(mat.fabric, 3.45, .65, .25, -10.6, .98, -13.0, { ignoreRay: true });
  table(-14.0, -9.0, .85, .72, .6); shelf(-6.4, -12.8, 1.7, 2.75);
  table(-11.0, -1.2, 3.0, 1.1, .8);
  solid(mat.trim, .65, .56, .65, -11.0, .28, .35);
  sofa(-7.2, 1.6, 2.65, Math.PI / 2);
  shelf(-15.0, 2.0, 1.35, 2.6); shelf(-6.3, -3.4, 1.25, 2.4);

  // Give the west foyer a bold living-room cluster visible from the entry.
  box(mat.rug, 6.3, .035, 7.1, -9.65, .041, 11.15, { ignoreRay: true });
  sofa(-8.45, 12.0, 3.65, 0, mat.studyFabric);
  for (const x of [-9.35, -7.55]) {
    box(mat.red, .48, .20, .22, x, 1.03, 11.39, { ignoreRay: true });
  }
  table(-8.45, 9.55, 2.55, 1.18, .46);
  table(-12.0, 12.0, .72, .72, .48, mat.trim);

  // A compact workstation and bookcase fill the rear corner without blocking
  // the route between the spawn and the central rooms.
  shelf(-14.2, 12.9, 1.45, 2.8);
  table(-11.6, 9.1, 3.0, .95, .76);
  box(mat.darkMetal, 1.0, .08, .58, -11.6, .82, 9.1, { ignoreRay: true });
  box(mat.red, .54, .035, .32, -11.6, .875, 9.1, { ignoreRay: true });
  for (const x of [-12.65, -10.55]) {
    solid(mat.wood, .55, .44, .55, x, .22, 7.95, { cast: true });
    solid(mat.fabric, .62, .12, .62, x, .50, 7.95, { cast: true });
  }
  sofa(-8.8, 8.8, 2.4, Math.PI / 2);
  table(-8.0, 13.3, 1.15, .72, .58, mat.trim);

  // Entrance hall and small landmarks help identify direction while testing.
  table(-3.5, 12.0, 2.5, .62, .68);
  box(mat.red, .46, .42, .46, -3.5, .95, 12.0, { ignoreRay: true });

  // Waist-high room dividers break up exposed lanes but leave a path around
  // each end, so every new piece works as cover without becoming a dead end.
  const combatCover = (x, z, w, d, yaw = 0) => {
    const frontX = x + Math.sin(yaw) * (d / 2 + .014);
    const frontZ = z + Math.cos(yaw) * (d / 2 + .014);
    solid(mat.trim, w, .98, d, x, .49, z, { ry: yaw, cast: true });
    solid(mat.wood, w * .88, .12, d + .025, x, .20, z, { ry: yaw, cast: true });
    box(mat.red, w * .58, .035, .024, frontX, .69, frontZ, { ry: yaw, ignoreRay: true });
    box(mat.chrome, w + .08, .035, d + .08, x, 1.01, z, { ry: yaw, ignoreRay: true });
  };
  combatCover(-3.05, 3.65, 1.75, .58);
  combatCover(3.05, 3.65, 1.75, .58);
  combatCover(12.8, 3.3, 1.9, .60);
  combatCover(12.45, -7.4, 1.75, .58);
  combatCover(-13.25, -3.4, 1.8, .58, Math.PI / 2);
  combatCover(7.0, 11.7, 1.6, .54);
  combatCover(-13.1, -7.0, 1.55, .54, Math.PI / 2);
  combatCover(7.0, -11.0, 1.65, .56);
  combatCover(0, 8.2, 2.0, .62);
  combatCover(-7.1, 7.5, 1.7, .58, Math.PI / 2);
  combatCover(-13.25, 14.0, 1.65, .56);
  combatCover(-12.8, 6.8, 2.0, .68);
  combatCover(-4.15, -4.4, 1.75, .62);
  combatCover(4.15, -4.4, 1.75, .62);
  combatCover(0, -9.3, 2.1, .64);

  // Low ceilings over room clusters make the new partitions read as rooms
  // instead of freestanding dividers. The central hall remains double-height.
  const ceilingPanel = (x, z, w, d) => {
    box(mat.ceiling, w, .10, d, x, 4.57, z, { ignoreRay: true, receive: false });
    box(mat.light, Math.min(2.4, w * .42), .035, .48, x, 4.50, z, { ignoreRay: true, receive: false });
    addRoomLight(room, 0xfff3df, 2.2, x, 3.75, z, 9.0);
  };
  ceilingPanel(0, 11.1, 10.35, 10.6);       // enclosed entry foyer
  ceilingPanel(0, -14.25, 10.35, 4.35);     // rear storage room
  ceilingPanel(14.45, -4.65, 6.1, 5.45);  // kitchen pantry

  // Lighting panels and broad, soft room lights.
  for (const [x, z, w] of [[0, 8, 3.0], [10, 7, 2.7], [10, -8, 2.6], [-11, -11, 2.4], [-11, 0, 2.4], [0, -11, 2.0]]) {
    box(mat.light, w, .04, .7, x, 4.48, z, { ignoreRay: true });
    addRoomLight(room, 0xf8fbff, 4, x, 3.65, z, 8.5);
  }

  // Widen the existing ground floor without changing its room proportions.
  // Geometry, collision data, spawn, and navigation share the same transform.
  const arenaScale = 1.18;
  room.group.scale.set(arenaScale, 1, arenaScale);
  room.bounds.minX *= arenaScale; room.bounds.maxX *= arenaScale;
  room.bounds.minZ *= arenaScale; room.bounds.maxZ *= arenaScale;
  room.spawn.x *= arenaScale; room.spawn.z *= arenaScale;
  for (const c of room.colliders) {
    c.minX *= arenaScale; c.maxX *= arenaScale;
    c.minZ *= arenaScale; c.maxZ *= arenaScale;
  }
  const inside = (x, z, r) => x >= room.bounds.minX + r && x <= room.bounds.maxX - r && z >= room.bounds.minZ + r && z <= room.bounds.maxZ - r;
  const isWalkable = (x, z, radius = 0) => {
    if (!Number.isFinite(x) || !Number.isFinite(z) || !inside(x, z, radius)) return false;
    for (const c of room.colliders) {
      const cx = Math.max(c.minX, Math.min(x, c.maxX));
      const cz = Math.max(c.minZ, Math.min(z, c.maxZ));
      if ((x - cx) ** 2 + (z - cz) ** 2 < radius * radius + 1e-6) return false;
    }
    return true;
  };
  const roomAt = (worldX, worldZ) => {
    const x = worldX / arenaScale, z = worldZ / arenaScale;
    if (x > 11.35 && x < 17.6 && z > -7.5 && z < -1.8) return 'pantry';
    if (Math.abs(x) < 5.35 && z < -12.0) return 'storage';
    if (Math.abs(x) < 5.35 && z > 6.0) return 'foyer';
    if (x < -5.5 && z < -5.8) return 'bedroom';
    if (x < -5.5) return 'study';
    if (x > 5.5 && z < -1.6) return 'kitchen';
    if (x > 5.5) return 'dining';
    if (z > 11) return 'foyer';
    return 'living';
  };
  const planned = [
    [-14.5, 12.8], [-11.5, 13.3], [-7.0, 12.8], [-4.2, 12.5], [4.2, 12.5], [7.0, 13.0], [13.8, 13.0],
    [-14.6, 6.5], [-7.1, 5.9], [-3.8, 5.8], [3.8, 5.8], [7.0, 4.0], [14.2, 4.0], [14.1, 10.5],
    [-14.5, -.8], [-7.0, -1.8], [-3.8, -2.8], [3.8, -3.0], [7.0, -4.0], [14.3, -2.8],
    [-14.4, -6.3], [-7.1, -7.4], [-14.4, -13.7], [-7.4, -14.1], [7.0, -12.0], [14.2, -12.2],
    [-2.8, -12.8], [2.8, -12.8], [-2.8, 1.4], [2.8, 1.4]
  ];
  const plannedWorld = planned.map(([x, z]) => [x * arenaScale, z * arenaScale]);
  const points = plannedWorld.filter(([x, z]) => isWalkable(x, z, .5) && Math.hypot(x - room.spawn.x, z - room.spawn.z) >= 5.0);
  for (let z = -14.5; points.length < 26 && z <= 14.5; z += 2.2) {
    for (let x = -15.5; points.length < 26 && x <= 15.5; x += 2.2) {
      if (!isWalkable(x, z, .5) || Math.hypot(x - room.spawn.x, z - room.spawn.z) < 5) continue;
      if (points.some(([px, pz]) => Math.hypot(x - px, z - pz) < 2.2)) continue;
      points.push([x, z]);
    }
  }
  const enemySpawns = points.map(([x, z], i) => {
    const area = roomAt(x, z);
    return { id: `${area}-${String(i + 1).padStart(2, '0')}`, x, y: 0, z, room: area,
      waveMin: ['bedroom', 'study', 'kitchen', 'pantry', 'storage'].includes(area) ? 3 : 1, waveMax: 8 };
  });
  const findDropSpot = (x, z, radius = .2) => {
    for (let distance = 0; distance <= 2.4; distance += .3) {
      const count = distance === 0 ? 1 : Math.ceil(12 + distance * 12);
      for (let i = 0; i < count; i++) {
        const angle = i * Math.PI * 2 / count;
        const px = x + Math.cos(angle) * distance, pz = z + Math.sin(angle) * distance;
        if (isWalkable(px, pz, radius)) return { x: px, y: 0, z: pz };
      }
    }
    return null;
  };
  const cellSize = .5, originX = -23, originZ = -22, width = 92, height = 88;
  const open = new Uint8Array(width * height);
  for (let iz = 0; iz < height; iz++) for (let ix = 0; ix < width; ix++)
    open[iz * width + ix] = isWalkable(originX + (ix + .5) * cellSize, originZ + (iz + .5) * cellSize, .32) ? 1 : 0;
  const map = {
    version: 1,
    playerSpawn: { x: room.spawn.x, y: 0, z: room.spawn.z, yaw: room.yaw },
    enemySpawns, colliders: room.colliders,
    groundHeightAt() { return 0; }, isWalkable, findDropSpot,
    navGrid: { originX, originZ, cellSize, width, height,
      isOpen(ix, iz) { return ix >= 0 && iz >= 0 && ix < width && iz < height && open[iz * width + ix] === 1; } }
  };
  room.map = map;
  room.group.visible = true;
  return room;
}

// The house owns geometry and spatial data. Combat code reads the returned map.
export function createHouseArena({ THREE, M, addRoomBox, addRoomPlane, addRoomLight, roomsRoot, skyTexture }) {
  const room = {
    name: 'HOUSE', title: 'RESIDENCE', level: 1, half: 15.5,
    group: new THREE.Group(), colliders: [], randomColliders: [], randomSpots: [],
    bounds: { minX: -14.9, maxX: 14.9, minZ: -13.9, maxZ: 13.9 },
    spawn: new THREE.Vector3(0, 1.72, 11.0), yaw: .35
  };
  room.group.name = 'ROOM_HOUSE';
  roomsRoot.add(room.group);

  const H = {
    plaster: new THREE.MeshStandardMaterial({ color: 0xe0e4e5, roughness: .78 }),
    ivory: new THREE.MeshStandardMaterial({ color: 0xcbd1d2, roughness: .7 }),
    concrete: new THREE.MeshStandardMaterial({ color: 0xc1c9cc, roughness: .72 }),
    oak: new THREE.MeshStandardMaterial({ color: 0xb4a99c, roughness: .68 }),
    fabric: new THREE.MeshStandardMaterial({ color: 0xaebec3, roughness: .92 }),
    cushion: new THREE.MeshStandardMaterial({ color: 0xf8f8f5, roughness: .9 }),
    frame: new THREE.MeshStandardMaterial({ color: 0x333e44, roughness: .48, metalness: .18 }),
    screen: new THREE.MeshBasicMaterial({ color: 0x17242d, toneMapped: false }),
    rug: new THREE.MeshStandardMaterial({ color: 0xbcc8cd, roughness: .96 }),
    softRed: new THREE.MeshStandardMaterial({ color: 0xac182e, roughness: .55 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xc9e2ea, transparent: true, opacity: .35, depthWrite: false, roughness: .08, side: THREE.DoubleSide })
  };
  const box = (mat, w, h, d, x, y, z, opts = {}) =>
    addRoomBox(room, mat, w, h, d, x, y, z, opts);
  const solid = (mat, w, h, d, x, y, z, opts = {}) =>
    box(mat, w, h, d, x, y, z, { solid: true, cast: true, ...opts });
  const rug = (w, d, x, z) => box(H.rug, w, .018, d, x, .019, z, { ignoreRay: true });
  const light = (x, z, w = 2.4, d = .65) => {
    box(M.lightPanel, w, .035, d, x, 4.61, z, { ignoreRay: true });
    box(H.frame, w + .1, .06, .055, x, 4.57, z - d / 2, { ignoreRay: true });
    box(H.frame, w + .1, .06, .055, x, 4.57, z + d / 2, { ignoreRay: true });
  };

  // Outside: real window openings break up the silhouette and show sky.
  addRoomPlane(room, H.ivory, 31, 29, 0, .002, 0, -Math.PI / 2, 0);
  addRoomPlane(room, H.plaster, 31, 29, 0, 4.68, 0, Math.PI / 2, 0);
  const sky = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.DoubleSide, depthWrite: false });
  for (const side of [-1, 1]) {
    const x = side * 15.5;
    solid(H.plaster, .32, 1.1, 29, x, .55, 0);
    solid(H.plaster, .32, .95, 29, x, 4.20, 0);
    for (const z of [-14.3, -8.6, -2.9, 2.8, 8.5, 14.2])
      solid(H.plaster, .34, 2.65, .45, x, 2.43, z);
    for (const z of [-11.45, -5.75, -.05, 5.65, 11.35]) {
      solid(H.glass, .075, 2.65, 5.24, x, 2.43, z, { cast: false });
      box(H.frame, .08, .05, 5.24, x - side * .035, 1.10, z, { ignoreRay: true });
      box(H.frame, .08, .05, 5.24, x - side * .035, 3.75, z, { ignoreRay: true });
    }
    addRoomPlane(room, sky, 29, 6, side * 19.0, 2.8, 0, 0, side < 0 ? Math.PI / 2 : -Math.PI / 2, { receive: false, ignoreRay: true });
  }
  solid(H.plaster, 31, 4.68, .32, 0, 2.34, -14.5);
  solid(H.plaster, 31, 4.68, .32, 0, 2.34, 14.5);
  box(H.frame, 2.7, 3.8, .055, 0, 2.05, 14.31, { ignoreRay: true });
  box(H.glass, 2.4, 3.5, .06, 0, 2.05, 14.27, { ignoreRay: true });
  for (const x of [-14.9, 14.9]) box(H.oak, .08, .16, 28.4, x, .08, 0, { ignoreRay: true });
  for (const z of [-14.0, 14.0]) box(H.oak, 30, .16, .08, 0, .08, z, { ignoreRay: true });

  // Full-height partitions have generous gaps. The lintels are above head height.
  const wallX = (x, z1, z2) => solid(H.plaster, .26, 4.66, z2 - z1, x, 2.33, (z1 + z2) / 2);
  const wallZ = (z, x1, x2) => solid(H.plaster, x2 - x1, 4.66, .26, (x1 + x2) / 2, 2.33, z);
  wallX(-4.3, -14.3, -12.2);
  wallX(-4.3, -10.0, -4.5);
  wallX(-4.3, -2.1, .6);
  wallZ(-7.8, -15.3, -11.5);
  wallZ(-7.8, -9.0, -4.3);
  wallX(4.3, -14.3, -8.9);
  wallX(4.3, -6.2, .6);
  wallX(4.3, 1.0, 5.0);
  wallX(4.3, 8.0, 14.3);
  // Partial-height dining screen keeps sight lines open across the front rooms.
  solid(H.ivory, .24, 1.24, 3.0, 4.3, .62, 11.4);
  for (const [x, z, alongX] of [[-4.3, -11.1, false], [-4.3, -3.3, false], [4.3, -7.55, false], [4.3, 6.5, false], [-10.25, -7.8, true]]) {
    if (alongX) box(H.oak, 2.5, .11, .32, x, 4.27, z, { ignoreRay: false });
    else box(H.oak, .32, .11, 2.4, x, 4.27, z, { ignoreRay: false });
  }

  function sofa(x, z, width = 3.8, facing = 1) {
    solid(H.fabric, width, .62, 1.55, x, .31, z);
    box(H.cushion, width - .25, .17, .96, x, .69, z - facing * .18);
    box(H.fabric, width, .87, .30, x, .95, z + facing * .63);
    for (const side of [-1, 1]) box(H.fabric, .28, .64, 1.52, x + side * (width / 2 - .14), .73, z);
    for (const side of [-1, 1]) box(H.cushion, width * .43, .11, .7, x + side * width * .225, .81, z - facing * .18);
  }
  function shelf(x, z, w = 1.5, d = .55, h = 2.9) {
    solid(H.ivory, w, h, d, x, h / 2, z);
    for (const y of [.6, 1.22, 1.84, 2.46]) box(H.oak, w + .06, .055, d + .06, x, y, z);
    for (const i of [-1, 0, 1]) box(H.frame, .075, .29, .16, x + i * w * .24, 1.45, z + d / 2 + .03);
  }
  function chair(x, z, facing = 1) {
    solid(H.ivory, .68, .58, .68, x, .29, z);
    box(H.fabric, .68, .12, .68, x, .64, z);
    box(H.ivory, .68, .78, .12, x, 1.02, z + facing * .30);
  }
  function table(x, z, w, d, h = .78) {
    solid(H.oak, w, h, d, x, h / 2, z);
    box(H.ivory, w + .10, .065, d + .10, x, h + .03, z);
  }
  function plant(x, z) {
    solid(H.ivory, .48, .52, .48, x, .26, z, { cast: false });
    box(H.oak, .54, .06, .54, x, .54, z);
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(.52, 1), H.fabric);
    crown.position.set(x, 1.03, z);
    crown.castShadow = false;
    crown.userData.ignoreRay = true;
    room.group.add(crown);
  }

  // Living room: readable furniture silhouettes and multiple cover lanes.
  rug(8.3, 7.1, -9.7, 7.1);
  sofa(-10.6, 8.6, 4.2, 1);
  sofa(-6.6, 3.6, 2.5, -1);
  table(-10.1, 5.5, 2.7, 1.35, .52);
  solid(H.ivory, 3.7, .72, .62, -9.8, .36, 1.40);
  box(H.screen, 3.2, 1.65, .10, -9.8, 1.76, 1.16);
  shelf(-13.5, 3.0, 1.55, .65, 3.1);
  plant(-13.3, 11.6);
  box(H.softRed, .12, 1.0, 1.0, -14.95, 2.4, 7.2, { ignoreRay: true });

  // Dining room and front entry.
  rug(7.8, 6.8, 9.5, 7.8);
  table(9.6, 7.3, 3.9, 2.05, .78);
  chair(6.9, 7.3, 1); chair(12.3, 7.3, -1);
  chair(8.8, 5.8, 1); chair(10.5, 8.8, -1);
  shelf(13.4, 2.7, 1.55, .65, 2.4);
  plant(13.1, 11.7);
  rug(4.1, 3.2, 0, 11.8);
  table(0, 13.4, 2.4, .55, .7);
  box(H.frame, .95, 1.25, .055, -3.7, 2.2, 11.5, { ignoreRay: true });

  // Bedroom behind the left partition.
  rug(5.5, 4.6, -10.6, -11.0);
  solid(H.oak, 3.1, .52, 3.65, -10.7, .26, -11.25);
  box(H.cushion, 2.95, .20, 3.45, -10.7, .62, -11.25);
  box(H.fabric, 2.95, .65, .28, -10.7, .96, -13.0);
  for (const x of [-11.4, -10.0]) box(H.cushion, 1.05, .12, .48, x, .77, -9.85);
  table(-13.5, -10.0, .8, .65, .60);
  shelf(-5.8, -12.0, 1.8, .72, 3.2);
  box(H.frame, 1.7, 1.0, .045, -8.2, 2.45, -14.20, { ignoreRay: true });

  // Study: desk, books and a low seat create cover without closing the route.
  rug(6.8, 5.2, -10.0, -3.0);
  table(-11.0, -5.4, 3.2, 1.2, .80);
  chair(-11.0, -3.9, -1);
  shelf(-13.3, -1.4, 1.65, .65, 3.2);
  shelf(-6.1, -6.4, 1.25, .6, 2.8);
  sofa(-8.0, -1.3, 2.5, -1);

  // Kitchen: counters form a U with a central island and a wide door to the hall.
  rug(6.0, 5.0, 9.7, -6.0);
  solid(H.ivory, 7.0, .91, 1.25, 10.3, .455, -12.9);
  box(H.oak, 7.1, .07, 1.36, 10.3, .945, -12.9);
  solid(H.ivory, 1.28, .91, 7.9, 13.7, .455, -7.0);
  box(H.oak, 1.37, .07, 8.0, 13.7, .945, -7.0);
  table(9.4, -6.1, 3.5, 1.75, .86);
  solid(H.ivory, 1.15, 2.75, 1.18, 5.6, 1.375, -12.0);
  box(H.frame, .83, .07, .46, 8.3, .99, -12.18, { ignoreRay: true });
  shelf(13.7, -1.3, 1.55, .65, 2.4);

  // Hall has a clear route to every doorway, with small sculptural landmarks.
  rug(5.0, 12.4, 0, -6.5);
  solid(H.concrete, 1.0, .88, 1.0, 0, .44, -5.4);
  const sculpture = new THREE.Mesh(new THREE.IcosahedronGeometry(.32, 0), H.softRed);
  sculpture.position.set(0, 1.18, -5.4);
  sculpture.userData.ignoreRay = true;
  room.group.add(sculpture);
  table(2.3, -12.9, 1.2, .55, .70);

  for (const [x, z, w, d] of [[-9.8, 7.0, 2.8, .72], [9.4, 7.3, 3.2, .72], [-10.0, -11.2, 2.3, .6], [-10.0, -3.6, 2.4, .6], [9.5, -6.0, 2.6, .6], [0, -6.8, 2.4, .6]])
    light(x, z, w, d);
  addRoomLight(room, 0xf4f8ff, 5, -8, 3.7, 5, 12);
  addRoomLight(room, 0xf4f8ff, 5, 9, 3.7, 5, 12);
  addRoomLight(room, 0xf5f6ff, 4, 0, 3.7, -7, 13);

  const inside = (x, z, radius) =>
    x >= room.bounds.minX + radius && x <= room.bounds.maxX - radius &&
    z >= room.bounds.minZ + radius && z <= room.bounds.maxZ - radius;
  const isWalkable = (x, z, radius = 0) => {
    if (!Number.isFinite(x) || !Number.isFinite(z) || !inside(x, z, radius)) return false;
    for (const c of room.colliders) {
      const cx = Math.max(c.minX, Math.min(x, c.maxX));
      const cz = Math.max(c.minZ, Math.min(z, c.maxZ));
      if ((x - cx) ** 2 + (z - cz) ** 2 < radius * radius + 1e-6) return false;
    }
    return true;
  };
  const roomAt = (x, z) => {
    if (z < -7.8 && x < -4.3) return 'bedroom';
    if (z < .8 && x < -4.3) return 'study';
    if (z < .8 && x > 4.3) return 'kitchen';
    if (z < .8) return 'hall';
    if (z > 9 && x > -4 && x < 4) return 'foyer';
    return x < 4.3 ? 'living' : 'dining';
  };
  const planned = [
    [-13.5, 12.0], [-11.8, 3.5], [-7.0, 11.5], [-5.1, 4.7], [-13.0, 1.7], [-7.0, 1.9],
    [6.0, 12.0], [12.2, 12.0], [6.0, 3.2], [12.0, 4.0], [5.0, 10.0],
    [-2.8, 12.0], [2.8, 12.0], [0, 3.1], [-2.4, -1.7], [2.3, -2.0],
    [-2.3, -7.0], [2.4, -8.0], [0, -12.1],
    [-13.1, -12.0], [-8.0, -9.2], [-6.0, -12.0],
    [-13.2, -6.0], [-8.0, -5.1], [-6.1, -2.2],
    [6.0, -3.0], [11.6, -3.2], [6.2, -10.1], [11.3, -9.7]
  ];
  const points = planned.filter(([x, z]) =>
    isWalkable(x, z, .42) && Math.hypot(x - room.spawn.x, z - room.spawn.z) >= 5.0);
  // Supply spare spots if furniture moved during art iteration.
  for (let z = -12.5; points.length < 26 && z <= 12.5; z += 2.3) {
    for (let x = -13.5; points.length < 26 && x <= 13.5; x += 2.3) {
      if (!isWalkable(x, z, .5) || Math.hypot(x - room.spawn.x, z - room.spawn.z) < 5) continue;
      if (points.some(([px, pz]) => Math.hypot(x - px, z - pz) < 2)) continue;
      points.push([x, z]);
    }
  }
  const enemySpawns = points.map(([x, z], i) => {
    const area = roomAt(x, z);
    return { id: `${area}-${String(i + 1).padStart(2, '0')}`, x, y: 0, z,
      room: area, waveMin: ['bedroom', 'study', 'kitchen'].includes(area) ? 3 : 1, waveMax: 8 };
  });
  const findDropSpot = (x, z, radius = .2) => {
    for (let distance = 0; distance <= 2.4; distance += .3) {
      const count = distance === 0 ? 1 : Math.ceil(12 + distance * 12);
      for (let i = 0; i < count; i++) {
        const angle = i * Math.PI * 2 / count;
        const px = x + Math.cos(angle) * distance;
        const pz = z + Math.sin(angle) * distance;
        if (isWalkable(px, pz, radius)) return { x: px, y: 0, z: pz };
      }
    }
    return null;
  };
  const cellSize = .5;
  const originX = -15, originZ = -14;
  const width = 60, height = 56;
  const open = new Uint8Array(width * height);
  for (let iz = 0; iz < height; iz++) for (let ix = 0; ix < width; ix++)
    open[iz * width + ix] = isWalkable(originX + (ix + .5) * cellSize,
      originZ + (iz + .5) * cellSize, .32) ? 1 : 0;
  const map = {
    version: 1,
    playerSpawn: { x: room.spawn.x, y: 0, z: room.spawn.z, yaw: room.yaw },
    enemySpawns,
    colliders: room.colliders,
    groundHeightAt() { return 0; },
    isWalkable,
    findDropSpot,
    navGrid: { originX, originZ, cellSize, width, height,
      isOpen(ix, iz) { return ix >= 0 && iz >= 0 && ix < width && iz < height && open[iz * width + ix] === 1; } }
  };
  room.map = map;
  room.group.visible = false;
  return room;
}

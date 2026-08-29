/** Four-component memory store + bridges. */
export function freshStore() {
  return {
    gc: new Map(),
    arena: new Map(),
    aff: new Map(),
    roots: new Set(),
    next: 1,
  };
}

export function wf(sigma) {
  for (const loc of sigma.roots) {
    if (!sigma.gc.has(loc)) return false;
  }
  for (const [loc, v] of sigma.aff) {
    if (v !== null && typeof v === "object" && v.gc && !sigma.gc.has(v.gc)) return false;
    if (v !== null && typeof v === "object" && v.gc && !sigma.roots.has(v.gc)) return false;
  }
  for (const [rid, block] of sigma.arena) {
    if (block.dead) {
      for (const loc of sigma.gc.keys()) {
        const val = sigma.gc.get(loc);
        if (val && val.arena === rid) return false;
      }
    }
  }
  return true;
}

export function allocAff(sigma, value) {
  const loc = "aff:" + sigma.next++;
  sigma.aff.set(loc, value);
  return loc;
}

export function allocGc(sigma, value) {
  const loc = "gc:" + sigma.next++;
  sigma.gc.set(loc, value);
  return loc;
}

export function enterArena(sigma) {
  const rid = "rho:" + sigma.next++;
  sigma.arena.set(rid, { dead: false, cells: new Map() });
  return rid;
}

export function allocArena(sigma, rid, value) {
  const block = sigma.arena.get(rid);
  const loc = "ar:" + sigma.next++;
  block.cells.set(loc, value);
  return loc;
}

export function teardownArena(sigma, rid) {
  const block = sigma.arena.get(rid);
  block.dead = true;
  block.cells.clear();
}

export function bridgeAffToGc(sigma, affLoc) {
  const v = sigma.aff.get(affLoc);
  if (v === null || v === undefined) throw new Error("use-after-move");
  sigma.aff.set(affLoc, null);
  return allocGc(sigma, v);
}

export function bridgeArenaToGc(sigma, rid, arLoc) {
  const block = sigma.arena.get(rid);
  if (!block || block.dead) throw new Error("dangling arena");
  const v = block.cells.get(arLoc);
  const copy = structuredClone ? structuredClone(v) : JSON.parse(JSON.stringify(v));
  return allocGc(sigma, copy);
}

export function bridgeGcToAff(sigma, gcLoc) {
  if (!sigma.gc.has(gcLoc)) throw new Error("missing gc");
  sigma.roots.add(gcLoc);
  const loc = "aff:" + sigma.next++;
  sigma.aff.set(loc, { gc: gcLoc });
  return loc;
}

export function bridgeAffToArena(sigma, affLoc, rid) {
  const v = sigma.aff.get(affLoc);
  if (v === null || v === undefined) throw new Error("use-after-move");
  sigma.aff.set(affLoc, null);
  return allocArena(sigma, rid, v);
}

export function readableAff(sigma, loc) {
  return sigma.aff.has(loc) && sigma.aff.get(loc) !== null;
}

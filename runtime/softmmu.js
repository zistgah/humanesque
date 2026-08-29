/**
 * SoftMMU design. Does not boot Linux.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 *
 * Partition of a shared linear buffer (when SharedArrayBuffer exists):
 *   0x00000000–0x0FFFFFFF  compiler heap
 *   0x10000000–0x2FFFFFFF  emulated physical RAM
 */
export const PARTITION = {
  compiler: { lo: 0, hi: 0x10000000 },
  physram: { lo: 0x10000000, hi: 0x30000000 },
};

export function virtToPhys(cr3, va) {
  const dir = (va >>> 22) & 0x3ff;
  const tab = (va >>> 12) & 0x3ff;
  const off = va & 0xfff;
  return { dir, tab, off, note: "page walk needs guest RAM; this is the split only" };
}

export function mmioHit(phys, map) {
  for (const d of map || []) {
    if (phys >= d.lo && phys < d.hi) return d;
  }
  return null;
}

export const VIRTIO_MMIO = {
  magic: 0x74726976,
  version: 2,
  deviceId: 2,
  queueNotify: 0x50,
  interruptStatus: 0x60,
};

/**
 * RISC-V (Shakti-shaped) ISA stub. Not an emulator.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
export const PROFILE = "RV32IMAC";
export const PAGING = ["Sv32", "Sv39"];
export const NOTE = "Pluggable CPU hypervisor slot. Execute loop not this turn. Shakti E/C class is the target profile.";
export function decode(word) {
  const op = word & 0x7f;
  return { op, note: "decode table not filled" };
}

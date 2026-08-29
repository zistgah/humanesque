/**
 * ESP32 ROM bootloader over Web Serial. Does not replace esptool.py yet.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 *
 * Handshake + SLIP framing live here. Flashing a board needs a user gesture
 * (navigator.serial.requestPort). This module is the protocol, not a claim
 * that we have flashed silicon in this tree.
 */
const SLIP_END = 0xC0, SLIP_ESC = 0xDB, SLIP_ESC_END = 0xDC, SLIP_ESC_ESC = 0xDD;
const ESP_SYNC = 0x08, ESP_FLASH_BEGIN = 0x02, ESP_FLASH_DATA = 0x03, ESP_FLASH_END = 0x04;

export function slipEncode(bytes) {
  const out = [SLIP_END];
  for (const b of bytes) {
    if (b === SLIP_END) { out.push(SLIP_ESC, SLIP_ESC_END); }
    else if (b === SLIP_ESC) { out.push(SLIP_ESC, SLIP_ESC_ESC); }
    else out.push(b);
  }
  out.push(SLIP_END);
  return Uint8Array.from(out);
}

export function syncPayload() {
  const p = [0x07, 0x07, 0x12, 0x20];
  for (let i = 0; i < 32; i++) p.push(0x55);
  return p;
}

export function commandPacket(cmd, payload) {
  const size = payload.length;
  const hdr = [0x00, cmd, size & 255, (size >> 8) & 255, 0, 0, 0, 0];
  return slipEncode(hdr.concat(payload));
}

export async function enterBootloader(port) {
  if (!port || !port.setSignals) throw new Error("no Web Serial port");
  await port.setSignals({ dataTerminalReady: true, requestToSend: false });
  await new Promise((r) => setTimeout(r, 100));
  await port.setSignals({ dataTerminalReady: true, requestToSend: true });
  await new Promise((r) => setTimeout(r, 50));
  await port.setSignals({ dataTerminalReady: true, requestToSend: false });
  await new Promise((r) => setTimeout(r, 50));
  await port.setSignals({ dataTerminalReady: false, requestToSend: false });
}

export const COMMANDS = { ESP_SYNC, ESP_FLASH_BEGIN, ESP_FLASH_DATA, ESP_FLASH_END };
export const NOTE = "Protocol only. Physical flash requires a connected ESP32 and a user gesture.";

/**
 * Mount a BIOS ROM on the VFS at /bios/bios.bin.
 * Does not edit frozen vfs.js. ROM is fetched, not zipped.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
export const BIOS_VFS_PATH = "/bios/bios.bin";
export const BIOS_URL =
  "https://github.com/copy/v86/raw/master/bios/seabios.bin";

export function mountBios(vfs, bytes) {
  const raw = bytes == null ? "AyeBIOS placeholder\n" : bytes;
  vfs.mkdir("/bios");
  vfs.write(BIOS_VFS_PATH, raw);
  vfs.write("/bios/README.txt",
    "AyeBIOS is SeaBIOS × Hindawi Shaili Guru.\n" +
    "bios.bin is fetched at test/runtime (SeaBIOS stand-in until AyeBIOS .rom is built).\n" +
    "Source: retrieved/ayebios/\n");
  return vfs.read(BIOS_VFS_PATH).ok;
}

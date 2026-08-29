/* Maṇḍūkapluti fixture — PANINI WASM br_table dispatcher
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Expected: 1
 */
int main() {
  int x;
  x = 1;
  goto skip;
  x = 2;
skip:
  return x;
}

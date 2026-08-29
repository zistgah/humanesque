int main() {
  int s = 0;
  int i = 0;
  while (i < 4) { s = s + i; i = i + 1; }
  return s == 6 ? 0 : 1;
}

int main() {
  int i = 0;
  int s = 0;
  do { s = s + 1; i = i + 1; } while (i < 3);
  return s == 3 ? 0 : 1;
}

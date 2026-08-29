int main() {
  int y = 3;
  int &r = y;
  r = 4;
  return y == 4 ? 0 : 1;
}

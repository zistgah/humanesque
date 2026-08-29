int main() {
  int y = 9;
  int &r = y;
  return r == 9 ? 0 : 1;
}

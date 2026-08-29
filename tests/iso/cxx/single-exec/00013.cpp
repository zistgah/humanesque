int f(int x) { return x + 1; }
int f(int x, int y) { return x + y; }
int main() {
  return f(1) + f(2, 3) == 7 ? 0 : 1;
}

struct P { int x; int y; };
int main() {
  P p;
  p.x = 1;
  p.y = 2;
  return p.x + p.y == 3 ? 0 : 1;
}

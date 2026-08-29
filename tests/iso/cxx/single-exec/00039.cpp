struct Pt { int x; int y; };
int main() {
  Pt a; a.x=3; a.y=4;
  return a.x*a.x + a.y*a.y == 25 ? 0 : 1;
}

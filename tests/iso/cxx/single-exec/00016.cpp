struct B { int x; };
struct D : public B { int y; };
int main() {
  D d;
  d.x = 1;
  d.y = 2;
  return d.x + d.y == 3 ? 0 : 1;
}

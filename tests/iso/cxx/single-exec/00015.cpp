class C {
public:
  int x;
  int get() { return x; }
};
int main() {
  C c;
  c.x = 11;
  return c.get() == 11 ? 0 : 1;
}

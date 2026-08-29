class P {
public:
  int x;
};
int main() {
  P p;
  p.x = 9;
  return p.x == 9 ? 0 : 1;
}

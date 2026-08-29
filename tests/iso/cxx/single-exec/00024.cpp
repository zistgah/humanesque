struct S { int a; int b; };
int main() {
  S s;
  s.a = 2; s.b = 5;
  return s.a * s.b == 10 ? 0 : 1;
}

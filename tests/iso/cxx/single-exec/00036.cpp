namespace A {
  int x() { return 10; }
}
int main() { return A::x() == 10 ? 0 : 1; }

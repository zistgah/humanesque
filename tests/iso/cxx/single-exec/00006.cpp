namespace N {
  int f() { return 2; }
}
int main() {
  return N::f() == 2 ? 0 : 1;
}

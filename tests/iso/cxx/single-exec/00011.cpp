int main() {
  int *p = new int;
  *p = 5;
  int v = *p;
  delete p;
  return v == 5 ? 0 : 1;
}

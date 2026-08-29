int main() {
  int *p = new int[1];
  p[0] = 0;
  delete[] p;
  return 0;
}

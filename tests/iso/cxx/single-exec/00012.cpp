int main() {
  int *a = new int[3];
  a[0] = 1; a[1] = 2; a[2] = 3;
  int s = a[0]+a[1]+a[2];
  delete[] a;
  return s == 6 ? 0 : 1;
}

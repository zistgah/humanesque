int main() {
  int x = 1;
  if (true) x = 2;
  else x = 3;
  return x == 2 ? 0 : 1;
}

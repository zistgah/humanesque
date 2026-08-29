fn fact(n: i32) -> i32 {
  if n <= 1 { return 1; }
  return n * fact(n - 1);
}
fn main() -> i32 {
  if fact(5) == 120 { return 0; }
  return 1;
}

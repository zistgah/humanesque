fn g(x: i32) i32 { return x + 1; }
fn f(x: i32) i32 { return g(x) + g(x); }
pub fn main() i32 { if (f(3) == 8) return 0; return 1; }

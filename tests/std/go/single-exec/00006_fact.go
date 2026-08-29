package main
func fact(n int) int {
  if n <= 1 { return 1 }
  return n * fact(n - 1)
}
func main() {
  if fact(5) != 120 { os.Exit(1) }
}

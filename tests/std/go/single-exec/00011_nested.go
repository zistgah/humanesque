package main
func g(x int) int { return x + 1 }
func f(x int) int { return g(x) + g(x) }
func main() {
  if f(3) != 8 { os.Exit(1) }
}

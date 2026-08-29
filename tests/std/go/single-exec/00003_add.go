package main
func add(a int, b int) int { return a + b }
func main() {
  if add(40, 2) != 42 { os.Exit(1) }
}

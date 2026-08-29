package main
func id(x int) int { return x }
func main() {
  if id(0) != 0 { os.Exit(1) }
}

function g(x) { return x + 1; }
function f(x) { return g(x) + g(x); }
function main() { if (f(3) == 8) return 0; return 1; }

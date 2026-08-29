function fact(n) { if (n <= 1) return 1; return n * fact(n - 1); }
function main() { if (fact(5) == 120) return 0; return 1; }

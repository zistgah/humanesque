function fact(n)
  if n <= 1; return 1; end
  return n * fact(n - 1)
end
function main()
  if fact(5) == 120; return 0; end
  return 1
end

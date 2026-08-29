function g(x)
  return x + 1
end
function f(x)
  return g(x) + g(x)
end
function main()
  if f(3) == 8; return 0; end
  return 1
end

function fact(n)
  if n <= 1 then return 1 end
  return n * fact(n - 1)
end
function main()
  if fact(5) == 120 then return 0 end
  return 1
end

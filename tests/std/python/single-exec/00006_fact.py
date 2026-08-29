def fact(n):
    if n <= 1: return 1
    return n * fact(n - 1)
def main():
    if fact(5) == 120: return 0
    return 1

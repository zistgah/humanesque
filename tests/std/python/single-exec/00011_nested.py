def g(x):
    return x + 1
def f(x):
    return g(x) + g(x)
def main():
    if f(3) == 8: return 0
    return 1

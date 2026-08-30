# अभ्यास — exercises for nepal_bhasa (newa)

Each exercise starts from a sample. Change it, compile it, read what happens.
Build first:  cd guru && make

## 1. Hello   `samples/01-namaste.uhin`

```
<शैली गुरु>
##include <मानकपन.स>
int main()
{
	printf("नमस्ते Hindawi\n");
	return 0;
}
```

**Do this.** Change the greeting to your own name.
**Hint.** Edit the string inside the quotes. Strings are NOT transduced — that is the rule.

## 2. Count to ten   `samples/02-ginti.uhin`

```
<शैली गुरु>
##include <मानकपन.स>
int main()
{
	int k;
	for(k=1; k<=10; k++)
		printf("%d\n",k);
	return 0;
}
```

**Do this.** Make it count backwards from ten.
**Hint.** k=10; k>=1; k--

## 3. Factorial by recursion   `samples/03-vargamool.uhin`

```
<शैली गुरु>
##include <मानकपन.स>
int f(int n)
{
	if(n<2) return 1;
	return n*f(n-1);
}
int main()
{
	printf("%d\n",f(5));
	return 0;
}
```

**Do this.** Make it compute the sum 1..n instead of the product.
**Hint.** Replace n*f(n-1) with n+f(n-1) and return 0 at the base.

## 4. Add a second function and call it from the first.

**Hint.** Declare it above main, or prototype it.

## 5. Break it on purpose: remove a closing brace. Read the diagnostic.

**Hint.** The line number refers to the GENERATED host file, not your .uhin. That gap is real and recorded.

The steps below help to convert all the py files to telugu at a time :


1.converts hin to te.uhin files ( translates from englis to telgu)
```
ls *.py | xargs -n1 -I{} ./py2hin.1 {}
```

 2. executes all the te.uhin files
 ```
ls *py.te.uhin | xargs -n1 -I{} ./hinpy {}
 ```

3. this command tests the programs and also deplays the output with the "Testing program name", it helps to identify which program is running and what is the output it is giving

```
for n in $(ls *.py); do echo Translating ${n}; ./py2hin.1 ${n}; echo Testing ${n} && ./hinpy ${n} && echo Testing ${n}.te.uhin && ./hinpy ${n}.te.uhin; done
```

Note : To do : retest the commands again write a detailed description

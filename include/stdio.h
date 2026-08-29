/* Micro-libc. Do not parse /usr/include. Copyright (C) 1993-2026 Abhishek Choudhary */
#ifndef _PANINI_STDIO_H
#define _PANINI_STDIO_H
typedef struct _FILE FILE;
#define NULL ((void*)0)
int printf(const char *fmt, ...);
int sprintf(char *dst, const char *fmt, ...);
FILE *fopen(const char *path, const char *mode);
int fclose(FILE *f);
int fread(void *p, int sz, int n, FILE *f);
int fwrite(const void *p, int sz, int n, FILE *f);
#endif

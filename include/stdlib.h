/* Micro-libc. Copyright (C) 1993-2026 Abhishek Choudhary */
#ifndef _PANINI_STDLIB_H
#define _PANINI_STDLIB_H
typedef unsigned long size_t;
#define NULL ((void*)0)
void *malloc(size_t n);
void *calloc(size_t n, size_t sz);
void *realloc(void *p, size_t n);
void free(void *p);
void exit(int c);
int abs(int x);
#endif

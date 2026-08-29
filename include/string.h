/* Micro-libc. Copyright (C) 1993-2026 Abhishek Choudhary */
#ifndef _PANINI_STRING_H
#define _PANINI_STRING_H
typedef unsigned long size_t;
#define NULL ((void*)0)
void *memcpy(void *d, const void *s, size_t n);
void *memset(void *d, int c, size_t n);
int memcmp(const void *a, const void *b, size_t n);
size_t strlen(const char *s);
char *strcpy(char *d, const char *s);
#endif

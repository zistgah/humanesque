/* Micro-STL. Not libstdc++. llama.cpp/ggml subset. Copyright (C) 1993-2026 Abhishek Choudhary */
#pragma once
#include <stdlib.h>
namespace std {
template<typename T>
class vector {
public:
    T* _data; unsigned long _size; unsigned long _cap;
    vector() : _data(0), _size(0), _cap(0) {}
    ~vector() { if (_data) free(_data); }
    void push_back(const T& val) {
        if (_size >= _cap) {
            _cap = _cap == 0 ? 4 : _cap * 2;
            _data = (T*)realloc(_data, _cap * sizeof(T));
        }
        _data[_size++] = val;
    }
    T& operator[](unsigned long idx) { return _data[idx]; }
    unsigned long size() const { return _size; }
    T* data() { return _data; }
};
}

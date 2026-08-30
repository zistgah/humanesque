#!/bin/bash -f

#Preinstall reqs for Fedora
yum install -y konsole xpdf \
    mailx sendmail \
    flex flex-devel bison bison-devel gawk \
    gcc gcc-c++ \
    java-1.8.0-openjdk-devel \
    python3 \
    libX11-devel
ln -sf /usr/bin/bison /usr/bin/yacc


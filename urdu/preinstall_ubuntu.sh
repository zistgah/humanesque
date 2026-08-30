#!/bin/bash -f

#Preinstall reqs for Ubuntu
sudo apt-get update

for n in kdewebdev mailutils xorg-dev\
    xorglibs-static-dev kommander\
    gawk xpdf sendmail g++ flex\
    bison konsole
do
    sudo apt-get install -y -q --force-yes $n
done


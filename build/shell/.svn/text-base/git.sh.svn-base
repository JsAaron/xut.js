#!/bin/bash
#http://www.jb51.net/article/56563.htm

dir=$(pwd)
# dir="/Users/Aaron/project/git/es6-magazine/'"
main="$dir/src/lib/main.js"
log="$dir/src/log.js"

version=''

while read LINE
do
    flag=`echo $LINE | grep -w Xut.Version`
    if [ "$flag" != "" ]
    then
        version=${LINE##*=}
        version=`echo v"$version" | sed s/[[:space:]]//g`
        continue
    fi
done < $main

while read LINE
do
    # `echo $LINE | grep -w "${version}"`
    flag=`echo $LINE | grep -w -i "${version}"`
    if [ "$flag" != "" ]
    then
        string=${flag##*"${version}"}
        content=${string/[0-9]*.?/}
        continue
    fi
done < $log

git add .
git commit -m "$content"
git remote add origin git://github.com/JsAaron/xut.git
git push origin master


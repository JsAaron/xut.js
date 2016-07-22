#!/bin/bash
#http://www.jb51.net/article/56563.htm

dir=$(pwd)
index="$dir/src/lib/index.js"
log="$dir/src/log.js"

version=''

while read LINE
do
    flag=`echo $LINE | grep -w Xut.Version`
    if [ "$flag" != "" ]
    then
        version=${LINE##*=}
        version=`echo v"$version" | sed s/[[:space:]]//g`
    fi 
done < $index

while read LINE
do  
    # `echo $LINE | grep -w "${version}"`
    flag=`echo $LINE | grep -w -i "${version}"`
    if [ -z "$flag" ]; then
        continue
    fi
    content=${flag##*"${version}"}
    echo $content
done < $log

git add .
git commit -m "{$content}"
git remote add origin https://github.com/JsAaron/es6-magazine.git
git push origin master


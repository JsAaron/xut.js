#!/bin/sh

git add .
git commit -am "update"
git remote add origin https://github.com/JsAaron/es6-magazine.git
git push origin master


# echo "git diff ? (defalut no. input 'yes',if want to it )"
# read PERSON
# if [$next -eq $PERSON]
# then
#     echo 'aaa'
# else
#    git diff
# fi
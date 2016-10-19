@echo off
@Rem start service script on Lenovo

echo start frontend...


cd D:\FridaStation\DreAssistor
git pull origin master
cp  app/src/config/system_lenovo.js app/src/config/system.js
npm run deploy-lenovo


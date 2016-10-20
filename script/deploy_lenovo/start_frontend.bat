@echo off
@Rem start service script on Lenovo

echo start frontend...


cd D:\FridaStation\DreAssistor
git pull origin master
copy  app\src\config\system_patac_server.js app\src\config\system.js
npm run deploy-lenovo


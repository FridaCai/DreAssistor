@echo off
@Rem start service script on Lenovo

echo start frontend...


cd D:\DreAssisstor\site\DreAssistor
git pull origin release
copy  app\src\config\system_patac_server.js app\src\config\system.js
npm run deploy-patac-server

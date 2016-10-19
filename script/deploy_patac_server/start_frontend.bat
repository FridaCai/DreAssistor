@echo off
@Rem start service script on Lenovo

echo start frontend...


cd D:\DreAssisstor\site\DreAssistor
git pull origin master
npm run deploy-patac-server

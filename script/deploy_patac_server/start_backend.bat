@echo off
@Rem start service script on Lenovo

echo start backend...

cd D:\DreAssisstor\site\DreAssistor_backend_swagger
git pull origin release
npm run deploy-patac-server


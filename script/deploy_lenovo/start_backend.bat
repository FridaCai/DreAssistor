@echo off
@Rem start service script on Lenovo

echo start backend...


cd D:\FridaStation\DreAssistor_backend_swagger
git pull origin master
npm run deploy-lenovo


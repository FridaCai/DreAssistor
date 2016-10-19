@echo off
@Rem stop service script on Lenovo

echo stop mysql...
mysqladmin -uroot -pmapi1111111111! shutdown

echo stop nodejs...
cd D:\FridaStation\DreAssistor_backend_swagger
taskkill /F /IM node.exe

cd ../DreAssistor/script

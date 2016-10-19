@echo off
@Rem stop service script on Lenovo

echo stop mysql...
mysqladmin -uroot -pmapi1111111111! shutdown

echo stop nodejs...
taskkill /F /IM node.exe

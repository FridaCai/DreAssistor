@echo off
@Rem start service script on Lenovo

stop.bat && start_mysql.bat && start_backend.bat && start_frontend.bat

echo done!
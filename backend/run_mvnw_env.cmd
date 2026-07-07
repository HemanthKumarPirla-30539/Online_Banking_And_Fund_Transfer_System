@echo off
setlocal
set "MAVEN_USER_HOME=C:\Users\venka\.m2"
set "USER_HOME=C:\Users\venka"
echo MAVEN_USER_HOME=%MAVEN_USER_HOME%
echo USER_HOME=%USER_HOME%
call "%~dp0mvnw.cmd" -B -v
endlocal

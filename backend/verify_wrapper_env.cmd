@echo off
set MAVEN_USER_HOME=C:\Users\venka\.m2
set GRADLE_USER_HOME=C:\Users\venka\.gradle
set USER_HOME=C:\Users\venka
echo MAVEN_USER_HOME=%MAVEN_USER_HOME%
echo GRADLE_USER_HOME=%GRADLE_USER_HOME%
echo USER_HOME=%USER_HOME%
echo ---
set | findstr /I "MAVEN_USER_HOME"
set | findstr /I "GRADLE_USER_HOME"
set | findstr /I "USER_HOME"
echo ---
call .\mvnw.cmd -v
if %ERRORLEVEL% neq 0 echo MVNW_EXIT=%ERRORLEVEL%

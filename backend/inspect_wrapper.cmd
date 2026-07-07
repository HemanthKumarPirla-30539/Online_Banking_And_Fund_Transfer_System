@echo off
setlocal enabledelayedexpansion
echo CWD=%CD%
set USER_HOME=%USERPROFILE%
set GRADLE_USER_HOME=%USERPROFILE%\.gradle
echo USER_HOME=!USER_HOME!
echo GRADLE_USER_HOME=!GRADLE_USER_HOME!
echo ---
"C:\Program Files\Java\jdk-21\bin\jar.exe" tf ".\.mvn\wrapper\maven-wrapper.jar" | findstr /R /C:"Main-Class" /C:"META-INF/MANIFEST.MF" /C:"USER_HOME" /C:"GRADLE_USER_HOME" /C:"PathAssembler"
echo ---
python - <<'PY'
import os, zipfile
path = os.path.abspath('.\\.mvn\\wrapper\\maven-wrapper.jar')
print('jar exists', os.path.exists(path))
with zipfile.ZipFile(path) as z:
    names = z.namelist()
    print('manifest present', 'META-INF/MANIFEST.MF' in names)
    print('wrapper main class present', 'org/apache/maven/wrapper/MavenWrapperMain.class' in names)
    data = z.read('org/apache/maven/wrapper/PathAssembler.class')
    for token in [b'GRADLE_USER_HOME', b'USER_HOME', b'PROJECT', b'user.home']:
        print(token, data.find(token))
PY
echo ---
call .\mvnw.cmd -v
echo EXIT=%ERRORLEVEL%

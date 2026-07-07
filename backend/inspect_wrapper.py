import os
import zipfile

jar_path = os.path.abspath(os.path.join('.mvn', 'wrapper', 'maven-wrapper.jar'))
print('jar_path=', jar_path)
print('exists=', os.path.exists(jar_path))
with zipfile.ZipFile(jar_path) as z:
    names = z.namelist()
    print('manifest=', 'META-INF/MANIFEST.MF' in names)
    print('mavenwrappermain=', 'org/apache/maven/wrapper/MavenWrapperMain.class' in names)
    if 'org/apache/maven/wrapper/PathAssembler.class' in names:
        data = z.read('org/apache/maven/wrapper/PathAssembler.class')
        for token in [b'GRADLE_USER_HOME', b'USER_HOME', b'MAVEN_USER_HOME', b'PROJECT', b'user.home']:
            idx = data.find(token)
            print(token.decode('utf-8'), idx)
        print('snippet GRADLE_USER_HOME=', data[data.find(b'GRADLE_USER_HOME')-40:data.find(b'GRADLE_USER_HOME')+80] if b'GRADLE_USER_HOME' in data else b'')
    else:
        print('PathAssembler.class missing')

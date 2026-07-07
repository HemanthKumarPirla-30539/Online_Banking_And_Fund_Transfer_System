import os
print('MAVEN_USER_HOME repr:', repr(os.environ.get('MAVEN_USER_HOME')))
print('USER_HOME repr:', repr(os.environ.get('USER_HOME')))
print('PATH repr:', repr(os.environ.get('PATH')[:300]))
print('cwd repr:', repr(os.getcwd()))
with open('.mvn\\wrapper\\maven-wrapper.properties','rb') as f:
    data=f.read()
print('properties raw repr:', repr(data))
print('distributionBase present:', b'distributionBase=MAVEN_USER_HOME' in data)
print('zipStoreBase present:', b'zipStoreBase=MAVEN_USER_HOME' in data)

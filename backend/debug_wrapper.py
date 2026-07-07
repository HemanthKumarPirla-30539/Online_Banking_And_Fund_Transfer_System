import zipfile
from pathlib import Path
import re

jar_path = Path('.mvn/wrapper/maven-wrapper.jar').resolve()
print('jar_path=', jar_path)
print('exists=', jar_path.exists())

with zipfile.ZipFile(jar_path, 'r') as z:
    names = sorted(z.namelist())
    print('contains PathAssembler:', 'org/apache/maven/wrapper/PathAssembler.class' in names)
    print('wrapper class count:', len([n for n in names if n.startswith('org/apache/maven/wrapper/')]))
    data = z.read('org/apache/maven/wrapper/PathAssembler.class')
    # Print all uppercase strings of length >=4
    strings = re.findall(rb'[A-Z_]{4,}', data)
    filtered = [s.decode('ascii', 'ignore') for s in strings if any(tok in s for tok in [b'USER', b'MAVEN', b'GRADLE', b'HOME', b'DISTRIBUTION', b'PROJECT'])]
    print('filtered strings:')
    print(filtered)
    print('USER_HOME pos', data.find(b'USER_HOME'))
    print('MAVEN_USER_HOME pos', data.find(b'MAVEN_USER_HOME'))
    print('GRADLE_USER_HOME pos', data.find(b'GRADLE_USER_HOME'))
    print('PROJECT pos', data.find(b'PROJECT'))
    print('user.home pos', data.find(b'user.home'))
    print('raw bytes around USER_HOME:')
    idx = data.find(b'USER_HOME')
    if idx != -1:
        print(data[idx-80:idx+120])
    
    idx2 = data.find(b'MAVEN_USER_HOME')
    if idx2 != -1:
        print(data[idx2-80:idx2+120])

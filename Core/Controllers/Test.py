from telnetlib import DO
import paramiko
import xtelnet
import requests
import json
#from datetime import datetime
import socket
import base64
import sys

t=xtelnet.session()

# payload = {'Option': 'GetAminosToReboot'}
# Devices = requests.post('http://localhost/BBINCO/TV/Core/Controllers/DevicesStatus.php', data=payload)
parametro = ' '.join(sys.argv[1:])
parametro = parametro.strip()
parametro = parametro.split(',')

# try:
ip = parametro[1]
# print(ip)
k = paramiko.RSAKey.from_private_key_file('/var/www/html/keyname.pem')
client = paramiko.SSHClient()
#client.load_system_host_keys()
#client.load_host_keys('~/.ssh/known_hosts')
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.load_system_host_keys()
client.connect(hostname=ip, port='10022', pkey= k, look_for_keys=False)
stdin, stdout, stderr = client.exec_command('/sbin/reboot -f > /dev/null 2>&1 &')
# print("REBOOT KAMAI")
lines = stdout.readlines()
# print(lines)
stdin.close()
stdout.close()
stderr.close()
client.close()
# except:
#     print("Fail to reboot Kamai")

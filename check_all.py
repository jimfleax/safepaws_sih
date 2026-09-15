import requests, subprocess

print('--- POSTGRESQL CHECK ---')
pg_status = subprocess.run([r'.\pgsql_bin\pgsql\bin\psql.exe', '-U', 'postgres', '-d', 'safepaws', '-c', 'SELECT version();'], capture_output=True, text=True)
print(pg_status.stdout.strip())

print('--- POSTGIS CHECK ---')
pgis_status = subprocess.run([r'.\pgsql_bin\pgsql\bin\psql.exe', '-U', 'postgres', '-d', 'safepaws', '-c', 'SELECT postgis_full_version();'], capture_output=True, text=True)
print(pgis_status.stdout.strip()[:100] + '...')

print('--- ALEMBIC CHECK ---')
alembic_status = subprocess.run(['powershell', '-Command', '=\"C:\\Users\\Samudra Bose\\Documents\\VS code\\vs code\\Projects\\SAFEPAWS\\safepaws_sih\\backend\"; cd backend; alembic current'], capture_output=True, text=True)
print(alembic_status.stdout.strip().split('\n')[-1])

print('--- BACKEND HEALTH ---')
try:
    r = requests.get('http://localhost:8000/api/v1/health/')
    print(r.status_code, r.json())
except Exception as e:
    print('ERROR:', e)

print('--- FRONTEND CHECK ---')
try:
    r = requests.get('http://localhost:3000')
    print(r.status_code, r.text[:50] + '...')
except Exception as e:
    print('ERROR:', e)

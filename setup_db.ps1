$ErrorActionPreference = 'Stop'

Write-Host "Extracting PostgreSQL..."
mkdir pgsql_bin -Force; tar -xf pgsql_new.zip -C pgsql_bin

Write-Host "Extracting PostGIS..."
mkdir postgis_bin -Force; tar -xf postgis_new.zip -C postgis_bin

Write-Host "Merging PostGIS into PostgreSQL..."
# The postgis zip usually contains a "postgis-bundle-pg16-3.6.2x64" folder or just the contents.
# Let's inspect it after extraction. We'll copy its bin, lib, share into pgsql_bin/pgsql
$postgisDir = Get-ChildItem postgis_bin | Select-Object -First 1
if (Test-Path "$($postgisDir.FullName)\bin") {
    Copy-Item -Path "$($postgisDir.FullName)\*" -Destination "pgsql_bin\pgsql" -Recurse -Force
} else {
    Copy-Item -Path "postgis_bin\*" -Destination "pgsql_bin\pgsql" -Recurse -Force
}

$pgBin = "$PWD\pgsql_bin\pgsql\bin"
$pgData = "$PWD\pgsql_data"

Write-Host "Initializing DB..."
& "$pgBin\initdb.exe" -D $pgData -U postgres --auth=trust

Write-Host "Starting DB..."
& "$pgBin\pg_ctl.exe" -D $pgData -l "$pgData\logfile" start

Start-Sleep -Seconds 3

Write-Host "Creating safepaws DB..."
& "$pgBin\createdb.exe" -U postgres safepaws

Write-Host "Enabling PostGIS..."
& "$pgBin\psql.exe" -U postgres -d safepaws -c "CREATE EXTENSION postgis;"

Write-Host "Done! PostgreSQL is running."

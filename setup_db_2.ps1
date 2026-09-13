Continue = 'Stop'

Write-Host "Extracting PostgreSQL..."
Expand-Archive -Path pgsql2.zip -DestinationPath pgsql_bin -Force

Write-Host "Extracting PostGIS..."
Expand-Archive -Path postgis2.zip -DestinationPath postgis_bin -Force

Write-Host "Merging PostGIS into PostgreSQL..."
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

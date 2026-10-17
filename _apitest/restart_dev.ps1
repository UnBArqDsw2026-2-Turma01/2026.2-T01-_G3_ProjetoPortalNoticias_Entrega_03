$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$proj = Join-Path $root 'demonstracao_codigos'
$log  = Join-Path $proj 'npm_dev.log'
Write-Output ('Projeto: ' + $proj + ' (existe: ' + (Test-Path $proj) + ')')

# Mata processos escutando na porta 3000
$listeners = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($p in $listeners) {
  if ($p -and $p -ne 0) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }
}
# Mata cmd.exe órfão do npm run dev (o node da porta já morreu acima)
Get-CimInstance Win32_Process -Filter "Name='cmd.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -match 'npm run dev' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 1
if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) {
  Write-Output 'AVISO: porta 3000 ainda ocupada'
}
Remove-Item $log -ErrorAction SilentlyContinue
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','npm run dev > npm_dev.log 2>&1' -WorkingDirectory $proj -WindowStyle Hidden

$ready = $false
for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep -Milliseconds 500
  if ((Test-Path $log) -and ((Get-Content $log -Raw -ErrorAction SilentlyContinue) -match 'Ready in')) { $ready = $true; break }
}
if ($ready) {
  Write-Output 'DEV READY'
} else {
  Write-Output 'DEV NOT READY (timeout)'
  Get-Content $log -ErrorAction SilentlyContinue
}
param(
    [string]$Root = ".woorido"
)

$configPath = Join-Path $Root "config\\woorido.config.json"
$hooksPath = Join-Path $Root "hooks\\hooks.json"

if (-not (Test-Path $configPath)) {
    Write-Error "Missing config: $configPath"
    exit 1
}

if (-not (Test-Path $hooksPath)) {
    Write-Error "Missing hooks: $hooksPath"
    exit 1
}

$config = Get-Content -Raw $configPath | ConvertFrom-Json
$hooks = Get-Content -Raw $hooksPath | ConvertFrom-Json
$missing = @()

foreach ($profile in $config.profiles.PSObject.Properties) {
    foreach ($item in $profile.Value) {
        $target = Join-Path $Root $item
        if (-not (Test-Path $target)) {
            $missing += "config profile '$($profile.Name)' -> $item"
        }
    }
}

foreach ($profile in $hooks.profiles.PSObject.Properties) {
    foreach ($item in $profile.Value.autoLoad) {
        $target = Join-Path $Root $item
        if (-not (Test-Path $target)) {
            $missing += "hooks profile '$($profile.Name)' -> $item"
        }
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Missing references detected:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "All configured paths exist." -ForegroundColor Green

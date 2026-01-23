# Create dist/icons folder
New-Item -ItemType Directory -Force -Path ".\dist\icons" | Out-Null

# Minimal 16x16 PNG (blue square) - base64 encoded
$png16 = [Convert]::FromBase64String('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKklEQVR42mNkYGD4z0ABYBw1YNSAUQNGDRgYAxj/M1AGmCgzYNSA4WYAAJzYAgHzpPOBAAAAAElFTkSuQmCC')
[System.IO.File]::WriteAllBytes("$PWD\dist\icons\icon16.png", $png16)

# For 48x48 - slightly larger placeholder
$png48 = [Convert]::FromBase64String('iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAP0lEQVR42u3OMQEAAAgDILV/51nBzwci0JlKS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vrtwshKwIB8YkHjgAAAABJRU5ErkJggg==')
[System.IO.File]::WriteAllBytes("$PWD\dist\icons\icon48.png", $png48)

# For 128x128 - larger placeholder
$png128 = [Convert]::FromBase64String('iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAWklEQVR42u3BMQEAAADCoPVP7WsIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAN1+AABVhDU2QAAAABJRU5ErkJggg==')
[System.IO.File]::WriteAllBytes("$PWD\dist\icons\icon128.png", $png128)

Write-Host "Icons created successfully"
Get-ChildItem ".\dist\icons"

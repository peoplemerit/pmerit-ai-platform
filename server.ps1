# Simple PowerShell HTTP Server for PMERIT AI Platform
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "PMERIT AI Platform Server Started!" -ForegroundColor Green
Write-Host "Local URL: http://localhost:$port" -ForegroundColor Cyan
Write-Host "Network URL: http://$(hostname):$port" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get the requested path
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }
        
        # Construct file path
        $filePath = Join-Path $PSScriptRoot ($localPath.TrimStart('/').Replace('/', '\'))
        
        Write-Host "$(Get-Date -Format 'HH:mm:ss') - $($request.HttpMethod) $localPath" -ForegroundColor Gray
        
        if (Test-Path $filePath -PathType Leaf) {
            try {
                # Set content type based on file extension
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                switch ($extension) {
                    ".html" { $response.ContentType = "text/html; charset=utf-8" }
                    ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                    ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                    ".json" { $response.ContentType = "application/json; charset=utf-8" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".jpeg" { $response.ContentType = "image/jpeg" }
                    ".gif"  { $response.ContentType = "image/gif" }
                    ".svg"  { $response.ContentType = "image/svg+xml" }
                    ".ico"  { $response.ContentType = "image/x-icon" }
                    default { $response.ContentType = "text/plain" }
                }
                
                # Read and serve the file
                if ($extension -in @(".png", ".jpg", ".jpeg", ".gif", ".ico")) {
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                } else {
                    $content = Get-Content $filePath -Raw -Encoding UTF8
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
                }
                
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            catch {
                Write-Host "Error serving file: $_" -ForegroundColor Red
                $response.StatusCode = 500
            }
        }
        else {
            Write-Host "404 - File not found: $filePath" -ForegroundColor Red
            $response.StatusCode = 404
            $errorContent = "404 - File Not Found: $localPath"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($errorContent)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        
        $response.Close()
    }
}
catch {
    Write-Host "Server error: $_" -ForegroundColor Red
}
finally {
    $listener.Stop()
    Write-Host "Server stopped." -ForegroundColor Yellow
}
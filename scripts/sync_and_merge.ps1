$ErrorActionPreference = 'Continue'
Write-Host "Starting SafePaws Detailed Auto-Sync Watcher..." -ForegroundColor Cyan
Write-Host "Monitoring for changes... (Commits will occur EXACTLY every 5 minutes)" -ForegroundColor Cyan

while ($true) {
    $status = git status --porcelain
    if ($status) {
        git add .
        
        $added = @(git diff --cached --name-only --diff-filter=A)
        $modified = @(git diff --cached --name-only --diff-filter=M)
        $deleted = @(git diff --cached --name-only --diff-filter=D)
        
        # Determine primary scope (e.g. 'frontend', 'backend')
        $scopes = @{}
        foreach ($f in ($added + $modified + $deleted)) {
            $scope = ($f -split '/')[0]
            if (-not $scopes.ContainsKey($scope)) { $scopes[$scope] = 0 }
            $scopes[$scope]++
        }
        
        $primaryScope = "repo"
        if ($scopes.Count -gt 0) {
            $primaryScope = ($scopes.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 1).Name
        }
        
        $header = "sync($primaryScope): auto-update changes"
        if ($added.Count -eq 1 -and $modified.Count -eq 0) { 
            $fileName = ($added[0] -split '/')[-1]
            $header = "feat($primaryScope): add $fileName" 
        }
        elseif ($modified.Count -eq 1 -and $added.Count -eq 0) { 
            $fileName = ($modified[0] -split '/')[-1]
            $header = "chore($primaryScope): update $fileName" 
        }
        
        $commitMessage = "$header`n`nAutomated sync details:`n"
        
        if ($added.Count -gt 0) {
            $commitMessage += "`n[ADDED]`n"
            foreach ($f in $added) { $commitMessage += "  + $f`n" }
        }
        if ($modified.Count -gt 0) {
            $commitMessage += "`n[MODIFIED]`n"
            foreach ($f in $modified) { $commitMessage += "  ~ $f`n" }
        }
        if ($deleted.Count -gt 0) {
            $commitMessage += "`n[DELETED]`n"
            foreach ($f in $deleted) { $commitMessage += "  - $f`n" }
        }
        
        $msgFile = "$env:TEMP\git_sync_msg.txt"
        $commitMessage | Set-Content $msgFile
        
        git commit -F $msgFile
        
        Write-Host "Committed: $header" -ForegroundColor Green
        
        # Sync with remote
        git pull --rebase origin HEAD
        git push origin HEAD
        Write-Host "Pushed to remote." -ForegroundColor Green
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] No changes detected." -ForegroundColor DarkGray
    }
    
    # Strictly wait for 5 minutes (300 seconds)
    Start-Sleep -Seconds 300
}

$ErrorActionPreference = 'SilentlyContinue'

$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
Write-Host "=== Auto Sync & Merge Cycle: $timestamp ==="

# 1. Stash any uncommitted changes to avoid losing them when switching branches
$hasChanges = $false
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    $hasChanges = $true
}

if ($hasChanges) {
    # If we are not on samudra, switch to it, or just commit where we are?
    # User said: "commit the changes in the branch named samudra"
    $currentBranch = (git branch --show-current).Trim()
    if ($currentBranch -ne "samudra") {
        Write-Host "Currently on $currentBranch, stashing and moving to samudra..."
        git stash push -m "auto-stash before switching to samudra"
        git checkout samudra
        git stash pop
        # Re-add after pop
        git add -A
    }
    
    git commit -m "chore: auto-push $timestamp"
    git push origin samudra
    Write-Host "PUSHED local changes to samudra"
} else {
    Write-Host "NO_CHANGES locally"
}

# Ensure we are currently on a known state (samudra)
git checkout samudra

# 2. Fetch all remote changes
Write-Host "Fetching origin..."
git fetch origin

# 3. Pull and merge other branches into main
Write-Host "Checking for branches to merge into main..."

# Get all remote branches except HEAD and main
$remoteBranches = git branch -r | Where-Object { $_ -match "origin/" -and $_ -notmatch "origin/HEAD" -and $_ -notmatch "origin/main" }

$mergedSomething = $false

foreach ($branch in $remoteBranches) {
    $bName = $branch.Trim()
    
    # Check if this remote branch has commits that are NOT in origin/main
    $diff = git log "origin/main..$bName" --oneline
    if (![string]::IsNullOrWhiteSpace($diff)) {
        Write-Host "Found new changes in $bName. Merging into main..."
        
        # Checkout main and make sure it's up to date
        git checkout main
        git pull origin main
        
        # Attempt to merge
        git merge $bName -m "chore: auto-merge $bName into main ($timestamp)"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Successfully merged $bName into main."
            $mergedSomething = $true
        } else {
            Write-Host "Merge conflict detected with $bName! Aborting merge."
            git merge --abort
        }
    }
}

if ($mergedSomething) {
    Write-Host "Pushing updated main..."
    git push origin main
}

# 4. Return to samudra
git checkout samudra
Write-Host "Returned to samudra branch."
Write-Host "Done."

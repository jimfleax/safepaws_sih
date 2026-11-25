import subprocess
import sys
import os

commits_output = subprocess.check_output(['git', 'log', '--format=%h %s', '5aa3c67^..539069a', '--reverse']).decode('utf-8').strip().split('\n')

skip_words = [
    'Custom cursor',
    'Implement custom cursor',
    'Refactor PetCard and Community components for improved styling',
    'Add screenshot capturing',
    'style: run /upgrade-generic-ui',
    'strip frontend visual/design',
    'remove CustomCursor',
    'Merge pull request',
    'auto-merge',
    'merge main into samudra',
    'fix: update messages in ProcessingView' # Already done
]

def run_git(cmd):
    return subprocess.run(cmd, shell=True)

for line in commits_output:
    if not line.strip():
        continue
    hash = line[:7]
    msg = line[8:]
    
    if any(w in msg for w in skip_words):
        print(f"Skipping {hash}: {msg}")
        continue
    
    print(f"\nCherry-picking {hash}: {msg}")
    res = subprocess.run(['git', 'cherry-pick', hash])
    if res.returncode != 0:
        print(f"Conflict in {hash}. Auto-resolving by keeping functional changes...")
        
        # 1. Remove files that shouldn't be here
        run_git('git rm -f --ignore-unmatch FINAL_REPORT.md INTERNAL_IMPLEMENTATION_MAP.md PHASE_1_REPORT.md')
        
        # 2. For pycache, just keep HEAD
        run_git('git checkout HEAD -- "**/__pycache__/*"')
        run_git('git checkout HEAD -- "*__pycache__*"')
        
        # 3. For LandingPage (the main visual offender), keep HEAD
        run_git('git checkout HEAD -- frontend/src/pages/LandingPage.tsx')
        
        # 4. For everything else that conflicts, accept THEIRS (the functional changes)
        status = subprocess.check_output(['git', 'status', '--porcelain']).decode('utf-8')
        unmerged = [l for l in status.split('\n') if l.startswith('U') or l.startswith('DD') or l.startswith('AA') or l.startswith('DU') or l.startswith('UD')]
        
        for u in unmerged:
            file_path = u[3:].strip()
            if 'pycache' not in file_path and 'LandingPage.tsx' not in file_path:
                run_git(f'git checkout --theirs "{file_path}"')
        
        run_git('git add .')
        
        env = os.environ.copy()
        env['GIT_EDITOR'] = 'true'
        res2 = subprocess.run(['git', 'cherry-pick', '--continue'], env=env)
        
        if res2.returncode != 0:
            print(f"Empty commit {hash}. Skipping...")
            run_git('git cherry-pick --skip')
            
print("Done!")

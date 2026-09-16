import sys
import re

def main():
    try:
        with open('components/LandingPage.tsx', 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    new_lines = []
    skip = False
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Remove videoData
        if 'const videoData = [' in line:
            skip = True
        if skip and '];' in line and (i == 0 or '  },' not in line): # just naive fast forward till end of array
            # We'll just carefully fast forward until we find '];' at the root level indentation
            pass
            
        if skip:
            if line.strip() == '];':
                skip = False
            i += 1
            if not skip: # if we just turned it false, we still don't add the line
                pass
            continue
            
        # Remove activeModulesTab
        if 'const [activeModulesTab' in line:
            i += 1; continue
            
        # Remove video state hooks
        if 'const [isVideoModalOpen' in line:
            i += 1; continue
        if 'const [currentVideoIdx' in line:
            i += 1; continue
        if 'const currentVideo =' in line:
            i += 1; continue
            
        # Remove openVideoModal
        if 'function openVideoModal(idx: number) {' in line:
            # Skip till end of function
            i += 1
            while i < len(lines) and lines[i].strip() != '}':
                i += 1
            i += 1 # skip closing brace
            continue
            
        # Remove closeVideoModal
        if 'function closeVideoModal() {' in line:
            # Skip till end of function
            i += 1
            while i < len(lines) and lines[i].strip() != '}':
                i += 1
            i += 1 # skip closing brace
            continue
            
        # Remove shiftVideo
        if 'function shiftVideo(dir: number) {' in line:
            # Skip till end of function
            i += 1
            while i < len(lines) and lines[i].strip() != '}':
                i += 1
            i += 1 # skip closing brace
            continue

        # In useEffect for keydown, remove if (e.key === "Escape") { if (isVideoModalOpen) ... }
        if 'if (isVideoModalOpen) closeVideoModal();' in line:
            i += 1; continue
            
        if 'if (e.key === "ArrowLeft" && isVideoModalOpen) shiftVideo(-1);' in line:
            i += 1; continue
            
        if 'if (e.key === "ArrowRight" && isVideoModalOpen) shiftVideo(1);' in line:
            i += 1; continue
        
        # modify the dependency array of that useEffect
        if '}, [isModalOpen, isVideoModalOpen]);' in line:
            new_lines.append(line.replace(', isVideoModalOpen', ''))
            i += 1
            continue
            
        # Actually I also need to update the import react hooks if they are unused, but it's fine.

        new_lines.append(line)
        i += 1

    with open('components/LandingPage.tsx', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
        
    print("Successfully cleaned up unused hooks.")

if __name__ == '__main__':
    main()

import sys
import re

def process():
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
        
        # Replace the auth text
        if '{authMode === "login"' in line and i+1 < len(lines) and 'Welcome back. Continue your program in seconds.' in lines[i+1]:
            new_lines.append(line)
            new_lines.append(lines[i+1])
            new_lines.append('                  : "Sign up to track your progress and support purposes."}\n')
            i += 3  # skip this and the next two lines (Wait, the original is three lines total. Let's just skip the third line)
            continue
            
        if line.strip() == ': "Your personalized dashboard will be ready instantly."}':
            i += 1
            continue

        # Modify Nav
        if '<div className="nav-links">' in line:
            new_lines.append(line)
            new_lines.append('          {isAdmin ? (\n')
            new_lines.append('            <a href="/admin" className="nav-cta lp-mr-10">\n')
            new_lines.append('              Admin\n')
            new_lines.append('            </a>\n')
            new_lines.append('          ) : null}\n')
            new_lines.append('          <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode("login"); openModal(); }} className="nav-cta">\n')
            new_lines.append('            Log in\n')
            new_lines.append('          </a>\n')
            new_lines.append('        </div>\n')
            
            # fast forward to </nav>
            while i < len(lines) and lines[i].strip() != '</nav>':
                i += 1
            new_lines.append('      </nav>\n')
            i += 1
            continue
            
        # Delete Hero -> Quote
        if line.strip() == '{/* HERO */}':
            skip = True
        
        if skip and line.strip() == '{/* PROGRAMS */}':
            skip = False
            new_lines.append(line)
            i += 1
            continue

        # Delete from Module Preview to Footer
        if line.strip() == '{/* MODULE PREVIEW */}':
            skip = True
            
        if skip and line.strip() == '{/* FOOTER */}':
            skip = False
            new_lines.append(line)
            i += 1
            continue
            
        if not skip:
            new_lines.append(line)
            
        i += 1

    with open('components/LandingPage.modified.tsx', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
        
    print("Successfully created components/LandingPage.modified.tsx")

if __name__ == '__main__':
    process()

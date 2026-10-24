import os, re

src = r'e:\Javed website\Javed website\src'
# Pattern: to="/something" where "something" doesn't end with /
# Also check navigate('/something') and href='/something'
patterns = [
    ('to=', re.compile(r'to="(/[^"]*[^/"])"')),
    ('navigate', re.compile(r"navigate\('(/[^']*[^/'])'\)")),
    ('navigate_dq', re.compile(r'navigate\("(/[^"]*[^/"])"\)')),
    ('href=', re.compile(r'href="(/[^"]*[^/"])"')),
]

results = []
for root, dirs, files in os.walk(src):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.git')]
    for fname in files:
        if fname.endswith(('.jsx', '.js')):
            fpath = os.path.join(root, fname)
            with open(fpath, encoding='utf-8', errors='ignore') as f:
                for i, line in enumerate(f, 1):
                    for pname, pat in patterns:
                        for m in pat.finditer(line):
                            # skip file extensions and external
                            val = m.group(1)
                            if '.' in val.split('/')[-1]:
                                continue  # skip /file.xml etc
                            rel = os.path.relpath(fpath, src)
                            results.append((rel, i, pname, val, line.strip()[:120]))

for rel, i, pname, val, ctx in results:
    print(f"{rel}:{i} [{pname}] {val}")
    print(f"  {ctx}")

print(f"\nTotal: {len(results)} occurrences")

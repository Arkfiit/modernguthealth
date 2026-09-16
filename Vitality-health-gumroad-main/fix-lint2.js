const fs = require('fs');
const lintLog = fs.readFileSync('next_lint.txt', 'utf8');
const linesText = fs.readFileSync('components/LandingPage.tsx', 'utf8');
const lines = linesText.split('\n');

const errors = [];
// matches "15: 601:18  Error: `"` "
const regex = /(?:^\d+:\s+)?(\d+):(\d+)\s+Error:\s+`(['"])/gm;

let match;
while ((match = regex.exec(lintLog)) !== null) {
  errors.push({
    line: parseInt(match[1]) - 1,
    col: parseInt(match[2]) - 1,
    char: match[3]
  });
}

errors.sort((a, b) => {
  if (a.line !== b.line) return b.line - a.line;
  return b.col - a.col;
});

let replacements = 0;
for (const err of errors) {
  const lineObj = lines[err.line];
  if(lineObj && lineObj[err.col] === err.char) {
    const replacement = err.char === "'" ? "&apos;" : "&quot;";
    lines[err.line] = lineObj.substring(0, err.col) + replacement + lineObj.substring(err.col + 1);
    replacements++;
  } else {
    console.warn("Mismatch at L" + (err.line+1) + " C" + (err.col+1));
  }
}

fs.writeFileSync('components/LandingPage.tsx', lines.join('\n'));
console.log(`Successfully applied ${replacements} replacements.`);

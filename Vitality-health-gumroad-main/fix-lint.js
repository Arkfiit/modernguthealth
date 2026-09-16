const fs = require('fs');

const lintLog = fs.readFileSync('next_lint.txt', 'utf8');
const linesText = fs.readFileSync('components/LandingPage.tsx', 'utf8');
const lines = linesText.split('\n');

const errors = [];
const regex = /^(\d+):(\d+)\s+Error:\s+`(['"])`/gm;
let match;
while ((match = regex.exec(lintLog)) !== null) {
  errors.push({
    line: parseInt(match[1]) - 1,
    col: parseInt(match[2]) - 1,
    char: match[3]
  });
}

// Sort in reverse order (by line descending, then column descending) to safely mutate
errors.sort((a, b) => {
  if (a.line !== b.line) return b.line - a.line;
  return b.col - a.col;
});

let replacements = 0;
for (const err of errors) {
  const lineObj = lines[err.line];
  // Verify it's actually the character we expect
  if (lineObj[err.col] === err.char) {
    const replacement = err.char === "'" ? "&apos;" : "&quot;";
    lines[err.line] = lineObj.substring(0, err.col) + replacement + lineObj.substring(err.col + 1);
    replacements++;
  } else {
    console.warn(`Mismatch at line ${err.line+1} col ${err.col+1}: Expected ${err.char} but found ${lineObj[err.col]}`);
  }
}

fs.writeFileSync('components/LandingPage.tsx', lines.join('\n'));
console.log(`Successfully applied ${replacements} replacements.`);

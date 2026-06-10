import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      callback(filepath);
    }
  }
}

const importRegex = /(from\s+['"])(\.\.\/)+(components|context|hooks|lib|constants)(\/)/g;

let count = 0;

walk(SRC_DIR, (filepath) => {
  const content = fs.readFileSync(filepath, 'utf8');
  if (importRegex.test(content)) {
    const updatedContent = content.replace(importRegex, '$1@/$3$4');
    fs.writeFileSync(filepath, updatedContent, 'utf8');
    console.log(`Updated imports in: ${path.relative(SRC_DIR, filepath)}`);
    count++;
  }
});

console.log(`Successfully updated imports in ${count} files.`);

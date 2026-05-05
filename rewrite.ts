import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (path: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const dir = path.join(process.cwd(), 'src');

walkDir(dir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    content = content.replace(/gold-500/g, 'primary-500');
    content = content.replace(/gold-400/g, 'primary-400');
    content = content.replace(/gold-600/g, 'primary-600');
    content = content.replace(/text-navy-900/g, 'text-white');
    content = content.replace(/shadow-\[0_0_15px_rgba\(245,166,35,0\.3\)\]/g, 'shadow-lg shadow-primary-500/25');
    content = content.replace(/shadow-\[0_0_20px_rgba\(245,166,35,0\.2\)\]/g, 'shadow-lg shadow-primary-500/25');
    content = content.replace(/shadow-\[0_0_15px_rgba\(245,166,35,0\.2\)\]/g, 'shadow-lg shadow-primary-500/25');
    content = content.replace(/shadow-\[0_0_20px_rgba\(245,166,35,0\.1\)\]/g, 'shadow-lg shadow-primary-500/15');
    
    fs.writeFileSync(filePath, content, 'utf-8');
  }
});
console.log('Done replacing classes');

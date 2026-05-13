const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    
    // Remove import
    newContent = newContent.replace(/import\s+{.*}\s+from\s+['"]framer-motion['"];?\n?/g, '');
    
    // Replace <motion.div> to <div> etc
    newContent = newContent.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1');
    newContent = newContent.replace(/<\/motion\.([a-zA-Z0-9]+)/g, '</$1');
    
    // Remove AnimatePresence wrapper
    newContent = newContent.replace(/<AnimatePresence[^>]*>/g, '');
    newContent = newContent.replace(/<\/AnimatePresence>/g, '');

    // Remove Framer motion specific props like initial, animate, exit, transition
    // Note: this regex might be a bit naive but should work for most inline objects
    newContent = newContent.replace(/\s+(initial|animate|exit|transition|whileHover|whileTap|layoutId|layout)=\{[^}]+\}/g, '');
    newContent = newContent.replace(/\s+(initial|animate|exit|transition|whileHover|whileTap|layoutId|layout)="[^"]+"/g, '');
    newContent = newContent.replace(/\s+layout\s/g, ' ');
    newContent = newContent.replace(/\s+layout\b(?!\=)/g, '');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Modified', filePath);
    }
  }
});

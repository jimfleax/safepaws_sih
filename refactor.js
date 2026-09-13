import fs from 'fs';
import path from 'path';

const modalsDir = './src/components/modals';
const modals = ['CommunityModal.tsx', 'HowItWorksModal.tsx', 'InfoModal.tsx', 'PetProfileModal.tsx', 'QrTagModal.tsx'];

for (const modal of modals) {
  const filePath = path.join(modalsDir, modal);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. imports
  content = content.replace(/import \{ X,(.*?)\} from 'lucide-react';/, "import { $1 } from 'lucide-react';\nimport { Dialog, DialogContent, DialogClose, DialogTitle } from '../ui/Dialog';");
  // sometimes X is not first, or there's no X
  if (!content.includes('../ui/Dialog')) {
      content = content.replace(/import \{(.*?)\} from 'lucide-react';/, "import { $1 } from 'lucide-react';\nimport { Dialog, DialogContent, DialogClose, DialogTitle } from '../ui/Dialog';");
      content = content.replace(/X,\s*/, '');
  }

  // 2. remove isOpen check
  content = content.replace(/\n\s*if \(!isOpen\) return null;\n/, '\n');

  // 3. outer wrapper
  const outerWrapperRegex = /<div className="fixed inset-0[^>]+>\s*<motion\.div[^>]+className="[^"]+flex flex-col"[^>]*>/;
  content = content.replace(outerWrapperRegex, '<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>\n      <DialogContent>');

  // 4. title
  content = content.replace(/<h2 className="font-serif[^>]+>/g, '<DialogTitle>');
  content = content.replace(/<\/h2>/g, '</DialogTitle>');

  // 5. close button
  const closeBtnRegex = /<button\s+id="close-[a-z-]+-modal-btn"[^>]+>\s*<X[^>]+>\s*<\/button>/;
  content = content.replace(closeBtnRegex, (match) => {
      const idMatch = match.match(/id="([^"]+)"/);
      return `<DialogClose id="${idMatch ? idMatch[1] : 'close-btn'}" />`;
  });

  // 6. closing tags
  content = content.replace(/<\/motion\.div>\s*<\/div>\s*\);/s, '</DialogContent>\n    </Dialog>\n  );');

  fs.writeFileSync(filePath, content);
  console.log(`Refactored ${modal}`);
}

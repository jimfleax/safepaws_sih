const fs = require('fs');
const path = 'frontend/src/components/CustomCursor.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/interface CustomCursorProps {\s*isModalOpen\?: boolean;\s*}\s*export const CustomCursor: React\.FC<CustomCursorProps> = \({ isModalOpen = false }\) => {/, 'export const CustomCursor: React.FC = () => {');

// Add state for modal
content = content.replace(/const \[isClicking, setIsClicking\] = useState\(false\);/, 'const [isClicking, setIsClicking] = useState(false);\n  const [isModalOpen, setIsModalOpen] = useState(false);\n\n  useEffect(() => {\n    const observer = new MutationObserver(() => {\n      setIsModalOpen(!!document.querySelector(\'[role="dialog"]\'));\n    });\n    observer.observe(document.body, { childList: true, subtree: true });\n    return () => observer.disconnect();\n  }, []);');

fs.writeFileSync(path, content);

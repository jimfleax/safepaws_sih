import fs from 'fs';
import path from 'path';

const modalsDir = './src/components/modals';
const modals = ['CommunityModal', 'HowItWorksModal', 'InfoModal', 'PetProfileModal', 'QrTagModal'];

for (const modal of modals) {
  const filePath = path.join(modalsDir, `${modal}.test.tsx`);
  
  const content = `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ${modal} } from './${modal}';

it('acts as an accessible dialog and supports escape key to close', async () => {
  const handleClose = vi.fn();
  const user = userEvent.setup();
  
  render(
    <${modal} 
      isOpen={true} 
      onClose={handleClose} 
      pet={{ name: 'Buddy', id: '1' } as any}
      title="Test"
      content="Test"
      alert={{ status: 'active', notifiedNeighborsCount: 5, broadcastRadiusKm: 2 } as any}
    />
  );

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  
  await user.keyboard('{Escape}');
  expect(handleClose).toHaveBeenCalled();
});
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created test for ${modal}`);
}

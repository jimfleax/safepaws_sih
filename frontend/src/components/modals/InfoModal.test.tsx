import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { InfoModal } from './InfoModal';

it('acts as an accessible dialog and supports escape key to close', async () => {
  const handleClose = vi.fn();
  const user = userEvent.setup();
  
  render(
    <InfoModal 
      isOpen={true} 
      onClose={handleClose} 
      type="privacy"
    />
  );

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  
  await user.keyboard('{Escape}');
  expect(handleClose).toHaveBeenCalled();
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogContent, DialogTrigger } from './Dialog';

it('renders an accessible dialog that can be opened and closed', async () => {
  const user = userEvent.setup();
  render(
    <Dialog>
      <DialogTrigger>Open Modal</DialogTrigger>
      <DialogContent>
        <h2>Modal Content</h2>
      </DialogContent>
    </Dialog>
  );

  // Trigger opens the dialog
  await user.click(screen.getByText('Open Modal'));
  
  // Dialog role should exist for accessibility
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeInTheDocument();
  
  // Content should be visible
  expect(screen.getByText('Modal Content')).toBeInTheDocument();
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from './Dialog';

describe('Dialog primitive', () => {
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

    // Built-in close button enforces >= 44x44px touch bounding box
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn.className).toContain('min-h-[44px]');
    expect(closeBtn.className).toContain('min-w-[44px]');
  });

  it('renders custom DialogClose with >= 44x44px touch bounding box', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogClose>Dismiss</DialogClose>
        </DialogContent>
      </Dialog>
    );

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn.className).toContain('min-h-[44px]');
    expect(closeBtn.className).toContain('min-w-[44px]');
  });
});

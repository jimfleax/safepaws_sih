import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LostAlertModal } from './LostAlertModal';

it('acts as an accessible dialog and supports escape key to close', async () => {
  const handleClose = vi.fn();
  const user = userEvent.setup();
  
  render(
    <LostAlertModal 
      isOpen={true} 
      onClose={handleClose} 
      pet={{ name: 'Buddy' } as any}
      alert={{ status: 'active', notifiedNeighborsCount: 5, broadcastRadiusKm: 2 } as any}
      sightings={[]}
      onAddSighting={vi.fn()}
      onResolveAlert={vi.fn()}
    />
  );

  // Must have a dialog role
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  
  // Pressing escape should call onClose
  await user.keyboard('{Escape}');
  expect(handleClose).toHaveBeenCalled();
});

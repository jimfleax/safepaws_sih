import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FieldButton } from './FieldButton';

describe('FieldButton component', () => {
  it('renders correctly with default primary props and metadata', () => {
    render(<FieldButton metadata="SECURE ACTION">Confirm Dispatch</FieldButton>);
    const button = screen.getByRole('button', { name: /confirm dispatch/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('SECURE ACTION')).toBeInTheDocument();

    // Verify touch target standard (>=44px desktop, >=48px mobile)
    expect(button.className).toContain('min-h-[44px]');
    expect(button.className).toContain('sm:min-h-[48px]');
  });

  it('renders alert variant with distinctive clay background', () => {
    render(<FieldButton variant="alert">Broadcast Emergency</FieldButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-[#B3452F]');
    expect(button.className).toContain('text-white');
  });

  it('renders secondary variant with Bone background and crisp border', () => {
    render(<FieldButton variant="secondary">View Ledger</FieldButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-[#F6F1E7]');
    expect(button.className).toContain('text-[#1C1A17]');
  });

  it('handles click events and disabled states', async () => {
    const handleClick = vi.fn();
    const { rerender } = render(<FieldButton onClick={handleClick}>Action</FieldButton>);
    const button = screen.getByRole('button');

    const user = userEvent.setup();
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(
      <FieldButton disabled onClick={handleClick}>
        Disabled Action
      </FieldButton>
    );
    expect(button).toBeDisabled();
    expect(button.className).toContain('cursor-not-allowed');
  });
});

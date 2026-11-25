import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InteractiveSticker } from './InteractiveSticker';

describe('InteractiveSticker component', () => {
  it('renders verification seal with accessible button role and label', () => {
    render(<InteractiveSticker title="CANINE BIO SEAL" serialNumber="SP-9001" />);
    const sticker = screen.getByRole('button');
    expect(sticker).toBeInTheDocument();
    expect(sticker).toHaveAttribute('aria-expanded', 'false');
    expect(sticker).toHaveAttribute('aria-label');
    expect(screen.getByText('CANINE BIO SEAL')).toBeInTheDocument();
  });

  it('toggles peel state on click and updates aria-expanded', async () => {
    const handleStateChange = vi.fn();
    render(
      <InteractiveSticker
        title="VERIFIED BADGE"
        serialNumber="SP-9001"
        onPeelStateChange={handleStateChange}
      />
    );
    const sticker = screen.getByRole('button');

    const user = userEvent.setup();
    await user.click(sticker);

    expect(sticker).toHaveAttribute('aria-expanded', 'true');
    expect(handleStateChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('RECORD #894-2026')).toBeInTheDocument();
  });

  it('supports keyboard navigation via Enter and Space keys', async () => {
    const handleStateChange = vi.fn();
    render(<InteractiveSticker onPeelStateChange={handleStateChange} />);
    const sticker = screen.getByRole('button');

    // Focus and press Enter
    sticker.focus();
    expect(sticker).toHaveFocus();

    fireEvent.keyDown(sticker, { key: 'Enter', code: 'Enter' });
    expect(sticker).toHaveAttribute('aria-expanded', 'true');
    expect(handleStateChange).toHaveBeenCalledWith(true);

    // Press Space to reseal
    fireEvent.keyDown(sticker, { key: ' ', code: 'Space' });
    expect(sticker).toHaveAttribute('aria-expanded', 'false');
    expect(handleStateChange).toHaveBeenCalledWith(false);
  });

  it('renders different variants cleanly', () => {
    const { rerender } = render(<InteractiveSticker variant="clay" title="CLAY VARIANT" />);
    expect(screen.getByText('CLAY VARIANT')).toBeInTheDocument();

    rerender(<InteractiveSticker variant="obsidian" title="OBSIDIAN VARIANT" />);
    expect(screen.getByText('OBSIDIAN VARIANT')).toBeInTheDocument();
  });
});

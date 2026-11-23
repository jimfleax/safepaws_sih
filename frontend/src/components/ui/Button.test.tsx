import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button primitive', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    // Verify touch target class
    expect(button.className).toContain('min-h-[44px]');
    expect(button.className).toContain('min-w-[44px]');
  });

  it('renders accent variant with proper accessible styling', () => {
    render(<Button variant="accent">Accent Action</Button>);
    const button = screen.getByRole('button', { name: /accent action/i });
    expect(button.className).toContain('bg-[var(--color-accent)]');
    expect(button.className).toContain('text-[var(--color-ink)]');
  });

  it('renders alert and danger variants for high-urgency and destructive states', () => {
    const { rerender } = render(<Button variant="alert">Alert</Button>);
    expect(screen.getByRole('button', { name: /alert/i }).className).toContain('bg-[var(--color-alert-clay)]');

    rerender(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button', { name: /delete/i }).className).toContain('bg-[var(--color-danger)]');
  });

  it('handles loading state with aria-busy and disables interaction', async () => {
    const handleClick = vi.fn();
    render(
      <Button isLoading onClick={handleClick}>
        Submit
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(button).catch(() => {});
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders left and right icons properly', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      >
        Icon Button
      </Button>
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByText('Icon Button')).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';
import { FormField, FormLabel, FormError } from './FormField';

describe('Input primitive', () => {
  it('enforces >= 44px touch target and proper styling', () => {
    render(<Input placeholder="Search tag or dog name" />);
    const input = screen.getByPlaceholderText('Search tag or dog name');
    expect(input).toBeInTheDocument();
    expect(input.className).toContain('min-h-[44px]');
    expect(input.className).toContain('h-12');
  });

  it('supports error state and binds aria attributes in FormField', () => {
    render(
      <FormField hasError>
        <FormLabel>Tag ID</FormLabel>
        <Input placeholder="TAG-1234" />
        <FormError>Invalid QR Tag</FormError>
      </FormField>
    );
    const input = screen.getByPlaceholderText('TAG-1234');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
    expect(input.className).toContain('border-[var(--color-danger)]');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField, FormLabel, FormHelperText, FormError } from './FormField';
import { Input } from './Input';

describe('FormField and accessible form controls', () => {
  it('automatically connects label and input via generated ID', () => {
    render(
      <FormField>
        <FormLabel required>Emergency Phone</FormLabel>
        <Input placeholder="(555) 000-0000" />
        <FormHelperText>Visible to finders.</FormHelperText>
      </FormField>
    );

    const input = screen.getByPlaceholderText('(555) 000-0000');
    const label = screen.getByText('Emergency Phone');

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', input.id);
    expect(input.id).toMatch(/^field-/);
    expect(input).toHaveAttribute('aria-describedby', `${input.id}-description`);
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('binds error state and error ID to input aria-invalid and aria-describedby', () => {
    render(
      <FormField hasError={true}>
        <FormLabel>Pet Microchip ID</FormLabel>
        <Input placeholder="9851410..." />
        <FormHelperText>15-digit number</FormHelperText>
        <FormError>Invalid microchip format</FormError>
      </FormField>
    );

    const input = screen.getByPlaceholderText('9851410...');
    const error = screen.getByRole('alert');

    expect(error).toHaveTextContent('Invalid microchip format');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', error.id);
    expect(error.id).toBe(`${input.id}-error`);
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select } from './Select';
import { FormField, FormLabel } from './FormField';

describe('Select primitive', () => {
  it('enforces >= 44px touch target and proper styling', () => {
    render(
      <Select aria-label="Select breed">
        <option value="retriever">Golden Retriever</option>
        <option value="husky">Siberian Husky</option>
      </Select>
    );
    const select = screen.getByRole('combobox', { name: /select breed/i });
    expect(select).toBeInTheDocument();
    expect(select.className).toContain('min-h-[44px]');
    expect(select.className).toContain('h-12');
  });

  it('integrates with FormField context', () => {
    render(
      <FormField>
        <FormLabel>Dog Size</FormLabel>
        <Select>
          <option value="small">Small (&lt; 20 lbs)</option>
          <option value="medium">Medium (20-60 lbs)</option>
        </Select>
      </FormField>
    );
    const select = screen.getByRole('combobox');
    expect(select.id).toMatch(/^field-/);
  });
});

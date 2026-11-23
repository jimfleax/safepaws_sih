import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge primitive', () => {
  it('renders default badge', () => {
    render(<Badge>Default Badge</Badge>);
    expect(screen.getByText('Default Badge')).toBeInTheDocument();
  });

  it('renders pulse indicator when pulse=true', () => {
    const { container } = render(<Badge variant="alert" pulse>Active Alert</Badge>);
    expect(screen.getByText('Active Alert')).toBeInTheDocument();
    const pingSpan = container.querySelector('.animate-ping');
    expect(pingSpan).toBeInTheDocument();
  });

  it('renders telemetry variant with monospace font', () => {
    render(<Badge variant="telemetry">FAISS: 0.892</Badge>);
    const badge = screen.getByText('FAISS: 0.892');
    expect(badge.className).toContain('font-mono');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LedgerCard } from './LedgerCard';

describe('LedgerCard component', () => {
  it('renders with children, referenceId and telemetry header', () => {
    render(
      <LedgerCard
        status="missing"
        referenceId="ALERT-8021"
        telemetry="37.7749° N, 122.4194° W"
      >
        <p>Barnaby missing near Golden Gate Park</p>
      </LedgerCard>
    );

    expect(screen.getByText('REF: #ALERT-8021')).toBeInTheDocument();
    expect(screen.getByText('37.7749° N, 122.4194° W')).toBeInTheDocument();
    expect(screen.getByText('Barnaby missing near Golden Gate Park')).toBeInTheDocument();
  });

  it('applies distinctive vertical alert spines by status', () => {
    const { rerender, container } = render(
      <LedgerCard status="missing">Card Content</LedgerCard>
    );
    expect(container.firstChild).toHaveClass('border-l-[#B3452F]');

    rerender(<LedgerCard status="sighting">Card Content</LedgerCard>);
    expect(container.firstChild).toHaveClass('border-l-[#E2811F]');

    rerender(<LedgerCard status="reunited">Card Content</LedgerCard>);
    expect(container.firstChild).toHaveClass('border-l-[#63684B]');
  });
});

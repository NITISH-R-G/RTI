import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { JourneyProvider } from '../state/journey';
import { Landing } from './Landing';

function renderLanding() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <JourneyProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/clarify" element={<h1>Clarify screen</h1>} />
          <Route path="/not-rti" element={<h1>Not RTI screen</h1>} />
        </Routes>
      </JourneyProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => window.localStorage.clear());

describe('Landing', () => {
  it('gives the textarea an accessible name and description', () => {
    renderLanding();
    const area = screen.getByLabelText(/tell us about your problem/i);
    expect(area).toBeInTheDocument();
    expect(area).toHaveAccessibleDescription(/tell a relative/i);
  });

  it('rejects empty input with an error tied to the field', async () => {
    const user = userEvent.setup();
    renderLanding();
    await user.click(screen.getByRole('button', { name: /continue/i }));

    const area = screen.getByLabelText(/tell us about your problem/i);
    expect(area).toHaveAttribute('aria-invalid', 'true');
    expect(area).toHaveAccessibleDescription(/tell us what happened/i);
    expect(screen.queryByText(/clarify screen/i)).not.toBeInTheDocument();
  });

  it('advises on very short input but does not block a second attempt', async () => {
    const user = userEvent.setup();
    renderLanding();
    const area = screen.getByLabelText(/tell us about your problem/i);

    await user.type(area, 'pension');
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText(/quite short/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /clarify screen/i })).not.toBeInTheDocument();

    // Pressing again carries on: advisory, never a hard block (S9).
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByRole('heading', { name: /clarify screen/i })).toBeInTheDocument();
  });

  it('routes the founding pension case onward instead of dead-ending', async () => {
    const user = userEvent.setup();
    renderLanding();
    await user.type(
      screen.getByLabelText(/tell us about your problem/i),
      'my pension has not been paid',
    );
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByRole('heading', { name: /clarify screen/i })).toBeInTheDocument();
  });

  it('routes a grievance to the not-RTI path', async () => {
    const user = userEvent.setup();
    renderLanding();
    await user.type(
      screen.getByLabelText(/tell us about your problem/i),
      'I want to complain about my neighbour',
    );
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByRole('heading', { name: /not rti screen/i })).toBeInTheDocument();
  });

  it('fills the field from an example without submitting', async () => {
    const user = userEvent.setup();
    renderLanding();
    await user.click(screen.getByRole('button', { name: /my pension has not been paid/i }));
    expect(screen.getByLabelText(/tell us about your problem/i)).toHaveValue(
      'My pension has not been paid for three months.',
    );
    expect(screen.queryByRole('heading', { name: /clarify screen/i })).not.toBeInTheDocument();
  });

  it('states the fee and the exemption before any effort is invested', () => {
    renderLanding();
    expect(screen.getByText(/₹10/)).toBeInTheDocument();
    expect(screen.getByText(/below poverty line/i)).toBeInTheDocument();
  });

  it('restores work when returning to the screen', async () => {
    const user = userEvent.setup();
    const { unmount } = renderLanding();
    await user.type(screen.getByLabelText(/tell us about your problem/i), 'my pension has not been paid');
    await user.click(screen.getByRole('button', { name: /continue/i }));
    unmount();

    renderLanding();
    expect(screen.getByLabelText(/tell us about your problem/i)).toHaveValue(
      'my pension has not been paid',
    );
  });
});

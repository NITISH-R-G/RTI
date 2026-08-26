import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { JourneyProvider } from '../state/journey';
import { Landing } from './Landing';
import { Clarify } from './Clarify';

function renderApp(initial = '/') {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <JourneyProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/clarify" element={<Clarify />} />
          <Route path="/request" element={<h1>Request screen</h1>} />
          <Route path="/not-rti" element={<h1>Not RTI screen</h1>} />
        </Routes>
      </JourneyProvider>
    </MemoryRouter>,
  );
}

async function startWith(text: string) {
  const user = userEvent.setup();
  renderApp();
  await user.type(screen.getByLabelText(/tell us about your problem/i), text);
  await user.click(screen.getByRole('button', { name: /continue/i }));
  return user;
}

beforeEach(() => window.localStorage.clear());

describe('Clarify', () => {
  it('redirects to the start if there is no problem yet', () => {
    renderApp('/clarify');
    expect(screen.getByRole('heading', { name: /what happened/i })).toBeInTheDocument();
  });

  it('asks the pension question as a labelled radiogroup', async () => {
    await startWith('my pension has not been paid');
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAccessibleName(/which kind of pension/i);
    expect(screen.getAllByRole('radio').length).toBeGreaterThanOrEqual(3);
  });

  it('asks at most three questions', async () => {
    await startWith('my pension has not been paid');
    expect(screen.getByText(/question 1 of [123]\b/i)).toBeInTheDocument();
  });

  it('offers an "I am not sure" escape on every question', async () => {
    await startWith('my pension has not been paid');
    expect(screen.getByRole('radio', { name: /not sure/i })).toBeInTheDocument();
  });

  it('a central pension answer proceeds to the request screen', async () => {
    const user = await startWith('my pension has not been paid');
    await user.click(screen.getByRole('radio', { name: /central government service pension/i }));
    expect(screen.getByRole('heading', { name: /request screen/i })).toBeInTheDocument();
  });

  it('a social pension answer routes away from the central portal with the fee warning', async () => {
    const user = await startWith('my pension has not been paid');
    await user.click(screen.getByRole('radio', { name: /old-age or social welfare/i }));
    expect(screen.getByRole('heading', { name: /not rti screen/i })).toBeInTheDocument();
  });

  it('back returns to the landing screen with the text intact', async () => {
    const user = await startWith('my pension has not been paid');
    await user.click(screen.getByRole('button', { name: /^back$/i }));
    expect(screen.getByLabelText(/tell us about your problem/i)).toHaveValue(
      'my pension has not been paid',
    );
  });

  it('explains why the office matters, in money terms', async () => {
    await startWith('my pension has not been paid');
    expect(screen.getByText(/fee is not refunded/i)).toBeInTheDocument();
  });

  it('asks which domain when two are contested, rather than guessing', async () => {
    await startWith('my pension and passport are both delayed');
    expect(screen.getByRole('radiogroup')).toHaveAccessibleName(/which of these/i);
    expect(screen.getByRole('radio', { name: /^passport$/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /none of these/i })).toBeInTheDocument();
  });
});

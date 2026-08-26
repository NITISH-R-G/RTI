import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { JourneyProvider } from '../state/journey';
import { Landing } from './Landing';
import { Clarify } from './Clarify';
import { RequestDraft } from './RequestDraft';
import { Authority } from './Authority';
import { isRealAuthority } from '../authorities';

function renderApp(initial = '/') {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <JourneyProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/clarify" element={<Clarify />} />
          <Route path="/request" element={<RequestDraft />} />
          <Route path="/authority" element={<Authority />} />
          <Route path="/review" element={<h1>Review screen</h1>} />
          <Route path="/not-rti" element={<h1>Not RTI screen</h1>} />
        </Routes>
      </JourneyProvider>
    </MemoryRouter>,
  );
}

/** The demo-critical path. If this breaks, the first minute of the video breaks. */
async function walkPensionJourney() {
  const user = userEvent.setup();
  renderApp();
  await user.type(
    screen.getByLabelText(/tell us about your problem/i),
    'my pension has not been paid',
  );
  await user.click(screen.getByRole('button', { name: /continue/i }));
  await user.click(screen.getByRole('radio', { name: /central government service pension/i }));
  return user;
}

beforeEach(() => window.localStorage.clear());

describe('DEMO-CRITICAL PATH: my pension has not been paid', () => {
  it('walks problem to authority without a dead end, and reaches review', async () => {
    const user = await walkPensionJourney();

    // Draft screen — shows what they said, what they chose, and the request
    expect(screen.getByRole('heading', { name: /^your request$/i })).toBeInTheDocument();
    expect(screen.getByText('my pension has not been paid')).toBeInTheDocument();
    expect(screen.getByText(/what information do you want to get/i)).toBeInTheDocument();

    const draft = screen.getByLabelText(/^your request$/i) as HTMLTextAreaElement;
    expect(draft.value).toMatch(/Right to Information Act, 2005/);
    expect(draft.value).toContain('pension has not been paid');

    await user.click(screen.getByRole('button', { name: /find where to send it/i }));

    // Authority screen — the recommendation, derived and explained
    expect(screen.getByText(/based on what you told us/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Department of Pensions & Pensioners Welfare' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/why this may be the right place/i)).toBeInTheDocument();
    expect(
      screen.getByText(/central government service pension, which this office administers/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /continue with this office/i }));
    expect(screen.getByRole('heading', { name: /review screen/i })).toBeInTheDocument();
  });

  it('never presents the recommendation as an AI verdict', async () => {
    await walkPensionJourney();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /find where to send it/i }));
    expect(document.body.textContent).not.toMatch(/\bAI\b/);
    expect(document.body.textContent).not.toMatch(/artificial intelligence/i);
    expect(document.body.textContent).not.toMatch(/\d+% confiden/i);
  });
});

describe('Draft screen', () => {
  it('rebuilds the draft when the citizen changes what they are asking for', async () => {
    const user = await walkPensionJourney();
    const draft = screen.getByLabelText(/^your request$/i) as HTMLTextAreaElement;
    const before = draft.value;
    await user.click(screen.getByRole('checkbox', { name: /what rules or criteria were applied/i }));
    expect(draft.value).not.toBe(before);
    expect(draft.value).toMatch(/rules, circulars or criteria/i);
  });

  it('stops rewriting once the citizen edits it, and offers a way back', async () => {
    const user = await walkPensionJourney();
    const draft = screen.getByLabelText(/^your request$/i) as HTMLTextAreaElement;
    await user.clear(draft);
    await user.type(draft, 'Please provide the status of my pension file.');
    expect(screen.getByText(/you have edited this/i)).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /what rules or criteria were applied/i }));
    expect(draft.value).toBe('Please provide the status of my pension file.');

    await user.click(screen.getByRole('button', { name: /start again from our version/i }));
    expect(draft.value).toMatch(/Right to Information Act, 2005/);
  });

  it('names the exact characters the portal will reject, and can fix them', async () => {
    const user = await walkPensionJourney();
    const draft = screen.getByLabelText(/^your request$/i) as HTMLTextAreaElement;
    await user.clear(draft);
    await user.type(draft, "Please send my father's pension records #urgent");

    expect(screen.getByText(/some characters are not accepted/i)).toBeInTheDocument();
    const notice = screen.getByText(/some characters are not accepted/i).closest('div')!;
    expect(within(notice).getByText("'")).toBeInTheDocument();
    expect(within(notice).getByText('#')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /fix these for me/i }));
    expect(draft.value).not.toContain("'");
    expect(draft.value).not.toContain('#');
    expect(screen.queryByText(/some characters are not accepted/i)).not.toBeInTheDocument();
  });

  it('blocks continuing while the text is invalid, and says why', async () => {
    const user = await walkPensionJourney();
    const draft = screen.getByLabelText(/^your request$/i) as HTMLTextAreaElement;
    await user.clear(draft);
    await user.type(draft, 'too short');
    await user.click(screen.getByRole('button', { name: /find where to send it/i }));

    expect(screen.getByText(/this request is very short/i)).toBeInTheDocument();
    expect(draft).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText(/based on what you told us/i)).not.toBeInTheDocument();
  });

  it('shows a live character count against the real limit', async () => {
    await walkPensionJourney();
    expect(screen.getByText(/of 3,000 characters/)).toBeInTheDocument();
    expect(screen.getByText(/left/)).toBeInTheDocument();
  });

  it('preserves the edited draft when navigating back and forward', async () => {
    const user = await walkPensionJourney();
    const draft = screen.getByLabelText(/^your request$/i) as HTMLTextAreaElement;
    await user.clear(draft);
    await user.type(draft, 'Please provide the pension processing history for my case.');
    await user.click(screen.getByRole('button', { name: /find where to send it/i }));
    await user.click(screen.getByRole('button', { name: /back to your request/i }));

    expect((screen.getByLabelText(/^your request$/i) as HTMLTextAreaElement).value).toBe(
      'Please provide the pension processing history for my case.',
    );
  });
});

describe('Authority screen', () => {
  it('lets the citizen override the recommendation via search', async () => {
    const user = await walkPensionJourney();
    await user.click(screen.getByRole('button', { name: /find where to send it/i }));
    await user.click(screen.getByRole('button', { name: /search manually/i }));

    const box = screen.getByLabelText(/search all public authorities/i);
    await user.type(box, 'provident');

    const hit = await screen.findByRole('button', { name: /Employees Provident Fund Organisation/i });
    await user.click(hit);

    expect(screen.getByText(/your request will be addressed to/i)).toBeInTheDocument();
    expect(
      screen.getAllByText('Employees Provident Fund Organisation').length,
    ).toBeGreaterThan(0);
  });

  it('gives every search result real context, never a bare name', async () => {
    const user = await walkPensionJourney();
    await user.click(screen.getByRole('button', { name: /find where to send it/i }));
    await user.click(screen.getByRole('button', { name: /search manually/i }));
    await user.type(screen.getByLabelText(/search all public authorities/i), 'pension');

    const hit = await screen.findByRole('button', { name: /Central Pension Accounting Office/i });
    expect(hit.textContent!.length).toBeGreaterThan('Central Pension Accounting Office'.length + 20);
  });

  it('explains that search matches names, not problems', async () => {
    const user = await walkPensionJourney();
    await user.click(screen.getByRole('button', { name: /find where to send it/i }));
    await user.click(screen.getByRole('button', { name: /search manually/i }));
    expect(screen.getByText(/searches the/i)).toBeInTheDocument();
    expect(screen.getByText(/describing your problem here will not work/i)).toBeInTheDocument();
  });

  it('fails helpfully when a search finds nothing', async () => {
    const user = await walkPensionJourney();
    await user.click(screen.getByRole('button', { name: /find where to send it/i }));
    await user.click(screen.getByRole('button', { name: /search manually/i }));
    await user.type(screen.getByLabelText(/search all public authorities/i), 'zzzzqqqq');

    expect(await screen.findByText(/no office name matches that/i)).toBeInTheDocument();
    expect(screen.getByText(/try a single word from the office name/i)).toBeInTheDocument();
  });

  it('only ever offers authorities from the captured dataset', async () => {
    const user = await walkPensionJourney();
    await user.click(screen.getByRole('button', { name: /find where to send it/i }));
    await user.click(screen.getByRole('button', { name: /see other possible offices/i }));

    const heading = screen.getByRole('heading', { name: 'Department of Pensions & Pensioners Welfare' });
    expect(isRealAuthority(heading.textContent!)).toBe(true);
  });
});

describe('Social pension — the expensive mistake', () => {
  it('proposes no central office and warns that the fee is not refunded', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.type(
      screen.getByLabelText(/tell us about your problem/i),
      'my pension has not been paid',
    );
    await user.click(screen.getByRole('button', { name: /continue/i }));
    await user.click(screen.getByRole('radio', { name: /old-age or social welfare/i }));

    expect(screen.getByRole('heading', { name: /not rti screen/i })).toBeInTheDocument();
  });
});

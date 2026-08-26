import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './ui/Layout';
import { Landing } from './screens/Landing';
import { Clarify } from './screens/Clarify';
import { RequestDraft } from './screens/RequestDraft';
import { Authority } from './screens/Authority';
import { Review } from './screens/Review';
import { Filed } from './screens/Filed';
import { NotRti } from './screens/NotRti';
import { About } from './screens/About';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/clarify" element={<Clarify />} />
        <Route path="/request" element={<RequestDraft />} />
        <Route path="/authority" element={<Authority />} />
        <Route path="/review" element={<Review />} />
        <Route path="/filed/:ref" element={<Filed />} />
        <Route path="/not-rti" element={<NotRti />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

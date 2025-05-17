import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import CourseCatalog from '@/pages/CourseCatalog';
import CourseDetails from '@/pages/CourseDetails';
import MyLearning from '@/pages/MyLearning';
import Profile from '@/pages/Profile';
import LearningHistory from '@/pages/LearningHistory';
import Learning from '@/pages/Learning';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CourseCatalog />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/learning-history" element={<LearningHistory />} />
          <Route path="/learning/:courseId" element={<Learning />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

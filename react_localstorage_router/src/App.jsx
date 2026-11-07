import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import About from './pages/About.jsx';
import Admin from './pages/Admin.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import PostDetails from './pages/PostDetails.jsx';
import PostsList from './pages/PostsList.jsx';
import UserProfile from './pages/UserProfile.jsx';
import UsersList from './pages/UsersList.jsx';

// Переключи на false, чтобы проверить редирект с /admin на главную.
const isAdmin = true;

function ProtectedRoute({ children }) {
  return isAdmin ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/posts" element={<PostsList />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

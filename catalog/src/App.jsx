import { Routes, Route, Navigate } from 'react-router-dom';
import PostsPage from './pages/PostsPage';
import NewPostPage from './pages/NewPostPage';
import EditPostPage from './pages/EditPostPage';
import PostDetailPage from './pages/PostDetailPage';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/new" element={<NewPostPage />} />
        <Route path="/posts/:id/edit" element={<EditPostPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="*" element={<h2>404 — Страница не найдена</h2>} />
      </Routes>
    </div>
  );
}

export default App;

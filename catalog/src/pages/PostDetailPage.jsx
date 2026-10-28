import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPost, deletePost } from '../api/posts';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['posts', Number(id)],
    queryFn: () => getPost(id),
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['posts', Number(id)] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/posts');
    },
  });

  if (isLoading) return <div className="card"><h2>Загрузка поста...</h2></div>;
  if (isError || !post) {
    return (
      <div className="card">
        <h2 style={{ color: 'red' }}>Пост не найден</h2>
        <p style={{ color: '#64748b' }}>Запрашиваемый пост не существует или был удален.</p>
        <Link to="/posts" className="nav-link">← Вернуться к списку постов</Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Link to="/posts" className="nav-link">← Назад к списку</Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-primary" onClick={() => navigate(`/posts/${id}/edit`)}>
            Редактировать
          </button>
          <button
            className="btn-danger"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            Удалить
          </button>
        </div>
      </div>

      <span style={{ fontSize: 13, background: '#e2e8f0', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>
        Статус: {post.status}
      </span>
      <h1 style={{ margin: '12px 0 8px' }}>{post.title}</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>
        Автор ID: {post.userId} | Дата публикации: {post.publishDate}
      </p>

      <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 16, lineHeight: 1.6 }}>
        {post.body}
      </div>

      {post.tags && post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {post.tags.map((tag, idx) => (
            <span key={idx} style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostDetailPage;

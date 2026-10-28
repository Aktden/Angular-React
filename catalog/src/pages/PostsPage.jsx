import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, deletePost } from '../api/posts';

function PostsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previous = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old = []) =>
        old.filter((post) => post.id !== deletedId)
      );
      return { previous };
    },
    onError: (err, deletedId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['posts'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  if (isLoading) return <div className="card"><h2>Загрузка списка постов...</h2></div>;
  if (isError) {
    return (
      <div className="card">
        <h2 style={{ color: 'red' }}>Ошибка: {error.message}</h2>
        <button className="btn-primary" onClick={() => refetch()}>Повторить</button>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, color: '#0f172a' }}>Каталог постов (123)</h1>
        <button className="btn-primary" onClick={() => navigate('/posts/new')}>
          + Создать пост
        </button>
      </div>

      {isFetching && <p style={{ color: '#64748b', fontSize: 13 }}>Фоновое обновление данных...</p>}

      {/* Сетка в 2 колонки */}
      <div className="posts-grid">
        {data.map((post) => (
          <div key={post.id} className="post-item">
            <div>
              <Link to={`/posts/${post.id}`} className="nav-link" style={{ fontSize: 18 }}>
                {post.title}
              </Link>
              <p style={{ margin: '8px 0 0', color: '#475569', fontSize: 14 }}>{post.body}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => navigate(`/posts/${post.id}/edit`)}>
                Редактировать
              </button>
              <button
                className="btn-danger"
                onClick={() => deleteMutation.mutate(post.id)}
                disabled={deleteMutation.isPending}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostsPage;
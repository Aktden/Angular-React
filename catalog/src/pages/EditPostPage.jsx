import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPost, updatePost } from '../api/posts';
import PostForm from '../components/PostForm';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['posts', Number(id)],
    queryFn: () => getPost(id),
  });

  const mutation = useMutation({
    mutationFn: (data) => updatePost({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', Number(id)] });
      navigate('/posts');
    },
  });

  if (isLoading) return <div className="card"><h2>Загрузка данных поста...</h2></div>;
  if (isError || !post) {
    return (
      <div className="card">
        <h2 style={{ color: 'red' }}>Пост не найден</h2>
        <button className="btn-primary" onClick={() => navigate('/posts')}>Вернуться к списку</button>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Редактирование поста #{id}</h2>
        <button onClick={() => navigate('/posts')}>← Назад к списку</button>
      </div>
      <PostForm
        initialValues={post}
        onSubmit={(data) => mutation.mutateAsync(data)}
        isEdit={true}
      />
    </div>
  );
}

export default EditPostPage;

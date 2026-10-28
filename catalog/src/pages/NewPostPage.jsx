import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api/posts';
import PostForm from '../components/PostForm';

function NewPostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/posts');
    },
  });

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Создание нового поста</h2>
        <button onClick={() => navigate('/posts')}>← Назад к списку</button>
      </div>
      <PostForm onSubmit={(data) => mutation.mutateAsync(data)} />
    </div>
  );
}

export default NewPostPage;

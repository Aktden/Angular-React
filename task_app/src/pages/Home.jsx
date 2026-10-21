import { useNavigate } from 'react-router-dom';

function Home({ tasks }) {
  const navigate = useNavigate();
  const doneCount = tasks.filter((t) => t.done).length;
  const activeCount = tasks.length - doneCount;

  return (
    <div>
      <h1>Мои задачи</h1>
      <p>Добро пожаловать в приложение задач.</p>
      <p>
        Всего: {tasks.length} | Выполнено: {doneCount} | Активно: {activeCount}
      </p>
      <button onClick={() => navigate('/tasks')} style={{ padding: '8px 16px', marginTop: 10 }}>
        Перейти к задачам
      </button>
    </div>
  );
}

export default Home;

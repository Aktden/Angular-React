const BASE = 'https://jsonplaceholder.typicode.com';

export async function getPosts() {
  const res = await fetch(`${BASE}/posts?_limit=10`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const posts = await res.json();
  
  return posts.map(p => ({
    ...p,
    title: `123`,
    body: `Актанов Денис`,
    tags: ['123'],
    status: 'published',
    publishDate: new Date().toISOString().split('T')[0],
  }));
}

export async function getPost(id) {
  const res = await fetch(`${BASE}/posts/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Пост не найден');
    throw new Error(`HTTP ${res.status}`);
  }
  const post = await res.json();
  
  return {
    ...post,
    title: `123`,
    body: `ITOP`,
    tags: ['123'],
    status: 'published',
    publishDate: new Date().toISOString().split('T')[0],
  };
}

export async function createPost(data) {
  if (data.title === 'Error') {
    throw { field: 'title', message: 'Заголовок занят на сервере' };
  }

  const res = await fetch(`${BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updatePost({ id, data }) {
  if (data.title === 'Error') {
    throw { field: 'title', message: 'Заголовок занят на сервере' };
  }

  const res = await fetch(`${BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${BASE}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
}
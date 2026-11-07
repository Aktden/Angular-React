import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import StatCard from './components/StatCard.jsx';
import StudentList from './components/StudentList.jsx';
import { students } from './data/students.js';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const totalStudents = students.length;
  const averageGpa =
    totalStudents > 0
      ? students.reduce((sum, student) => sum + student.gpa, 0) /
        totalStudents
      : 0;
  const youngestAge =
    totalStudents > 0
      ? Math.min(...students.map((student) => student.age))
      : 0;
  const uniqueCities = new Set(students.map((student) => student.city)).size;

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('ru');

    if (!normalizedSearch) {
      return students;
    }

    return students.filter((student) => {
      const searchableText = [
        student.name,
        student.city,
        ...student.skills,
        `${student.course} курс`,
      ]
        .join(' ')
        .toLocaleLowerCase('ru');

      return searchableText.includes(normalizedSearch);
    });
  }, [search]);

  return (
    <div className="app-shell">
      <div className="page-container">
        <Header />

        <main>
          <section className="stats-section" aria-label="Статистика каталога">
            <div className="section-heading">
              <div>
                <span className="eyebrow eyebrow--dark">Обзор</span>
                <h2>Общая статистика</h2>
              </div>
              <span className="section-heading__note">Данные каталога</span>
            </div>

            <div className="stats-grid">
              <StatCard
                label="Всего студентов"
                value={totalStudents}
                icon="♙"
                tone="blue"
              />
              <StatCard
                label="Средний балл"
                value={averageGpa.toFixed(2)}
                icon="✦"
                tone="green"
              />
              <StatCard
                label="Самый молодой"
                value={`${youngestAge} лет`}
                icon="⌁"
                tone="amber"
              />
              <StatCard
                label="Городов"
                value={uniqueCities}
                icon="⌖"
                tone="pink"
              />
            </div>
          </section>

          <section className="catalog-section">
            <div className="catalog-heading">
              <div>
                <span className="eyebrow eyebrow--dark">Каталог</span>
                <h2>Список студентов</h2>
                <p className="catalog-heading__description">
                  Найди студента или отсортируй список по нужному параметру.
                </p>
              </div>
              <span className="result-count">
                {filteredStudents.length} из {totalStudents}
              </span>
            </div>

            <div className="toolbar">
              <label className="search-field">
                <span className="search-field__icon" aria-hidden="true">⌕</span>
                <span className="visually-hidden">Поиск студентов</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Имя, город или навык..."
                />
                {search && (
                  <button
                    className="search-field__clear"
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="Очистить поиск"
                  >
                    ×
                  </button>
                )}
              </label>

              <label className="sort-field">
                <span>Сортировка</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="name">По имени</option>
                  <option value="age">По возрасту</option>
                  <option value="course">По курсу</option>
                  <option value="gpa">По среднему баллу</option>
                </select>
              </label>
            </div>

            <StudentList students={filteredStudents} sortBy={sortBy} />
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;

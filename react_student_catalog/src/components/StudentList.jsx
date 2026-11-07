import StudentCard from './StudentCard.jsx';

const sorters = {
  name: (a, b) => a.name.localeCompare(b.name, 'ru'),
  age: (a, b) => a.age - b.age,
  course: (a, b) => a.course - b.course,
  gpa: (a, b) => b.gpa - a.gpa,
};

function StudentList({ students, sortBy = 'name' }) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">⌕</span>
        <h3>Ничего не найдено</h3>
        <p>Измени поисковый запрос — подходящие студенты появятся здесь.</p>
      </div>
    );
  }

  const sortedStudents = [...students].sort(sorters[sortBy] ?? sorters.name);

  return (
    <div className="student-grid">
      {sortedStudents.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}

export default StudentList;

import Badge from './Badge.jsx';
import SkillsList from './SkillsList.jsx';

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function StudentCard({ student }) {
  const { name, age, course, city, gpa, skills } = student;
  const fullStars = Math.max(0, Math.min(5, Math.round(gpa)));
  const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  const courseColor = course >= 3 ? '#dcfce7' : '#fff2cc';
  const courseTextColor = course >= 3 ? '#166534' : '#946200';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=e8edff&color=3949ab&size=160&bold=true`;

  return (
    <article className="student-card">
      <div className="student-card__header">
        <div className="student-card__identity">
          <div className="avatar">
            <span aria-hidden="true">{getInitials(name)}</span>
            <img
              src={avatarUrl}
              alt=""
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="student-card__name-wrap">
            <h3>{name}</h3>
            <span className="student-card__city">{city}</span>
          </div>
        </div>

        <Badge
          text={`${course} курс`}
          color={courseColor}
          textColor={courseTextColor}
        />
      </div>

      <div className="student-card__details">
        <div className="detail-item">
          <span className="detail-item__label">Возраст</span>
          <strong>{age} лет</strong>
        </div>
        <div className="detail-item">
          <span className="detail-item__label">Средний балл</span>
          <strong>{gpa.toFixed(1)} / 5.0</strong>
        </div>
      </div>

      <div className="student-card__rating" aria-label={`Оценка ${gpa} из 5`}>
        <span className="stars" aria-hidden="true">{stars}</span>
        {gpa >= 4.5 && (
          <Badge
            text="🏆 Отличник"
            color="#fef3c7"
            textColor="#92400e"
          />
        )}
      </div>

      <div className="student-card__skills">
        <span className="section-label">Навыки</span>
        <SkillsList skills={skills} />
      </div>
    </article>
  );
}

export default StudentCard;

function SkillsList({ skills }) {
  if (!skills?.length) {
    return <span className="muted">Навыки не указаны</span>;
  }

  return (
    <div className="skills-list">
      {skills.map((skill) => (
        <span className="skill-chip" key={skill}>
          {skill}
        </span>
      ))}
    </div>
  );
}

export default SkillsList;

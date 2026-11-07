function Badge({ text, color = '#e8edff', textColor = '#3949ab' }) {
  return (
    <span
      className="badge"
      style={{ backgroundColor: color, color: textColor }}
    >
      {text}
    </span>
  );
}

export default Badge;

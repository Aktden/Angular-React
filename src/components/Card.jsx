function Card({ title, children }) {
  return (
    <div style={{
      border:"2px solid #ff1100",
      borderRadius:"12px",
      padding:"20px",
      margin:"20px 0"
    }}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default Card;

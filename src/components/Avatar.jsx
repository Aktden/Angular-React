function Avatar({ name, size = 48 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border:"2px solid #00ffff",
      backgroundColor: "#ff00c8",
      borderRadius:"8px",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: size / 2,
      fontWeight: "bold"
    }}>
      {name[0]}
    </div>
  );
}

export default Avatar;

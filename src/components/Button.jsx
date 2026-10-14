function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false
}) {
  const colors = {
    primary:"#ff239c",
    secondary:"#b7c033",
    danger:"#ff00dd"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: colors[variant],
        color:"white",
        padding:"10px 20px",
        border:"none",
        borderRadius:"8px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        margin:"5px"
      }}
    >
      {children}
    </button>
  );
}

export default Button;

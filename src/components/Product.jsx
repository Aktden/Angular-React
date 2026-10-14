function Product({ title, price, discount = 0 }) {
  const finalPrice = price - (price * discount / 100);

  return (
    <div style={{border:"1px solid #00ff15", padding:"15px", borderRadius:"10px"}}>
      <h2>{title}</h2>
      <p>Цена: <b>{finalPrice} ₽</b></p>

      {discount > 0 && (
        <>
          <p>Старая цена: <s>{price} ₽</s></p>
          <p>Скидка: {discount}%</p>
        </>
      )}
    </div>
  );
}

export default Product;

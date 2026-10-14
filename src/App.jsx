import Product from "./components/Product";
import Avatar from "./components/Avatar";
import Card from "./components/Card";
import Button from "./components/Button";


function App() {

  return (
    <div>

      <h1>Практика React</h1>

      <h2>Product</h2>

      <Product
        title="Айфон"
        price={123123123}
        discount={20}
      />

      <Product
        title="Стилус"
        price={123123}
      />


      <h2>Avatar</h2>

      <div style={{
        display:"flex",
        gap:"20px"
      }}>

        <Avatar name="Денис" size={32}/>
        <Avatar name="Денис" size={48}/>
        <Avatar name="Денис" size={80}/>

      </div>


      <h2>Card</h2>

      <Card title="Информация">
        <p>Текст внутри карточки</p>
      </Card>


      <Card title="Список">

        <ul>
          <li>React</li>
          <li>JavaScript</li>
          <li>CSS</li>
        </ul>

        <button>
          Обычная кнопка
        </button>

      </Card>


      <h2>Buttons</h2>

      <Button variant="primary">
        Primary
      </Button>

      <Button variant="secondary">
        Secondary
      </Button>

      <Button variant="danger">
        Danger
      </Button>

      <Button disabled>
        Disabled
      </Button>

    </div>
  );
}


export default App;
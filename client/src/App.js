import React, { useState, useEffect, useContext } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import Card from './components/Card';
import { AppContext } from './AppProvider';
import { Link } from "react-router";
export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("useEffect");
    fetch('http://localhost:5000/user/index')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = new FormData(e.target)
      await fetch('http://localhost:5000/user/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link: payload.get('link'),
          price: payload.get('price'),
          amount: payload.get('amount'),
          size: payload.get('size')
        }),
      });

      window.location.reload();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const { user, setUser } = useContext(AppContext);
  console.log(user);
  return (
    <div className="container">
      <header>
        <h2>PriceNotifier</h2>
        <Link to="/signup">signup</Link>
        <Link to="/login">login</Link>
        <Link to="/profile">profile</Link>
      </header>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="">
          <span>Ссылка на товар</span>
          <Input
            type="text"
            name="link"
            placeholder="https://www.wildberries.ru/catalog/"
            required
          />
        </label>

        <p>Отправлять уведомление когда:</p>

        <label htmlFor="">
          <span>Стало ниже цены:</span>
          <Input
            type="text"
            name="filter_price"
            placeholder="1000"
            required
          />
        </label>

        <label htmlFor="">
          <span>В количестве:</span>
          <Input
            type="number"
            name="amount"
            placeholder="10"
            required
          />
        </label>

        <label htmlFor="">
          <span>
            Для размера(опционально):</span>
          <Input
            type="number"
            name="size"
            placeholder="40"
            required />
        </label>


        <Button type="submit">Submit</Button>
      </form>

      <div className="content">
        {data.length > 0 ? (
          data.map((item, index) => (
            <Card key={index} item={item} />
          ))
        ) : (
          <p className="text-gray-500">No data to display.</p>
        )}
      </div>
    </div>
  );
}

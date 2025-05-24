import React, { useState, useEffect } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import Card from './components/Card';

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

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        Ссылка на товар
        <Input
          type="text"
          name="link"
          placeholder="Name"
          required
        />
        <br />
        <br />
        Отправлять уведомление когда:
        <br />
        <br />
        Стало ниже цены:
        <Input
          type="text"
          name="filter_price"
          placeholder="Name"
          required
        />
        <br />
        В количестве:
        <Input
          type="text"
          name="amount"
          placeholder="Name"
          required
        />
        <br />
        Для размера(опционально):
        <Input
          type="text"
          name="size"
          placeholder="Name"
          required
        />
        <Button type="submit">Submit</Button>
      </form>

      <div className="mt-8 space-y-4">
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

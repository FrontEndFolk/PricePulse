import React, { useState, useEffect, useContext } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import Card from './components/Card';
import { AppContext } from './AppProvider';
import { Link } from 'react-router';
export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log('useEffect');
    fetch('http://localhost:5000/user/index', { credentials: 'include' })
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let payload = new FormData(e.target);
      await fetch('http://localhost:5000/user/parse', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link: payload.get('link'),
          marketplace: mp,
          filter_price: payload.get('filter_price'),
          amount: payload.get('amount'),
          size: payload.get('size'),
        }),
      });

      window.location.reload();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const [mp, setMarketplace] = useState('');

  const handleMarketplaceChange = e => {
    setMarketplace(e.target.value);
  };

  const { user } = useContext(AppContext);
  console.log(user);
  return (
    <>
      {user === null || user.user === null ? (
        <div>
          <Link to="/signup">вы не авторизованы. зарегистрируйтесь.</Link>
        </div>
      ) : (
        <div className="container">
          <header>
            <h2>PriceNotifier</h2>
            <Link className="nav_link" to="/signup">
              signup
            </Link>
            <Link className="nav_link" to="/login">
              login
            </Link>
            <Link className="nav_link" to="/profile">
              profile
            </Link>
          </header>
          <form className="form" onSubmit={e => handleSubmit(e)}>
            <label htmlFor="">
              <span>Ссылка на товар</span>
              <Input type="text" name="link" placeholder="Ссылка или артикул" required />
            </label>

            <p>Маркетплейс</p>
            <label>
              <input
                type="radio"
                name="marketplace"
                value="WB"
                checked={mp === 'WB'} // Контролируемое состояние
                onChange={handleMarketplaceChange}
              />
              WB
            </label>
            <label>
              <input
                type="radio"
                name="marketplace"
                value="OZON"
                checked={mp === 'OZON'} // Контролируемое состояние
                onChange={handleMarketplaceChange}
              />
              OZON
            </label>

            <p>Отправлять уведомление когда:</p>

            <label htmlFor="">
              <span>Стало ниже цены:</span>
              <Input type="text" name="filter_price" placeholder="1000" required />
            </label>

            <label htmlFor="">
              <span>В количестве:</span>
              <Input type="number" name="amount" placeholder="10" required />
            </label>

            {/* <label htmlFor="">
                  <span>
                    Для размера(опционально):</span>
                  <Input
                    type="number"
                    name="size"
                    placeholder="40"
                    required />
                </label> */}

            <Button type="submit">Submit</Button>
          </form>

          <div className="content">
            {data.length > 0 ? (
              data.map((item, index) => <Card key={index} item={item} />)
            ) : (
              <p className="text-gray-500">No data to display.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

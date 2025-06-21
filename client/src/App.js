import React, { useState, useEffect, useContext } from 'react';
import Card from './components/Card';
import { AppContext } from './AppProvider';
import { Link } from 'react-router';
import ProductFrom from './components/ProductForm';
export default function App() {
  const [data, setData] = useState([]);
  const { user } = useContext(AppContext);

  useEffect(() => {
    console.log('useEffect');
    fetch('http://localhost:5000/user/index', { credentials: 'include' })
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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

          <ProductFrom></ProductFrom>

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

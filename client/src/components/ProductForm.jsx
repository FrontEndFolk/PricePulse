import { useState } from 'react';
import SubmitBtn from './SubmitBtn';

export default function ProductFrom() {
  const [link, setLink] = useState('');
  const [market, setMarket] = useState('WB');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  //const [size, setSize] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch('http://localhost:5000/user/parse', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        link,
        marketplace: market,
        filter_price: price,
        amount,
      }),
    });

    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Ссылка на товар
        <input
          type="text"
          name="link"
          placeholder="Ссылка или артикул"
          required
          onChange={e => setLink(e.target.checked)}
        />
      </label>

      <p>Маркетплейс</p>

      <label>
        Wildberries
        <input
          type="radio"
          name="marketplace"
          value="WB"
          checked={market === 'WB'}
          onChange={e => setMarket(e.target.checked)}
        />
      </label>
      <label>
        OZON
        <input
          type="radio"
          name="marketplace"
          value="OZON"
          checked={market === 'OZON'}
          onChange={e => setMarket(e.target.value)}
        />
      </label>

      <p>Отправлять уведомление когда:</p>

      <label>
        Стало ниже цены:
        <input
          type="number"
          name="filter_price"
          onChange={e => setPrice(e.target.value)}
          required
        />
      </label>
      <label>
        В количестве:
        <input type="number" name="amount" onChange={e => setAmount(e.target.price)} required />
      </label>
      <SubmitBtn text={'Отправить'} pendingText={'Отправка...'}></SubmitBtn>
    </form>
  );
}

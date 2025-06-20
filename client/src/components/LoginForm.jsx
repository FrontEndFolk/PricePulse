import { useState } from 'react';
import SubmitBtn from './SubmitBtn';
import { useNavigate } from 'react-router';

export default function LoginForm({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    const data = await fetch('http://localhost:5000/user/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json());

    setMessage(data.message);

    if (data.message === 'Login successful') {
      await fetch('http://localhost:5000/user/current', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setUser(data));
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Email:
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <SubmitBtn text={'Login'} pendingText={'Logining in...'}></SubmitBtn>
      <div>{message}</div>
    </form>
  );
}

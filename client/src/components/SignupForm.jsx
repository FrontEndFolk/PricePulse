import { useState } from 'react';
import SubmitBtn from './SubmitBtn';
import { useNavigate } from 'react-router';

export default function SignupForm({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function signup(e) {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/user/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (data.message === 'Signup successful') {
      await fetch('http://localhost:5000/user/current', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setUser(data));
      navigate('/');
    }
  }

  return (
    <form onSubmit={signup}>
      <label>
        Email:
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <SubmitBtn text={'Signup'} pendingText={'Signing up...'}></SubmitBtn>
      <div>{message}</div>
    </form>
  );
}

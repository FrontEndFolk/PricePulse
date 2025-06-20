import { useContext } from 'react';
import { AppContext } from './AppProvider';
import { Link } from 'react-router';
import SignupForm from './components/SignupForm';

export default function SignUp() {
  const { setUser } = useContext(AppContext);

  return (
    <>
      <div>
        <Link to="/">на главную</Link>
      </div>
      <h2>Signup</h2>
      <SignupForm setUser={setUser}></SignupForm>
      <div>
        <Link to="/login">есть аккаунт? войти</Link>
      </div>
    </>
  );
}

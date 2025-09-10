import { useContext, Fragment } from 'react';
import { AppContext } from './AppProvider';
import { Link } from 'react-router';
import LoginForm from './components/LoginForm';

export default function Login() {
  const { setUser } = useContext(AppContext);

  return (
    <Fragment>
      <div>
        <Link to="/">на главную</Link>
      </div>
      <h2>Login</h2>
      <LoginForm setUser={setUser}></LoginForm>
      <div>
        <Link to="/signup">зарегистрироваться</Link>
      </div>
    </Fragment>
  );
}

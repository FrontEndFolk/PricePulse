import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AppContext } from "./AppProvider";

export default function Profile() {

  const [link, setLink] = useState("");
  const { user, setUser } = useContext(AppContext);

  useEffect(() => {
    fetch("http://localhost:5000/user/telegram-link", {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .then((data) => setLink(data.link))
      .catch(console.error);
  }, []);

  return (
    <div>
      <div>
        <Link to="/">на главную</Link>
      </div>
      {user === null || user.user === null ?
        (<div>
          <Link to="/signup">вы не авторизованы. зарегистрируйтесь.</Link>
        </div>)
        :
        (
          <div>
            <h2>Привязка Telegram</h2>
            <p>Нажмите на ссылку ниже или отправьте токен боту вручную:</p>
            {
              link ?
                (
                  <>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      Привязать Telegram
                    </a>
                  </>
                )
                :
                (
                  <p>Загрузка...</p>
                )
            }
          </div>)}
    </div>
  );
}
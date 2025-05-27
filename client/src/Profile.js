import { useState, useEffect } from "react";

export default function Profile() {
  const [link, setLink] = useState("");

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
      <h2>Привязка Telegram</h2>
      <p>Нажмите на ссылку ниже или отправьте токен боту вручную:</p>
      {link ? (
        <>
          <a href={link} target="_blank" rel="noopener noreferrer">
            Привязать Telegram
          </a>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
}
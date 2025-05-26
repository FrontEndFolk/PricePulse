import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from './AppProvider';


export default function LoginForm() {
    const { user, setUser } = useContext(AppContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = await fetch("http://localhost:5000/user/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        }).then(res => res.json())

        setMessage(data.message);

        if (data.message === "Login successful") {
            await fetch("http://localhost:5000/user/current", { credentials: "include" })
                .then(res => res.json())
                .then(data => setUser(data));
            navigate("/");
        }

    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)} required /><br />
            <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} required /><br />
            <button type="submit">Login</button>
            <p>{message}</p>
        </form>
    );
}
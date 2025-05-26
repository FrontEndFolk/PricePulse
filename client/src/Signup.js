import { useState, useContext } from "react";
import { AppContext } from './AppProvider';
import { useNavigate } from "react-router";


export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/user/signup", {
            method: "POST",
            credentials: "include", // Important for sending cookies
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        setMessage(data.message);

        if (data.message === "Signup successful") {
            await fetch("http://localhost:5000/user/current", { credentials: "include" })
                .then(res => res.json())
                .then(data => setUser(data));
            navigate("/");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            /><br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            /><br />
            <button type="submit">Sign Up</button>
            <p>{message}</p>
        </form>
    );
}
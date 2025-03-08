import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, setRefreshToken, setUser, isAuthenticated, isAdmin } from "../utils/auth";
import { fetchWithAuth } from "../utils/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // 📌 Eğer kullanıcı zaten giriş yaptıysa, login sayfasına erişimini engelle.
        useEffect(() => {
            if (isAuthenticated()) {
                navigate(isAdmin() ? "/admin/dashboard" : "/dashboard");
            }
        }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetchWithAuth("http://localhost:5157/api/users/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Giriş başarısız!");
            }

            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setUser(data.user); // 📌 Kullanıcı bilgilerini localStorage'a kaydedelim

            navigate(isAdmin() ? "/admin/dashboard" : "/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Giriş Yap</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleLogin} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Giriş Yap</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        margin: "10px 0",
        padding: "10px",
        fontSize: "16px",
    },
    button: {
        backgroundColor: "#007BFF",
        color: "white",
        border: "none",
        padding: "10px",
        cursor: "pointer",
        fontSize: "16px",
    },
    error: {
        color: "red",
    },
};

export default Login;

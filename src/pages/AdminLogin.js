import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5157/api/users/admin-login", {
                email,
                password
            });

            setToken(response.data.token);
            localStorage.setItem("token", response.data.token); // 📌 Token'ı kaydet
            alert("Admin girişi başarılı!");
            navigate("/admin/categories"); // 📌 Başarılı girişten sonra admin paneline yönlendir
        } catch (error) {
            alert("Admin girişi başarısız! Hatalı email veya şifre.");
        }
    };

    return (
        <div>
            <h2>Admin Girişi</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Şifre" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Giriş Yap</button>
        </div>
    );
};

export default AdminLogin;

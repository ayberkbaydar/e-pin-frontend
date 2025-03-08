import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, isAuthenticated, getUser } from "../utils/auth";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
            return;
        }

        const user = getUser();
                if (!user || !user.id) {
                    navigate("/login");
                    return;
                }

        const fetchUserData = async () => {
            try {
                const response = await fetchWithAuth("http://localhost:5157/api/users/"+user.id);
                if (!response.ok) {
                    throw new Error("Kullanıcı bilgileri alınamadı.");
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error("Hata:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return <p>Yükleniyor...</p>;
    }

    return (
        <div style={styles.container}>
            <h2>Dashboard</h2>
            {userData ? (
                <div>
                    <p>Hoş geldin, <strong>{userData.name}</strong>!</p>
                    <p>Email: {userData.email}</p>
                    <p>Rol: {userData.role}</p>
                </div>
            ) : (
                <p>Kullanıcı bilgileri bulunamadı.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        textAlign: "center",
    },
};

export default Dashboard;
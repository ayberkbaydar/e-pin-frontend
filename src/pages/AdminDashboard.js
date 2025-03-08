import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, isAdmin } from "../utils/auth";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!isAdmin()) {
            navigate("/unauthorized"); // Yetkisiz erişim varsa yönlendir
        }

        const fetchAdminData = async () => {
            try {
                const response = await fetchWithAuth("http://localhost:5157/summary");
                if (!response.ok) {
                    throw new Error("Admin bilgileri alınamadı.");
                }

                const data = await response.json();
                setAdminData(data);
            } catch (error) {
                console.error("Hata:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [navigate]);


    if (loading) {
        return <p>Yükleniyor...</p>;
    }

    return (
        <div style={styles.container}>
            <h2>Admin Paneli</h2>
            {adminData ? (
                <div>
                    <p><strong>Toplam Kullanıcı:</strong> {adminData.totalUsers}</p>
                    <p><strong>Toplam Sipariş:</strong> {adminData.totalOrders}</p>
                    <p><strong>Toplam Satış:</strong> {adminData.totalSales} TL</p>
                </div>
            ) : (
                <p>Admin verileri yüklenemedi.</p>
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

export default AdminDashboard;

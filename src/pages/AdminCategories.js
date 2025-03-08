import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";

const AdminCategories = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (getUserRole() !== "Admin") {
            navigate("/admin/login"); // 📌 Admin değilse giriş sayfasına yönlendir
        }
    }, []);

    return (
        <div>
            <h2>Kategori Yönetimi (Admin Paneli)</h2>
            {/* Kategori yönetimi içeriği burada olacak */}
        </div>
    );
};

export default AdminCategories;

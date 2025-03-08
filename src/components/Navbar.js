import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin, removeToken, removeUser } from "../utils/auth";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        removeUser();
        navigate("/login");
    };

    return (
        <nav style={styles.navbar}>
            <ul style={styles.navList}>
                {isAuthenticated() ? (
                    <>
                        <li>
                            <Link to="/dashboard" style={styles.link}>Anasayfa</Link>
                        </li>
                        {isAdmin() && (
                            <li>
                                <Link to="/admin/dashboard" style={styles.link}>Admin Paneli</Link>
                            </li>
                        )}
                        <li>
                            <button onClick={handleLogout} style={styles.logoutButton}>Çıkış Yap</button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link to="/login" style={styles.link}>Giriş Yap</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: "#333",
        padding: "10px",
    },
    navList: {
        listStyle: "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 0,
        padding: 0,
    },
    link: {
        color: "white",
        textDecoration: "none",
        padding: "10px",
    },
    logoutButton: {
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "10px 15px",
        cursor: "pointer",
    },
};

export default Navbar;

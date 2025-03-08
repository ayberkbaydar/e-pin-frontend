// 📌 auth.js - Kullanıcı yetkilendirme & JWT yönetimi

// JWT token'ı localStorage'a kaydet
export const setToken = (token) => {
    localStorage.setItem("accessToken", token);
};

// JWT token'ı localStorage'dan al
export const getToken = () => {
    return localStorage.getItem("accessToken");
};

// JWT token'ı sil (çıkış için)
export const removeToken = () => {
    localStorage.removeItem("accessToken");
};

// 📌 Refresh Token'ı localStorage'a kaydet
export const setRefreshToken = (refreshToken) => {
    localStorage.setItem("refreshToken", refreshToken);
};

// 📌 Refresh Token'ı localStorage'dan al
export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
};

// 📌 Refresh Token'ı sil (çıkış için)
export const removeRefreshToken = () => {
    localStorage.removeItem("refreshToken");
};

// Kullanıcı bilgilerini LocalStorage'da sakla
export const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};

// Kullanıcı bilgilerini LocalStorage'dan al
export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

// Kullanıcı bilgilerini sil (çıkış için)
export const removeUser = () => {
    localStorage.removeItem("user");
};

// Kullanıcının Admin olup olmadığını kontrol et
export const isAdmin = () => {
    const user = getUser();
    return user?.role === "Admin";
};

// Kullanıcı giriş yapmış mı kontrol et
export const isAuthenticated = () => {
    return !!getToken();  // Token varsa true döner
};

// Yetkisiz erişim durumunda yönlendirme yap (Opsiyonel)
export const checkAuthRedirect = (navigate) => {
    if (!isAuthenticated()) {
        navigate("/login");
    }
};


// 📌 Access Token süresi dolduğunda refresh token ile yeni token alma
export const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        removeToken();
        removeUser();
        return null; // Eğer refresh token yoksa logout yap
    }

    try {
        const response = await fetch("http://localhost:5157/api/users/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Token yenileme başarısız!");
        }

        // Yeni tokenları kaydet
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        return data.accessToken;
    } catch (error) {
        console.error("Token yenileme hatası:", error);
        removeToken();
        removeRefreshToken();
        removeUser();
        return null;
    }
};

// 📌 API isteklerinde Access Token süresi dolarsa otomatik yenileme yapan fonksiyon
export const fetchWithAuth = async (url, options = {}) => {
    let token = getToken();

    // Headers ekleme
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
    };

    // İlk isteği gönder
    let response = await fetch(url, { ...options, headers });

    // Eğer yetkisiz (401) hatası alırsak, token yenileyip tekrar deneyeceğiz
    if (response.status === 401) {
        console.warn("Access token süresi doldu, yenileniyor...");
        const newToken = await refreshAccessToken();

        if (newToken) {
            // Yeni token ile headers'ı güncelle
            headers.Authorization = `Bearer ${newToken}`;

            // İsteği tekrar yap
            response = await fetch(url, { ...options, headers });
        } else {
            console.error("Yenileme başarısız! Kullanıcı çıkış yapıyor...");
        }
    }

    return response;
};

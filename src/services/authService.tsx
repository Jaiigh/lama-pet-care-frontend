
import { environment } from "@/env/environment";

const loginURL = environment.masterUrl + "auth/login/";
const checkTokenURL = environment.masterUrl + "auth/check_token";

export interface LoginResponse {
    token: string;
    user_id: string;
    role: string;
    exp: number;
    message: string;
    status: number;
}

// Checks token validity, returns boolean
export const checkToken = async (token: string): Promise<boolean> => {
    try {
        const response = await fetch(checkTokenURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        // If backend returns a boolean, use it directly
        if (typeof data === "boolean") return data;
        // If backend returns { valid: true/false }
        if (typeof data.valid === "boolean") return data.valid;
        // Otherwise, fallback to true if status 200
        return true;
    } catch (err) {
        console.error("Error checking token:", err);
        return false;
    }
};

export const login = async (
    email: string,
    password: string,
    role: string 
): Promise<LoginResponse> => {
    try {

        const url = `${loginURL}?role=${encodeURIComponent(role)}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
            console.error("Failed to login:", response.statusText);
            throw new Error("Failed to login");
        }

        const res = await response.json();
        // Backend returns { message, data, status }
        const data = res.data;
        const loginResponse: LoginResponse = {
            token: data.token,
            user_id: data.user_id,
            role: data.role,
            exp: data.exp,
            message: res.message,
            status: res.status,
        };

        return loginResponse;
    } catch (err) {
        console.error("Error logging in:", err);
        throw err;
    }
};
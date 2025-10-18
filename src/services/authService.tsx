import { environment } from "@/env/environment";

const loginURL = environment.masterUrl + "/auth/login/";
const checkTokenURL = environment.masterUrl + "/auth/check_token";

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
            console.error("Token check failed:", response.status, response.statusText);
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

        const url = `${loginURL}${role}`;
        
        const requestBody = {
            email,
            password
        };
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
        
        
        if (!response.ok) {
            let errorMessage = `Failed to login: ${response.status} ${response.statusText}`;

            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMessage += ` - ${errorData.message}`;
                }
                console.error("Login failed with JSON response:", errorData);
            } catch (parseError) {
                // If it's not JSON, log the parsing error
                console.error("Failed to parse error response as JSON:", parseError);
            }

            throw new Error(errorMessage);
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
export const register = async (
    address: string,
    birth_date: string,
    email: string,
    name: string,
    password: string,
    telephone_number: string,
    role: string
): Promise<void> => {
    try {
        const url = `${environment.masterUrl}/auth/register/${role}`;
        birth_date = `${birth_date}T00:00:00+07:00`; // Append time and timezone
        const requestBody = {
            address,
            birth_date,
            email,
            name,
            password,
            telephone_number
        };
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
       if (!response.ok) {
        // อ่าน message จาก body ของ response
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to register:", errorData.message || response.statusText);
        throw new Error("Failed to register");
}   
    } catch (err) {
        console.error("Error registering:", err);
        throw err;
    }
};
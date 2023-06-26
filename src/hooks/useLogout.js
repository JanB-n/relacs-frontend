import axios from "../api/axios";
import useAuth from "./useAuth";

const LOGOUT_URL = "/auth/logout/";

const useLogout = () => {
    
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            const respose = await axios.post(LOGOUT_URL, 
                {
                    'refresh': JSON.parse(localStorage.getItem("refresh"))
                },
                {
                headers: {'Content-Type': 'application/json'},
                //withCredentials: true
                }
                
            );
            localStorage.removeItem("refresh");
            console.log(respose?.data)
        }
        catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout
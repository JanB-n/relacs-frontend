import axios from "../api/axios"
import useAuth from './useAuth'

const useRefreshToken = () => {
    const { auth, setAuth, persist } = useAuth();

    const refresh = async () => {
        
        const refresh = auth?.refresh ? auth.refresh : persist
        const response = await axios.post('/auth/refresh-token/',
           
            {
                // 'refresh': JSON.parse(localStorage.getItem("refresh"))
                'refresh': refresh
            }
        ,
        {
            headers: {'Content-Type': 'application/json'},
            //data: {'refresh': JSON.parse(localStorage.getItem("refresh"))}
            
            //withCredentials: true
        });
        setAuth(prev => {
            return {...prev, token: response.data.access}
        });
        return response.data.access;
    }
  return refresh;
}
export default useRefreshToken
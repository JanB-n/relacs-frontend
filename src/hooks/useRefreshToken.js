import axios from "../api/axios"
import useAuth from './useAuth'

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        console.log("useRefreshToken", auth?.token)
        // console.log("This is local storage refresh" + localStorage.getItem("refresh"));
        // console.log(localStorage.getItem("refresh"));
        //const response = await axios.post('/auth/refresh-token/', JSON.stringify({refresh: auth?.refresh}),
        //const response = await axios.post('/auth/refresh-token/', JSON.parse(localStorage.getItem("refresh")),
        const response = await axios.post('/auth/refresh-token/',
           
            {
                // 'refresh': JSON.parse(localStorage.getItem("refresh"))
                'refresh': auth?.refresh
            }
        ,
        {
            headers: {'Content-Type': 'application/json'},
            //data: {'refresh': JSON.parse(localStorage.getItem("refresh"))}
            
            //withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data);
            return {...prev, token: response.data.access}
        });
        return response.data.access;
    }
  return refresh;
}
export default useRefreshToken
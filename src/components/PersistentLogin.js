import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistentLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect( () => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch(e) {
                console.error(e);
            }
            finally {
                setIsLoading(false);
            }
        }
        !auth?.token ? verifyRefreshToken() : setIsLoading(false);
    }, [])
  return (
    <>
        {isLoading
            ? <p>Loading...</p>
            : <Outlet />
        }
    </>
  )
}
export default PersistentLogin
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import Login from "./Login";
import NavbarMenu from "./Navbar"

const PersistentLogin = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

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
        !auth?.token && persist ? verifyRefreshToken() : setIsLoading(false);
    }, [])
  return (
    <>
        {/* {!persist ?
            <Outlet /> :
                isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            
        } */}
        {!persist ?
            children :
                isLoading
                    // ? <p>Loading...</p>
                    ? <NavbarMenu/>
                    : children
        }
            
        
    </>
  )
}
export default PersistentLogin
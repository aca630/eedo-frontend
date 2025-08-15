import Cookies from "js-cookie";
import React, { Fragment, useContext, useEffect, useState } from "react";
import UserContext from "../components/UserContext";
import AuthLayout from "./Auth";
import MainLayout from "./Main";

import devToolsDetect from "devtools-detect";
import { useRouter } from "next/router";


const Layouts = {
  auth: AuthLayout,
  main: MainLayout,
};
const Layout = (props) => {
  const {
    children,
    translate,
    user,
    locale,
    countries,
    requests,
    setRequestList,
  } = props;
  // Layout Rendering
  const authorized = false;
  const getLayout = () => {
    if (authorized) {
      return "auth";
    }
    return "main";
  };
  const Container = Layouts[getLayout()];
  // const isUserAuthorized = user.authorized;
  // const isUserLoading = user.loading;
  // const isAuthLayout = getLayout() === "auth";
  const BootstrappedLayout = () => {
    const [data, setData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [country_code, setCountryCode] = useState(
      Cookies.get("country_code")
    );

    
    const [IsDevToolIsOpen, SetIsDevToolIsOpen] = useState(devToolsDetect.isOpen)
    const router = useRouter();


     useEffect(()=>{
 
 
         const handleChange = event => {
      SetIsDevToolIsOpen(event.detail.isOpen);
    };
 
    window.addEventListener('devtoolschange', handleChange);
 
    return () => {
      window.removeEventListener('devtoolschange', handleChange);
    };
 
 
     },[])
 

    //  useEffect(()=>{
    //   if(IsDevToolIsOpen){
    //        Cookies.remove('accessToken')
    //        router.push({
    //         pathname: `/`,
    //        })
      
    //   }
      
      
    //   },[IsDevToolIsOpen])



    return (
      <UserContext.Provider
        value={[isLoggedIn, setIsLoggedIn, country_code, setCountryCode]}
      >
        <Container
          user={user}
          locale={locale}
          countries={countries}
          translate={translate}
          requests={requests}
          setRequestList={setRequestList}
        >
          {children}
        </Container>
      </UserContext.Provider>
    );
  };
  return <Fragment>{BootstrappedLayout()}</Fragment>;
};
export default Layout;
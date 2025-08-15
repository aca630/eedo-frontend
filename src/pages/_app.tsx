import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { Space, Spin } from 'antd';
import LoaderComponent from './components/Loader';




export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsmounted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsmounted(true)
    }, 2000);
  }, [])
  return !isMounted ? <div style={{textAlign:'center',height:'100vh'}}>
    <Space size="large">
    <div style={{marginTop:200}}>
    <LoaderComponent/>
    </div>
    </Space>
  </div> : <Component {...pageProps} />
}

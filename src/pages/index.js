import Head from 'next/head'
import Image from 'next/image'
import { Cookie, Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Auth } from './api/auth'
import { Avatar, Button, Divider, Form, Input } from 'antd'
import { GitlabOutlined } from '@ant-design/icons'
import { login } from './api/login';


import devToolsDetect from "devtools-detect";

export default function Home() {


  const router = useRouter();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [form] = Form.useForm();
  const [IsDevToolIsOpen, SetIsDevToolIsOpen] = useState(devToolsDetect.isOpen)

  useEffect(() => {


    const handleChange = event => {
      SetIsDevToolIsOpen(event.detail.isOpen);
    };

    window.addEventListener('devtoolschange', handleChange);

    return () => {
      window.removeEventListener('devtoolschange', handleChange);
    };


  }, [])




  const handleIsAunthorized = async () => {
    let auth = await Auth();
    router.push({
      pathname: `/${auth}`,
    });
  }

  const onFinish = async (values) => {
    console.log(values, 'values');
    try {
      const res = await login(values);

      Cookies.set("accessToken", res.data?.data.token);
      Cookies.set("id", res.data?.data.id);
      Cookies.set("username", res.data?.data.name);

      toast.success('Login success', {
        position: "top-center",
      })


      setTimeout(() => {
        router.push({
          pathname: "/dashboard",
        });
      }, 1500);


    }
    catch (error) {
      console.log(error);
      toast.error('Login failed', {
        position: "top-center",
      })
    }


  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  useEffect(() => {

    // handleIsAunthorized();
  }, [])


  return (

    < >

      <div className='relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0'>

        <div className='relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0'>

          <div className='flex flex-col flex-1 lg:w-1/2 w-full'>
            <div className='w-full max-w-md sm:pt-10 mx-auto mb-5'>
              <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
                <div className=' items-center MyBorder'>

                  <div className='bg-purple-600 mb-2'>
                    <div className='flex justify-center'>
                      <Image src={'/logo.jpg'} width={200}
                        height={200} className=" rounded-full mt-10 mb-" alt="logo" />
                    </div>
                    <div className='text-center p-2'>
                      <h1 className='text-center text-white font-semibold'>
                        Economic Enterprise Division`s Office
                      </h1>
                      <p className='text-white  mt-2'>Admin Panel</p>
                      <br />
                    </div>
                  </div>


                  <h1 className="text-center mb-2 font-semibold text-gray-3000 text-title-sm dark:text-white/90 sm:text-title-md">
                    Sign In
                  </h1>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Enter your username and password to sign in!
                  </p>

                  <Form
                    // form={form}
                    name='basic'
                    labelCol={{
                      span: 8
                    }}
                    wrapperCol={{
                      span: 24
                    }}
                    // style={{
                    //   maxWidth: 400
                    // }}
                    initialValues={{
                      remember: true
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete='off'
                    className='p-2'
                  >
                    <Form.Item
                      label=''
                      name='username'
                      rules={[
                        {
                          required: true,
                          message: 'Please input your username!'
                        }
                      ]}
                    >
                      <Input placeholder='Username' className='w-full' size='large' />
                    </Form.Item>

                    <Form.Item
                      name='password'
                      rules={[
                        {
                          required: true,
                          message: 'Please input password!'
                        }
                      ]}
                    >
                      <Input.Password
                        placeholder='Password'
                        className='w-full'
                        size='large'
                      />
                    </Form.Item>

                    <Form.Item
                      wrapperCol={{
                        span: 24
                      }}
                    >
                      <Button
                        size='large'
                        className='w-full bg-purple-600 text-white'
                        htmlType='submit'
                      // disabled={IsDevToolIsOpen}
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </Form>

                </div>

              </div>

            </div>

          </div>


          <div style={{
            backgroundImage: "url('/bg_1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }} className='lg:w-1/2 w-full h-full dark:bg-white/5 lg:grid items-center hidden'>

          </div>
        </div>

      </div>


      <ToastContainer />
    </>
  )
}

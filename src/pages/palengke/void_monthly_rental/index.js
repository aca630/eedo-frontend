import { BookOutlined, BuildOutlined, CalendarOutlined, CarOutlined, CarTwoTone, DeleteOutlined, DownOutlined, EditOutlined, GroupOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined, ShopOutlined, ShoppingCartOutlined, ShopTwoTone, SnippetsOutlined, UserAddOutlined, UserDeleteOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Form, Input, Menu, Modal, Popconfirm, Select, Space, Spin, Table, Tag } from "antd";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../layouts";
import { ToastContainer, toast } from 'react-toastify';
import moment from "moment";
import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dynamic from "next/dynamic";
import Link from "next/link";
import { deleteArea, GetArea, postArea, putArea } from "../../api/area";
import { GetVoid_monthly_rental, VoidMonthlyPayment } from "../../api/void_monthly_payment";

// Dynamically import only on client
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

dayjs.extend(customParseFormat);

export default function Home() {
    const [isfetching, Setisfetching] = useState(false);
    const [data, setData] = useState([])
    const [openAdd, setOpenAdd] = useState(false);
    const [confirmLoadingAdd, setConfirmLoadingAdd] = useState(false);
    const [form] = Form.useForm();
    const [confirmLoadingEdit, setConfirmLoadingEdit] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [CurrentRow, setCurrentRow] = useState(null);
    const [formEdit] = Form.useForm();

    const handleCancelAdd = () => {
        setOpenAdd(false);
    }
    const showModalAdd = () => {
        setOpenAdd(true);
    };




    const handleGetData = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetVoid_monthly_rental()

            setData(ApiResponse?.data?.data)
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
    }




    const onFinish = async (values) => {
        try {


            let ApiResponse = await GetVoid_monthly_rental({ ...values })

            if (ApiResponse?.data?.data?.length == 0) {

                toast.error('No Record Found', {
                    position: "top-center",
                })
            }

            setData(ApiResponse?.data?.data)
        }
        catch (error) {

            toast.error('Saving Failed!', {
                position: "top-center",
            })


        }

        Setisfetching(false)

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onFinishFailedEdit = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    //EDIT
    const onFinishEdit = async (values) => {
        try {
            let ApiResponse = await putArea({
                ...values, id: CurrentRow?.id
            })
            toast.success('Record updated.', {
                position: "top-center",
            })
            formEdit.resetFields();
            setShowModalEdit(false);
            handleGetData();
        }
        catch (error) {
            if (error?.response?.status == 401) {

                toast.error('UnAuthenticated.', {
                    position: "top-center",
                })
                Cookies.remove('accessToken');
                setTimeout(() => {
                    router.push('/')
                }, 2000);
            } else {
                toast.error('Operation error.', {
                    position: "top-center",
                })
            }
            console.log('Get Coordinator Error: ', error?.response);

        }



    };

    const handleCloseModalEdit = () => {
        setShowModalEdit(false);
    }

    const chartData = {

        series: [
            {
                name: "Collections",
                data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
            },
        ],
        options: {
            plotOptions: {
                bar: {
                    distributed: true, // enable per-bar colors
                },
            },
            colors: ["#3B82F6", "#F97316", "#10B981", "#EF4444", "#8B5CF6"],
            chart: {
                type: "bar",
                height: 350,
            },
            stroke: {
                curve: "smooth",
            },
            xaxis: {
                categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
            },
            title: {
                text: "Monthly Collections",
                align: "left",
            },
        },
    };


    const columns = [

        {
            title: 'Stall number',
            dataIndex: 'stall_no',
            key: 'stall_no',
            width: 150,
            render: (dom, entity) => {
                return dom

            }
        },
        {
            title: 'OR number',
            dataIndex: 'or_number',
            key: 'or_number',
            width: 150,
            render: (dom, entity) => {
                return dom

            }
        },
        {
            title: 'Paid for month of',
            dataIndex: 'paid_date',
            key: 'paid_date',
            width: 200,
            render: (dom, entity) => {
                return dom

            }
        },
        {
            title: 'Is voided?',
            dataIndex: 'is_void',
            key: 'is_void',
            width: 200,
            render: (dom, entity) => {
                return dom == 0 ? <Tag color="green">No</Tag> : <Tag color="red">Yes</Tag>

            }
        },
        {
            title: `Void`,
            dataIndex: 'name',
            valueType: 'option',
            fixed: 'right',

            render: (_, record) => (
     
              
                    <Button danger onClick={(()=>{

                        confirmVoid(record.id)
                    })}>Void</Button>
         
            )
        },


    ];


    const confirmVoid = async (id) => {
        try {
            let ApiResponse = await VoidMonthlyPayment({
                is_void:1, id:id
            })
            toast.success('Payment voided.', {
                position: "top-center",
            })

        }
        catch (error) {
            if (error?.response?.status == 401) {

                toast.error('UnAuthenticated.', {
                    position: "top-center",
                })
                Cookies.remove('accessToken');
                setTimeout(() => {
                    router.push('/')
                }, 2000);
            } else {
                toast.error('Operation error.', {
                    position: "top-center",
                })
            }
            console.log('Get Coordinator Error: ', error?.response);

        } 
    }


    //ACTIONS TABLE
    const items = [

        {
            key: 'edit',
            label: `Edit`,
            onClick: async (record) => {
                formEdit.setFieldsValue({
                    name: record.name,
                })
                setCurrentRow(record)
                setShowModalEdit(true)
            },

            visible: true,
        },

        {
            key: 'delete',
            label: `Delete`,
            onClick: (record) => {
                // handleRemove(record.id);
                actionRef.current?.reloadAndRest?.();
            },
            visible: true,
            popconfirmTitle: `Are you sure?`,
        },

    ];



    return (


        <Layout>
            <Head>
                <title>EEDO</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {

                !isfetching ?
                    <>

                        <div>
                            <h1 className="text-center text-purple-600">Void Monthly Payment</h1>


                            <div className="mt-10">

                                <Form
                                    form={form}
                                    name="basic"
                                    labelCol={{
                                        span: 6,
                                    }}
                                    wrapperCol={{
                                        span: 24,
                                    }}
                                    // style={{
                                    //     maxWidth: 400,
                                    // }}
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                >

                                    <Form.Item
                                        label=""
                                        name="stall_no"

                                        rules={[
                                            {
                                                required: true,
                                                message: 'Field required',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Stall number" onInput={e => e.target.value = e.target.value.toUpperCase()} />

                                    </Form.Item>

                                    <Form.Item
                                        label=""
                                        name="or_number"

                                        rules={[
                                            {
                                                required: true,
                                                message: 'Field required',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="OR number" onInput={e => e.target.value = e.target.value.toUpperCase()} />

                                    </Form.Item>

                                    <Form.Item
                                        wrapperCol={{
                                            span: 24,
                                        }}

                                    >
                                        <Button style={{
                                            width: '100%',
                                        }} type="primary" htmlType="submit">
                                            Search
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>



                            <Table dataSource={data} columns={columns} loading={isfetching} scroll={{
                                x: 800,
                            }} />

                        </div>


                    </>
                    : <div className="h-screen text-center noPrint">
                        <Spin size="large" tip='Generating...' className="mt-20" />
                    </div>
            }













            <ToastContainer />
        </Layout>


    )

}
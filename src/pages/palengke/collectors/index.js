import { PlusOutlined } from "@ant-design/icons";
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
import { deleteCollector, GetCollector, postCollector, putCollector } from "../../api/collector";


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

            let ApiResponse = await GetCollector()

            setData(ApiResponse?.data?.data)
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
    }




    const onFinish = async (values) => {
        try {

            let ApiResponse = await postCollector({ ...values, password: 'collector123' })
            Setisfetching(true)
            toast.success('Data saved!', {
                position: "top-center",
            })
            handleGetData();
            form.resetFields();
            setOpenAdd(false);
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


    //DELETE
    const handleDelete = async (record) => {
        try {

            let ApiResponse = await deleteCollector(record?.id)
            toast.success('Record deleted!', {
                position: "top-center",
            })
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


    //EDIT
    const onFinishEdit = async (values) => {
        try {
            let ApiResponse = await putCollector({
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
            title: 'Collector  Name',
            dataIndex: 'full_name',
            key: 'full_name',
            render: (dom, entity) => {
                return dom

            }
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            render: (dom, entity) => {
                return dom

            }
        },
        {
            title: `Actions`,
            dataIndex: 'name',
            valueType: 'option',
            fixed: 'right',
            width: 180,
            render: (_, record) => (
                <Dropdown.Button
                    overlay={
                        <Menu>
                            {items.map((item) => {
                                return (
                                    <Menu.Item key={item.key}>
                                        {item.popconfirmTitle ? (
                                            <Popconfirm
                                                title={item.popconfirmTitle}
                                                onConfirm={() => handleDelete(record)}
                                                okText={`Yes`}
                                                cancelText={`No`}
                                            >
                                                <a>{item.label}</a>
                                            </Popconfirm>
                                        ) : (
                                            <a onClick={() => item.onClick(record)}>{item.label}</a>
                                        )}
                                    </Menu.Item>
                                );
                            })}
                        </Menu>

                    }
                >
                    Actions
                </Dropdown.Button>
            )
        },


    ];


    //ACTIONS TABLE
    const items = [

        {
            key: 'edit',
            label: `Edit`,
            onClick: async (record) => {
                formEdit.setFieldsValue({
                    full_name: record.full_name,
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



    useEffect(() => {
        handleGetData();
    }, []);

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
                            <h1 className="text-center text-purple-600">Collectors</h1>

                            <Button
                                onClick={showModalAdd}
                                type="primary"
                                style={{
                                    marginBottom: 16,
                                }}
                                icon={<PlusOutlined />}
                            >
                                New
                            </Button>




                            <Table dataSource={data} columns={columns} loading={isfetching} scroll={{
                                x: 800,
                            }} />

                        </div>


                    </>
                    : <div className="h-screen text-center noPrint">
                        <Spin size="large" tip='Generating...' className="mt-20" />
                    </div>
            }




            <Modal
                title="New Collector"
                open={openAdd}
                confirmLoading={confirmLoadingAdd}
                onCancel={handleCancelAdd}

                width={800}
                footer={[]}
            >


                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
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
                        label="Full name"
                        name="full_name"

                        rules={[
                            {
                                required: true,
                                message: 'Field required',
                            },
                        ]}
                    >
                        <Input onInput={e => e.target.value = e.target.value.toUpperCase()} />

                    </Form.Item>


                    <Form.Item
                        label="Username"
                        name="username"

                        rules={[
                            {
                                required: true,
                                message: 'Field required',
                            },
                        ]}
                    >
                        <Input  />

                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            span: 24,
                        }}

                    >
                        <Button style={{
                            width: '100%',
                        }} type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>



            </Modal>





            {
                showModalEdit ?
                    <>     <Modal
                        title="Edit Collector"
                        open={showModalEdit}
                        // confirmLoading={confirmLoadingAdd}
                        onCancel={handleCloseModalEdit}

                        width={800}
                        footer={[]}
                    >


                        <Form
                            form={formEdit}
                            name="basic"
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 18,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinishEdit}
                            onFinishFailed={onFinishFailedEdit}
                            autoComplete="off"
                        >


                            <Form.Item
                                label="Collector Name"
                                name="full_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'name required!',
                                    },
                                ]}
                            >
                                <Input size='large' style={{
                                    width: '100%',
                                }} defaultValue={CurrentRow && CurrentRow?.full_name} />
                            </Form.Item>



                            <Divider />
                            <Form.Item
                                wrapperCol={{
                                    span: 24,
                                }}

                            >
                                <Button type="primary" style={{
                                    width: '100%',
                                }} size='large' htmlType="submit">
                                    Update
                                </Button>
                            </Form.Item>
                        </Form>



                    </Modal></> : ''
            }




            <ToastContainer />
        </Layout>


    )

}
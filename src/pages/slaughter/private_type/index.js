import { BookOutlined, BuildOutlined, CalendarOutlined, CarOutlined, CarTwoTone, DeleteOutlined, DownOutlined, EditOutlined, GroupOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined, ShopOutlined, ShoppingCartOutlined, ShopTwoTone, SnippetsOutlined, UserAddOutlined, UserDeleteOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import {   Button, 
  Divider, 
  Dropdown, 
  Form, 
  Input, 
  Menu, 
  Modal, 
  Popconfirm, 
  Select, 
  Space, 
  Spin, 
  Table, 
  Tag, 
  Row, 
  Col, 
  Card } from "antd";
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
import { deleteSLPrivate, GetSLPrivate, postSLPrivate, putSLPrivate } from "../../api/slprivate"; //tatawagin ang mga function sa api folder na livestock

// Dynamically import only on client
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

dayjs.extend(customParseFormat);

export default function Home() {
    const [isfetching, Setisfetching] = useState(false);
    const [data, setData] = useState([])

        // 👉 New: state para sa dropdown ng Livestock
    const [livestockOptions, setLivestockOptions] = useState([]);

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



//ang function na to ay para kunin ang data sa database table na livestock
    const handleGetData = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetSLPrivate()

            setData(ApiResponse?.data?.data)
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
    }



//ang function na to ay para magpost ng data sa database table na livestock
//ang ibig sabihin ng postLivestock({ ...values }) ay kukunin nya lahat ng laman ng form pagka submit
    const onFinish = async (values) => {
        try {

            let ApiResponse = await postSLPrivate({ ...values })
            Setisfetching(true)
            toast.success('Transactions saved!', {
                position: "top-center",
            })
            handleGetData();
            form.resetFields();
            setOpenAdd(false);
        }
        catch (error) {

            toast.error('Saving Transactions Failed!', {
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


// DELETE
const handleDelete = async (record) => {
  try {
    await deleteSLPrivate(record?.id);
    toast.success('Record deleted!', { position: "top-center" });
    handleGetData();
  } catch (error) {
    toast.error('Delete failed.', { position: "top-center" });
    console.log(error);
  }
};

// EDIT
const onFinishEdit = async (values) => {
  try {
    await putSLPrivate({ ...values, id: CurrentRow?.id });
    toast.success('Record updated!', { position: "top-center" });
    formEdit.resetFields();
    setShowModalEdit(false);
    handleGetData();
  } catch (error) {
    toast.error('Update failed.', { position: "top-center" });
    console.log(error);
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
            title: 'Livestock  Type',
            dataIndex: 'name',
            key: 'name',
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
                            <h1 className="text-center text-purple-600">Private Transactions Entry</h1>

                        </div>

            <Row gutter={16} className="py-8">
            <Col xs={24} lg={8}>
                <Card title="Inputs" bordered={false} className="shadow">
                <Form
                    form={form}
                    name="slaughterForm"
                    labelCol={{ span: 8 }}  // mas tight spacing ng labels
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                <Form.Item
                label="Date"
                name="date"
                initialValue={moment().format("YYYY-MM-DD")} // ✅ recommended
                rules={[{ required: true, message: 'Please select date!' }]}
                >
                <Input type="date" size="large" />
                </Form.Item>

                    {/* OR */}
                    <Form.Item
                    label="OR #"
                    name="or_no"
                    rules={[{ required: true, message: 'Please enter OR number!' }]}
                    >
                    <Input placeholder="Enter OR Number" size="large" />
                    </Form.Item>

                    {/* Agency */}
                    <Form.Item
                    label="Agency"
                    name="agency"
                    rules={[{ required: true, message: 'Please enter Agency!' }]}
                    >
                    <Input placeholder="Enter Agency Name" size="large" />
                    </Form.Item>

                    {/* Owner */}
                    <Form.Item
                    label="Owner"
                    name="owner"
                    rules={[{ required: true, message: 'Please enter Owner!' }]}
                    >
                    <Input placeholder="Enter Owner Name" size="large" />
                    </Form.Item>

                    {/* --- Livestock Section --- */}
                    <Divider orientation="left">Type of Livestock</Divider>

                    <Form.Item
                    label="Number of Heads (Small)"
                    name="small_heads"
                    initialValue={0}
                    >
                    <Input type="number" min={0} size="large" />
                    </Form.Item>

                    <Form.Item
                    label="Number of Heads  (Large)"
                    name="large_heads"
                    initialValue={0}
                    >
                    <Input type="number" min={0} size="large" />
                    </Form.Item>

                    <Divider />

                    {/* Submit */}
                    <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="primary" size="large" style={{ width: '100%' }} htmlType="submit">
                        Submit
                    </Button>
                    </Form.Item>
                </Form>
                </Card>
            </Col>
            <Col xs={24} lg={16}>
                <Card title="Saved Transactions" bordered={false} className="shadow">
                <Table
                    dataSource={data}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    columns={[
                    {
                        title: '#',
                        render: (_, __, index) => `${index + 1}.`,
                        align: 'right',
                    },
                    {
                        title: 'Date',
                        dataIndex: 'date',
                        key: 'date',
                    },
                    {
                        title: 'OR #',
                        dataIndex: 'or_no',
                        key: 'or_no',
                    },
                    {
                        title: 'Agency',
                        dataIndex: 'agency',
                        key: 'agency',
                        render: (text) => text ? text.toUpperCase() : '',
                    },
                    {
                        title: 'Owner',
                        dataIndex: 'owner',
                        key: 'owner',
                        render: (text) => text ? text.toUpperCase() : '',
                    },
                    {
                        title: 'Small Heads',
                        dataIndex: 'small_heads',
                        key: 'small_heads',
                        align: 'center',
                    },
                    {
                        title: 'Large Heads',
                        dataIndex: 'large_heads',
                        key: 'large_heads',
                        align: 'center',
                    },
                    {
                    title: 'Actions',
                    key: 'actions',
                    render: (_, record) => (
                        <Dropdown.Button
                        overlay={
                            <Menu>
                            {items.map((item) => (
                                <Menu.Item key={item.key}>
                                {item.popconfirmTitle ? (
                                    <Popconfirm
                                    title={item.popconfirmTitle}
                                    onConfirm={() => handleDelete(record)}
                                    okText="Yes"
                                    cancelText="No"
                                    >
                                    <a>{item.label}</a>
                                    </Popconfirm>
                                ) : (
                                    <a onClick={() => item.onClick(record)}>{item.label}</a>
                                )}
                                </Menu.Item>
                            ))}
                            </Menu>
                        }
                        >
                        Actions
                        </Dropdown.Button>
                    ),
                    }

                    ]}
                />
                </Card>
            </Col>
            </Row>


                    </>
                    : <div className="h-screen text-center noPrint">
                        <Spin size="large" tip='Generating...' className="mt-20" />
                    </div>
            }





            <ToastContainer />

            {/* EDIT MODAL */}
            <Modal
            title="Edit Transaction"
            open={showModalEdit}
            confirmLoading={confirmLoadingEdit}
            onCancel={handleCloseModalEdit}
            footer={null}
            width={700}
            >
            <Form
                form={formEdit}
                layout="vertical"
                onFinish={onFinishEdit}
                onFinishFailed={onFinishFailedEdit}
                initialValues={CurrentRow}
            >
                <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select date!" }]}
                >
                <Input type="date" />
                </Form.Item>

                <Form.Item
                label="OR #"
                name="or_no"
                rules={[{ required: true, message: "Please input OR number!" }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Agency"
                name="agency"
                rules={[{ required: true, message: "Please input agency!" }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Owner"
                name="owner"
                rules={[{ required: true, message: "Please input owner!" }]}
                >
                <Input />
                </Form.Item>

                <Form.Item label="Number of Heads (Small)" name="small_heads">
                <Input type="number" min={0} />
                </Form.Item>

                <Form.Item label="Number of Heads (Large)" name="large_heads">
                <Input type="number" min={0} />
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                    Update
                </Button>
                </Form.Item>
            </Form>
            </Modal>

        </Layout>


    )

}
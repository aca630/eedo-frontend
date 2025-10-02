import { BookOutlined, BuildOutlined, CalendarOutlined, CarOutlined, CarTwoTone, DeleteOutlined, DownOutlined, EditOutlined, ExclamationCircleOutlined, GroupOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined, ShopOutlined, ShoppingCartOutlined, ShopTwoTone, SnippetsOutlined, UserAddOutlined, UserDeleteOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Form, Input, Menu, Modal, Popconfirm, Select, Space, Spin, Table, Tag } from "antd";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
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
import { GetCollector } from "../../api/collector";
import { GetCashTicketsTransactions, putDispenseCashTicket } from "../../api/dispense_cash_tickets";

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
    const [collectorData, setcollectorData] = useState([])
    const [collector_id, set_collector_id] = useState(null);
    const [from, setFrom] = useState(moment().format('yyyy-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('yyyy-MM-DD'))
    const handleCancelAdd = () => {
        setOpenAdd(false);
    }
    const showModalAdd = () => {
        setOpenAdd(true);
    };




    const handleGetData = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetCashTicketsTransactions(
                {
                    from: from,
                    to: to,
                    id: collector_id
                }
            )

            setData(ApiResponse?.data?.data)
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
    }



    const handleGetCollector = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetCollector()

            setcollectorData(ApiResponse?.data?.data)
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
            title: 'Amount',
            dataIndex: 'cash_ticket_price',
            key: 'cash_ticket_price',
            width: 150,
            render: (dom, entity) => {
                return dom?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

            }
        },
        {
            title: 'Dispense date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (dom, entity) => {
                return moment(dom).format('MMMM DD, YYYY - hh:mm A')

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
            width: 150,
            fixed: 'right',

            render: (_, record) => (

                <Popconfirm
                    title="Are you sure to void this entry?"
                    onConfirm={() => {
                        confirmVoid(record?.id)
                    }}
                    okText="Yes"
                    cancelText="No"
                    disabled={record?.is_void == 1 ? true : false}
                >
                    <Button type="primary" danger disabled={record?.is_void == 1 ? true : false} icon={<ExclamationCircleOutlined />} > Void</Button>

                </Popconfirm>


            )
        },


    ];


    const confirmVoid = async (id) => {
        try {
            let ApiResponse = await putDispenseCashTicket({
                is_void: 1, id: id
            })
            toast.success('Payment voided.', {
                position: "top-center",
            })
            set_collector_id(null)
            setData([])
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


    useEffect(() => {
        handleGetCollector();
    }, [])



    return (


        <Layout>
            <Head>
                <title>EEDO</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

        
                    <>

                        <div>
                            <h1 className="text-center text-purple-600">Void Cash Ticket</h1>


                            <div className="mt-10">

                                <Space.Compact style={{ width: '100%' }}>
                                    <Select showSearch size='large' name="collector_id" onChange={(e) => {
                                        set_collector_id(collectorData?.filter((item) => {
                                            if (e == item?.id) {
                                                return item?.id
                                            }
                                        })?.[0]?.id)
                                    }} style={{
                                        width: '90%',
                                    }} >
                                        {
                                            collectorData?.map((item, key) => {

                                                return (
                                                    <Select.Option key={key} value={item?.id}>{`${item?.full_name}`}</Select.Option>
                                                )
                                            })
                                        }
                                    </Select>
                                    <Button style={{
                                        width: '10%',
                                    }} type="primary" onClick={handleGetData}>Search</Button>
                                </Space.Compact>


                            </div>



                            <Table dataSource={data} columns={columns} loading={isfetching} scroll={{
                                x: 800,
                            }} />


                        </div>


                    </>
                  













            <ToastContainer />
        </Layout>


    )

}
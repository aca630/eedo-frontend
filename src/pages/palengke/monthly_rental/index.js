import { BookOutlined, BuildOutlined, CalendarOutlined, CarOutlined, CarTwoTone, DeleteOutlined, DownOutlined, EditOutlined, GroupOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined, ShopOutlined, ShoppingCartOutlined, ShopTwoTone, SnippetsOutlined, UserAddOutlined, UserDeleteOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { Button, DatePicker, Divider, Dropdown, Form, Input, Menu, Modal, Popconfirm, Select, Space, Spin, Table, Tag } from "antd";
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
import { GetOverAllDispenseCashTickets, GetOverAllDispenseCashTicketsPerCollector, GetOverAllDispenseCashTicketsPerName, GetOverAllMonthlyPayment, GetOverAllMonthlyPaymentPerArea, GetOverAllMonthlyPaymentPerCollector } from "../../api/reports";

// Dynamically import only on client
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

dayjs.extend(customParseFormat);

export default function Home() {
    const [isfetching, Setisfetching] = useState(false);
    const [data, setData] = useState([])
    const [data_per_name, set_data_per_name] = useState([])
    const [data_per_collector, set_data_per_collector] = useState([])
    const [openAdd, setOpenAdd] = useState(false);

    const [confirmLoadingAdd, setConfirmLoadingAdd] = useState(false);
    const [form] = Form.useForm();
    const [confirmLoadingEdit, setConfirmLoadingEdit] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [CurrentRow, setCurrentRow] = useState(null);
    const [formEdit] = Form.useForm();
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

            let ApiResponse = await GetOverAllMonthlyPayment({
                from: from,
                to: to
            })

            setData(ApiResponse?.data?.data[0])
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
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


    const columns_per_name = [

        {
            title: 'Name',
            dataIndex: 'area_name',
            key: 'area_name',
            render: (dom, entity) => {
                return dom

            }
        },

        {
            title: 'Total Monthly Payment',
            dataIndex: 'total_monthly_payment',
            key: 'name',
            render: (dom, entity) => {
                return `₱${dom}`

            }
        },



    ];


    const columns_per_collector = [

        {
            title: 'Collector Name',
            dataIndex: 'full_name',
            key: 'full_name',
            render: (dom, entity) => {
                return dom

            }
        },

        {
            title: 'Total Monthly Payment',
            dataIndex: 'total_monthly_payment',
            key: 'name',
            render: (dom, entity) => {
                return `₱${dom}`

            }
        },



    ];



    const handleGethandleGetOverAllMonthlyPAymenyPerCollector = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetOverAllMonthlyPaymentPerCollector({
                from: from,
                to: to
            })

            set_data_per_collector(ApiResponse?.data?.data)
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
    }



    const handleGetOverAllMonthlyPAymenyPerArea = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetOverAllMonthlyPaymentPerArea({
                from: from,
                to: to
            })

            set_data_per_name(ApiResponse?.data?.data)
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
    }


    const onChange = (date, dateString) => {
        console.log(dateString);

        setFrom(dateString)
        setTo(moment(dateString).add(1, 'days').format('yyyy-MM-DD'))
    };


    useEffect(() => {

        handleGetData();
        handleGetOverAllMonthlyPAymenyPerArea()
        handleGethandleGetOverAllMonthlyPAymenyPerCollector()

    }, [from, to])

    useEffect(() => {
        handleGetData();
        handleGetOverAllMonthlyPAymenyPerArea()
        handleGethandleGetOverAllMonthlyPAymenyPerCollector()
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
                            <h1 className="text-center text-purple-600">Monthly rental monitoring</h1>

                            <div className="text-center">
                                <Space><Button className="text-md"><CalendarOutlined />Date </Button> <DatePicker size={'large'} onChange={onChange} defaultValue={dayjs(from, 'YYYY-MM-DD')} /></Space>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">

                                <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded-xl dark:bg-gray-800">

                                    <SnippetsOutlined className=" text-4xl text-purple-600" />
                                </div>


                                <div>
                                    <p className="text-4xl font-bold text-purple-600">₱{data?.total_monthly_payment ?? 0}</p>
                                    <p className="text-2xl font-bold text-purple-600">Overall monthly rental</p>
                                    <h3>as of {from}</h3>
                                </div>
                            </div>






                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">

                                <div className="p-2 bg-white rounded-lg shadow mt-2">
                                    <h3 className="text-xl text-purple-500">Per Area/Building</h3>
                                    <Table dataSource={data_per_name} columns={columns_per_name} loading={isfetching} scroll={{
                                        x: 800,
                                    }} />
                                </div>

                                <div className="p-2 bg-white rounded-lg shadow mt-2">
                                    <h3 className="text-xl text-purple-500">Per collector</h3>
                                    <Table dataSource={data_per_collector} columns={columns_per_collector} loading={isfetching} scroll={{
                                        x: 800,
                                    }} />
                                </div>



                            </div>


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
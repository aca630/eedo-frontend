import { BookOutlined, BuildOutlined, CalendarOutlined, CarOutlined, CarTwoTone, DeleteOutlined, DownOutlined, EditOutlined, GroupOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined, ShopOutlined, ShoppingCartOutlined, ShopTwoTone, SnippetsOutlined, UserAddOutlined, UserDeleteOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { Button, DatePicker, Divider, Dropdown, Form, Input, Menu, Modal, Popconfirm, Select, Space, Spin, Table, Tag } from "antd";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../layouts";
import { ToastContainer, toast } from 'react-toastify';
import moment from "moment";
import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dynamic from "next/dynamic";
import Link from "next/link";
import { deleteArea, GetArea, postArea, putArea } from "../../../api/area";
import { GetMonthlyRentalReports, GetMonthlyRentalReportsChecker, GetOverAllDispenseCashTickets, GetOverAllDispenseCashTicketsPerCollector, GetOverAllDispenseCashTicketsPerName, GetOverAllMonthlyPayment, GetOverAllMonthlyPaymentPerArea, GetOverAllMonthlyPaymentPerCollector } from "../../../api/reports";

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
    const [to, setTo] = useState(moment().add(1, 'month').format('YYYY-MM-DD'))
    const [stall_no, set_stall_no] = useState(null);

    const handleCancelAdd = () => {
        setOpenAdd(false);
    }
    const showModalAdd = () => {
        setOpenAdd(true);
    };




    const handleGetData = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetMonthlyRentalReportsChecker({
                from: moment(from).format('YYYY-MM-DD'),
                to: moment(to).endOf('month').format('YYYY-MM-DD'),
                stall_no: stall_no
            })

            setData(ApiResponse?.data?.data)
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


    const onChangeFrom = (date, dateString) => {
        console.log(dateString);

        setFrom(dateString)
        // setTo(moment(dateString).add(1, 'days').format('yyyy-MM'))
    };

    const onChangeTo = (date, dateString) => {
        console.log(dateString);

        setTo(dateString)
        // setTo(moment(dateString).add(1, 'days').format('yyyy-MM'))
    };


    function displayPaymentHistory() {

        const result = [];
        let current = new Date(from);
        const end = new Date(to);

        // normalize to first day of month
        current.setDate(1);
        end.setDate(1);

        while (current <= end) {


            result.push(
                <>
                    <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mt-5 border-b-2 border-black mb-2">

                        <p className="text-left">{`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`}</p>

                        {
                            data?.map((item, index) => {
                                console.log(moment(item?.paid_date).format('yyyy-MM'), `--`, `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
                                if (moment(item?.paid_date).format('yyyy-MM') == `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`) {
                                    return (
                                        <>
                                            <p className="text-left">{item?.or_number}</p>
                                            <p className="text-left">{item?.paid_date}</p>
                                            <p className="text-left text-green-500">PAID</p>
                                        </>
                                    )
                                }
                                else {
                                    return (
                                        <>
                                            <p className="text-left">---</p>
                                            <p className="text-left">---</p>
                                            <p className="text-left text-red-500">UNPAID</p>
                                        </>
                                    )
                                }
                            })
                        }

                    </div>
                </>
                // `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
            );

            // move to next month
            current.setMonth(current.getMonth() + 1);
        }


        return (
            result
        )

    }


    function displayBalance() {

        const result = [];
        let current = new Date(from);
        const end = new Date(to);

        // normalize to first day of month
        current.setDate(1);
        end.setDate(1);
        let balanace = 0
        while (current <= end) {


            {
                data?.map((item, index) => {
                    console.log(moment(item?.paid_date).format('yyyy-MM'), `--`, `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
                    if (moment(item?.paid_date).format('yyyy-MM') == `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`) {

                    }
                    else {
                        balanace += parseFloat(data?.[0]?.rent_per_month)
                    }
                })
            }
            // move to next month
            current.setMonth(current.getMonth() + 1);
        }


        return balanace?.toLocaleString(undefined, { minimumFractionDigits: 2   })


    }



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
                            <div className="text-center">
                                <Space><Input onChange={((e) => {
                                    set_stall_no(e.target.value)
                                })} placeholder="Stall No." size={'large'} /> <DatePicker picker="month" size={'large'} onChange={onChangeFrom} defaultValue={dayjs(from, 'YYYY-MM')} /> <DatePicker picker="month" size={'large'} onChange={onChangeTo} defaultValue={dayjs(to, 'YYYY-MM')} /></Space>

                            </div>
                            <div className="text-center mt-2">
                                <Button size={'large'} className="w-full bg-purple-600 text-white" onClick={handleGetData}>Generate Report</Button>
                            </div>



                            {
                                !isfetching ? <div className="">


                                    <>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10 border-b-2 border-black mb-2">
                                            <div>
                                                <p className="text-left">Stall no.</p>
                                                <p className="text-left">Awardee name</p>
                                                <p className="text-left">Occupant name</p>
                                                <p className="text-left">Rentee</p>
                                                <p className="text-left">Business permit</p>
                                                <p className="text-left">Area</p>
                                                <p className="text-left">Section</p>
                                                <p className="text-left">Monthly rental</p>
                                                <p className="text-left">Collector</p>
                                            </div>
                                            <div>
                                                <p className="text-left">{data?.[0]?.stall_no ?? '---'}</p>
                                                <p className="text-left">{data?.[0]?.awardee_name ?? '---'}</p>
                                                <p className="text-left">{data?.[0]?.occupant_name ?? '---'}</p>
                                                <p className="text-left">{data?.[0]?.is_rentee == 1 ? 'YES' : 'NO' ?? '---'}</p>
                                                <p className="text-left">{data?.[0]?.is_with_business_permit == 1 ? 'YES' : 'NO' ?? '---'}</p>
                                                <p className="text-left">{data?.[0]?.area_name ?? '---'}</p>
                                                <p className="text-left">{data?.[0]?.section_name ?? '---'}</p>
                                                <p className="text-left">{data?.[0]?.rent_per_month ?? '---'}</p>
                                                <p className="text-left">{data?.[0]?.collector_name ?? '---'}</p>
                                            </div>
                                        </div>

                                        <h2 className="text-center">Payment History</h2>


                                        <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mt-5 border-b-2 border-black mb-2">

                                            <p className="text-left">Date</p>
                                            <p className="text-left">OR No.</p>
                                            <p className="text-left">Paid Date</p>
                                            <p className="text-left">Satus</p>

                                        </div>



                                        {
                                            displayPaymentHistory()
                                        }

                                        <div>
                                            <h1> Balance: ₱{displayBalance()}</h1>
                                        </div>
                                    </>




                                </div> : <div className="h-screen text-center noPrint">
                                    <Spin size="large" tip='Generating...' className="mt-20" />
                                </div>
                            }




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
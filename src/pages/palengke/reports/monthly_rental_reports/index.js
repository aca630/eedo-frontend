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
import { GetMonthlyRentalReports, GetOverAllDispenseCashTickets, GetOverAllDispenseCashTicketsPerCollector, GetOverAllDispenseCashTicketsPerName, GetOverAllMonthlyPayment, GetOverAllMonthlyPaymentPerArea, GetOverAllMonthlyPaymentPerCollector } from "../../../api/reports";

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

    const handleCancelAdd = () => {
        setOpenAdd(false);
    }
    const showModalAdd = () => {
        setOpenAdd(true);
    };




    const handleGetData = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetMonthlyRentalReports({
                from: from,
                to: moment(from).add(1, 'month').format('YYYY-MM-DD')
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


    const onChange = (date, dateString) => {
        console.log(dateString);

        setFrom(dateString)
        setTo(moment(dateString).add(1, 'days').format('yyyy-MM-DD'))
    };


    useEffect(() => {

        handleGetData();

    }, [from, to])

    useEffect(() => {
        handleGetData();
    }, []);


    return (


        <>
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
                                <Space><Button className="text-md"><CalendarOutlined />Month </Button> <DatePicker picker="month"  size={'large'} onChange={onChange} defaultValue={dayjs(from, 'YYYY-MM')} /></Space>
                            </div>

               


                            {
                !isfetching ? <div className="">
                    <table id='MyTable' className="">
                       
                                    <>
                                        <thead>
                                            <tr>

                                                <th  className="MyTableBorder font2">Stall no</th>
                                                <th className="MyTableBorder font2 text-center">awardee name</th>
                                                <th className="MyTableBorder font2 text-center">occupant name</th>
                                                {/* <th className="MyTableBorder font2 text-center">rentee</th>
                                                <th className="MyTableBorder font2 text-center">Business permit</th>
                                                <th className="MyTableBorder font2 text-center">area name</th>
                                                <th className="MyTableBorder font2 text-center">section name</th>
                                                <th className="MyTableBorder font2 text-center">rent per month</th>
                                                <th className="MyTableBorder font2 text-center">collector name</th> */}
                                                <th className="MyTableBorder font2 text-center">OR No.</th>
                                                <th className="MyTableBorder font2 text-center">Paid date</th>
                                                <th className="MyTableBorder font2 text-center">payment status</th>
                                                
                                                
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                           
                                           {
                                            data?.map((item, index) => (

                                                <tr key={index}>
                                                    <td className="MyTableBorder font2 text-center">{item?.stall_no}</td>
                                                    <td className="MyTableBorder font2 text-center">{item?.awardee_name}</td>
                                                    <td className="MyTableBorder font2 text-center">{item?.occupant_name}</td>
                                                    {/* <td className="MyTableBorder font2 text-center">{item?.is_rentee ==1?'yes':'no'}</td>
                                                    <td className="MyTableBorder font2 text-center">{item?.is_with_business_permit  ==1?'yes':'no'}</td>
                                                    <td className="MyTableBorder font2 text-center">{item?.area_name}</td>
                                                    <td className="MyTableBorder font2 text-center">{item?.section_name}</td>
                                                    <td className="MyTableBorder font2 text-center">{item?.rent_per_month}</td>
                                                    <td className="MyTableBorder font2 text-center">{item?.collector_name}</td> */}
                                                    <td className="MyTableBorder font2 text-center"><span className={item?.or_number=='N/A'?'':'font-bold text-green-600'}>{item?.or_number} </span></td>
                                                    <td className="MyTableBorder font2 text-center"><span className={item?.paid_date=='N/A'?'':'font-bold text-green-600'}>{item?.paid_date} </span></td>
                                                    <td className="MyTableBorder font2 text-center"><span className={item?.payment_status=='Paid'?'text-green-600':'text-red-600'}>{item?.payment_status}</span></td> 
                                                </tr>
                                            ))
                                           }
                                        </tbody>

                                        {/* <tr>

                                            <th colSpan={4} className="MyTableBorder font2 text-right font-bold">Total :</th>
                                            <th className="MyTableBorder font2 text-right font-bold">{TotalGross?.toLocaleString("en-US")}</th>
                                            <th className="MyTableBorder font2 text-right font-bold">{TotalHits?.toLocaleString("en-US")}</th>
                                            <th className="MyTableBorder font2 text-right font-bold">{TotalNet?.toLocaleString("en-US")}</th>
                                            <th className="MyTableBorder font2 text-right font-bold">{(TotalSalary)?.toLocaleString("en-US")}</th>
                                            <th className="MyTableBorder font2 text-right font-bold"><span className={`${TotalKabig < 0 ? `text-red-500` : `text-black`}`}> {((TotalKabig))?.toLocaleString("en-US")}</span></th>

                                        </tr> */}
                                    </>


                                
                           
                        
                    </table>
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
        </>


    )

}
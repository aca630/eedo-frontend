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

        const monthRows = [];
        let current = new Date(from);
        const end = new Date(to);
      
        while (current<= end ) {
          const month = moment(current).format('YYYY-MM');
      
          const paidItem = data.find(
            item => moment(item.paid_date).format('YYYY-MM') === month
          );
      
          monthRows.push(
            <tr key={month}>
              <td className="text-left MyTableBorder">{month}</td>
              <td className="text-left MyTableBorder">{paidItem ? paidItem.or_number : '-'}</td>
              <td className="text-left MyTableBorder">{paidItem?.paid_date}</td>
              <td className="text-left MyTableBorder">
                {paidItem ? (
                  <span className="text-green-500">PAID</span>
                ) : (
                  <span className="text-red-500">UNPAID</span>
                )}
              </td>
            </tr>
          );
      
          // Move to next month
          current.setMonth(current.getMonth() + 1);
        }

        return monthRows;
    }


    function displayBalance() {

    
  
        let balanace = 0

        const monthRows = [];
        let current = new Date(from);
        const end = new Date(to);
      
        while (current<= end ) {
          const month = moment(current).format('YYYY-MM');
      
          const paidItem = data.find(
            item => moment(item.paid_date).format('YYYY-MM') === month
          );
      
         if(!paidItem){
            balanace+=paidItem?.rent_per_month ?? data?.[0]?.rent_per_month ?? 0;
         }
      
          // Move to next month
          current.setMonth(current.getMonth() + 1);
        }
   

        return balanace?.toLocaleString(undefined, { minimumFractionDigits: 2 })


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

                                        <table id="MyTable" className="w-full mt-10">
                                            <thead>
                                                <tr>
                                                    <th className="text-left MyTableBorder" colSpan={2}>Stall no.</th>
                                                    <td className="text-left MyTableBorder" colSpan={2}>{data?.[0]?.stall_no ?? '---'}</td>
                                                </tr>


                                                <tr>
                                                    <th className="text-left MyTableBorder" colSpan={2}>Awardee name</th>
                                                    <td className="text-left MyTableBorder" colSpan={2}>{data?.[0]?.awardee_name ?? '---'}</td>
                                                </tr>

                                                <tr>
                                                    <th className="text-left MyTableBorder" colSpan={2}>Occuthant name</th>
                                                    <td className="text-left MyTableBorder" colSpan={2}>{data?.[0]?.occupant_name ?? '---'}</td>
                                                </tr>

                                                <tr>
                                                    <th className="text-left MyTableBorder" colSpan={2}>Rentee</th>
                                                    <td className="text-left MyTableBorder" colSpan={2}>{data?.[0]?.is_rentee == 1 ? 'YES' : 'NO' ?? '---'}</td>
                                                </tr>

                                                <tr>
                                                    <th className="text-left MyTableBorder" colSpan={2}>Business thermit</th>
                                                    <td className="text-left MyTableBorder" colSpan={2}>{data?.[0]?.is_with_business_permit == 1 ? 'YES' : 'NO' ?? '---'}</td>
                                                </tr>

                                                <tr>
                                                    <th className="text-left MyTableBorder" colSpan={2}>Area</th>
                                                    <td className="text-left MyTableBorder" colSpan={2}>{data?.[0]?.area_name ?? '---'}</td>
                                                </tr>

                                                <tr>
                                                    <th className="text-left MyTableBorder" colSpan={2}>Section</th>
                                                    <td className="text-left MyTableBorder" colSpan={2}>{data?.[0]?.section_name ?? '---'}</td>
                                                </tr>

                                                <tr>
                                                    <th className="text-left MyTableBorder" colSpan={2}>Monthly rental</th>
                                                    <td className="text-left MyTableBorder" colSpan={2}>{data?.[0]?.rent_per_month ?? '---'}</td>
                                                </tr>

                                                <tr>
                                                    <th className="text-left MyTableBorder" colSpan={2}>Collector</th>
                                                    <td className="text-left MyTableBorder" colSpan={2}>{data?.[0]?.collector_name ?? '---'}</td>
                                                </tr>
                                            </thead>

                                            <thead>
                                                <tr>
                                                    <th className="text-left" colSpan={4}>    <h2 className="text-center">Payment History</h2></th>
                                                </tr>
                                            </thead>

                                            <thead>
                                                <tr>
                                                    <th className="text-left MyTableBorder text-center ">Date</th>
                                                    <th className="text-left MyTableBorder text-center ">OR No.</th>
                                                    <th className="text-left MyTableBorder text-center ">Paid Date</th>
                                                    <th className="text-left MyTableBorder text-center ">Satus</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {displayPaymentHistory()}
                                               
                                            </tbody>
                                        </table>





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
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { GetTallyPerDraw } from "../../api/tally";
import { GetSupervisor } from "../../api/supervisor";
import { GetGrossPerDraw, GetSupervisorWithGross, GetSupervisorWithVoids, GetTellerGrossPerDay } from "../../api/reports";
import { Button, DatePicker, Radio, Space, Spin } from "antd";
import { FileExcelOutlined, PrinterOutlined, RollbackOutlined } from "@ant-design/icons";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import ReactExport from 'react-data-export';
import Cookies from "js-cookie";
import { GetTellerVoids } from "../../api/tellerVoid";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;





export default function Home() {
    const [from, setFrom] = useState(moment().format('yyyy-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('yyyy-MM-DD'))
    const router = useRouter();
    const { drawTime } = router?.query;
    const area = Cookies.get("username")
    const { drawId } = router?.query;
    const { isOffline } = router?.query;
    const [data, setData] = useState([])
    const [spvrData, setspvrData] = useState([])
    const [spvrData2, setspvrData2] = useState([{ name: 'test' }])
    const [isfetching, Setisfetching] = useState(false);
    let TotalL2 = 0;
    let TotalL3 = 0;
    let TotalD4 = 0;
    let TotalP3 = 0;
    useEffect(() => {


        handleGetSpvr()
        handleGetData()
    }, [])





    const handleGetSpvr = async () => {

        try {
            let ApiResponse = await GetSupervisorWithVoids({
                from: from,
                to: to
            })

            setspvrData(ApiResponse.data?.data)
        }
        catch (error) {


        }

    }



    const handleGetData = async () => {
        Setisfetching(true)
        try {
            let ApiResponse = await GetTellerVoids({
                from: from,
                to: to
            })

            setData(ApiResponse.data?.data)
        }
        catch (error) {

            console.log(error);
        }
        Setisfetching(false)
    }



    function GetTotal(betCode) {
        let total = 0;
        data?.map((item, key) => {

            if (item?.betCode == betCode) {
                total += item.TotalBetsPerNo;
            }

        })

        return total?.toFixed(2)?.replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }


    const onChange = (date, dateString) => {
        console.log(dateString);

        setFrom(dateString)
        setTo(moment(dateString).add(1, 'days').format('yyyy-MM-DD'))
    };

    useEffect(() => {

        handleGetData()
        handleGetSpvr()

    }, [from, to])



    return (


        <>


            <div className="noPrint flex">

                <Radio.Group className="left-2">
                    <Radio.Button onClick={() => {
                        router.push({
                            pathname: '/dashboard',
                            query: {
                                isOffline: 0
                            },
                        }, `dashboard`, {})

                    }} value="large" type="primary" className=" mb-5 mt-5 "><RollbackOutlined className="mt-1" /> Back</Radio.Button>

                    <Radio.Button onClick={() => {
                        window.print();
                    }} value="large" type="primary" className=" mb-5 mt-5 "><PrinterOutlined className="mt-1" /> Print PDF</Radio.Button>

                </Radio.Group>

                <div className="text-center  mb-5 mt-5 ml-2">
                    <Space>
                        <DatePicker onChange={onChange} defaultValue={dayjs(from, 'YYYY-MM-DD')} /></Space>
                </div>


            </div>

            {
                !isfetching ? <>
                    <h1 className="text-sm text-center font-normal">
                        {area.toLocaleUpperCase()} SDS VOIDED RECEIPTS
                    </h1>
                    <h1 className="text-sm text-center font-normal">
                        {`${from}`}
                    </h1>


                    <div className="page" >


                        <div className="subpage">
                            {
                                spvrData?.map((item, key) => {
                                    let totalReceipts = 0;
                                    let TotalAmount = 0;
                                    let TotalSalary = 0;
                                    let TotalNet = 0;
                                    let TotalKabig = 0;

                                    return (
                                        <div key={key}>
                                            <div className="text-xs font-semibold text-center ">{item.username?.toLocaleUpperCase()}</div>

                                            <div className="MyBorder3" >
                                                <div className="box1">
                                                    <div className="grid grid-cols-7" key={key}>
                                                        <div className="font1   text-center col-span-2">TELLER</div>
                                                        <div className="font1   text-center col-span-3">OUTLET</div>
                                                        <div className="font1   text-center">TOTAL RECEIPTS</div>
                                                        <div className="font1   text-center">TOTAL AMOUNT</div>

                                                    </div>
                                                    <div>


                                                        {
                                                            data?.filter((entity) => {
                                                                if (entity?.supervisor === item?.id) {
                                                                    return item
                                                                }
                                                            })?.map((item2, key2) => {
                                                                totalReceipts += item2?.TotalVoidCount;
                                                                TotalAmount += item2?.totalVoid;
                                                                TotalNet += (item2?.TotalOverAllGross - item2.TotalOverAllHits);
                                                                console.log(item2);
                                                                return (
                                                                    <div className="grid grid-cols-7 " key={key2}>
                                                                        <div className="font1 font-normal  text-left col-span-2">{item2?.fullName}</div>
                                                                        <div className="font1 font-normal   text-left col-span-3">{item2?.name},{item2?.address}</div>
                                                                        <div className="font1 font-normal  text-center">{(item2?.TotalVoidCount ?? 0)?.toLocaleString("en-US")}</div>
                                                                        <div className="font1 font-normal  text-center">{item2?.totalVoid?.toLocaleString("en-US")}</div>
                                                                    </div>

                                                                )
                                                            })
                                                        }

                                                        <div className="grid grid-cols-7 " >
                                                            <div className="font1 text-right font-semibold  col-span-5">Total :</div>
                                                            <div className="font1 font-semibold text-center">{totalReceipts?.toLocaleString("en-US")}</div>
                                                            <div className="font1 font-semibold text-center">{TotalAmount?.toLocaleString("en-US")}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>







                                    )
                                })
                            }
                        </div>

                    </div>
                </> : <div className="h-screen text-center noPrint">
                    <Spin size="large" tip='Generating...' className="mt-20" />
                </div>
            }
        </>


    )




}
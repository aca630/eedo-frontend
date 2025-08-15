import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { GetTallyPerDraw } from "../../api/tally";
import { GetSupervisor } from "../../api/supervisor";
import { GetActiveTellers, GetGrossPerDraw, GetTellerGrossPerDay } from "../../api/reports";
import { Button, Radio } from "antd";
import { PrinterOutlined, RollbackOutlined } from "@ant-design/icons";


export default function Home() {
    const [from, setFrom] = useState(moment().format('yyyy-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('yyyy-MM-DD'))
    const router = useRouter();
    const { drawTime } = router?.query;
    const { drawId } = router?.query;
    const { isOffline } = router?.query;
    const [data, setData] = useState([])
    const [spvrData, setspvrData] = useState([])

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
            let ApiResponse = await GetSupervisor()

            setspvrData(ApiResponse.data?.data)
        }
        catch (error) {


        }

    }

    const handleGetData = async () => {

        try {
            let ApiResponse = await GetActiveTellers({
                from: from,
                to: to
            })

            setData(ApiResponse.data?.data)
        }
        catch (error) {


        }

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


    function DisplaySalary(gross) {

        let commission = 0;
        if (gross < 501) {
            commission = 0
        }
        else if (gross > 500 && gross <= 1000) {
            commission = 100;
        }
        else if (gross >= 1001 && gross <= 2000) {
            commission = 200;
        }
        else if (gross >= 2001 && gross <= 3000) {
            commission = 300;
        }
        else if (gross >= 3001 && gross <= 4000) {
            commission = 400;
        }
        else if (gross > 4001 && gross <= 6000) {
            commission = 550;
        }
        else if (gross >= 6001 && gross <= 8500) {
            commission = 700;
        }
        else if (gross >= 8501 && gross <= 10500) {
            commission = 850;
        }
        else if (gross >= 10501 && gross <= 13000) {
            commission = 950;
        }
        else if (gross >= 13001 && gross <= 15500) {
            commission = 1000;
        }
        else if (gross >= 15501 && gross <= 18000) {
            commission = 1200;
        }
        else if (gross >= 18001 && gross <= 20500) {
            commission = 1400;
        }
        else if (gross >= 20501 && gross <= 25000) {
            commission = 1600;
        }
        else if (gross >= 25001 && gross <= 30000) {
            commission = 1800;
        }
        else if (gross > 30000) {
            commission = 2000;
        }

        return commission;
    }


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
                    }} value="large" type="primary" className=" mb-5 mt-5 "><PrinterOutlined className="mt-1" /> Print</Radio.Button>

                </Radio.Group>
            </div>

            <h1 className="text-sm text-center font-normal">
               Active Tellers
            </h1>
            <h1 className="text-sm text-center font-normal">
                {`${from}`}
            </h1>
            <h1 className="text-sm text-center font-normal">
                Date Generated:<span className="font-semibold">{moment().format('YYYY-MM-DD HH:mm')}</span>
            </h1>


            {
                spvrData?.map((item, key) => {
                    let active = 0;
                    let inactive = 0;
                    let count =0;
                    return (

                        <div className="page" key={key}>


                            <div className="subpage">

                                <div className="text-sm font-semibold text-center MyBorder">{item.username}</div>
                                <div className="box1">
                                    <div className="grid grid-cols-7 " key={key}>
                                        <div className="text-sm font-semibold MyBorder text-center col-span-3">TELLER</div>
                                        <div className="text-sm font-semibold MyBorder text-centera col-span-3">OUTLET</div>
                                        <div className="text-sm font-semibold MyBorder text-center col-span-1">STATUS</div>

                                    </div>
                                    <div>


                                        {
                                            data?.filter((entity) => {
                                                if (entity?.supervisor === item?.id) {
                                                    return item
                                                }
                                            })?.map((item2, key2) => {

                                                if (item2?.isActive == 1) {
                                                    active += 1;
                                                }
                                                else if (item2?.isActive == 0) {
                                                    inactive += 1
                                                }

                                                return (
                                                    <div className="grid grid-cols-7 " key={key2}>
                                                        <div className="text-sm font-normal MyBorder text-left col-span-3">{count+=1}. {item2?.fullName}</div>
                                                        <div className="text-sm font-normal MyBorder text-left col-span-3">{item2?.name},{item2?.address}</div>
                                                        <div className="text-sm font-normal MyBorder text-left col-span-1"><span className={`${item2?.isActive == 1 ? `text-green-500` : `text-red-500`}`}>{item2?.isActive == 1 ? `ACTIVE` : 'INACTIVE'}</span></div>
                                                    </div>

                                                )
                                            })
                                        }

                                        <div className="grid grid-cols-4 " >
                                            <div className="text-sm text-right font-semibold MyBorder col-span-2">Total :</div>
                                            <div className="text-sm text-left font-semibold MyBorder"><span className="text-green-500">ACTIVE:{active}</span></div>
                                            <div className="text-sm text-left font-semibold MyBorder"><span className="text-red-500">INACTIVE:{inactive}</span></div>
                                        </div>

                                    </div>
                                </div>



                            </div>

                        </div>
                    )
                })
            }
        </>


    )




}
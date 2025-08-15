import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { GetTallyPerDraw } from "../../api/tally";
import { GetSupervisor } from "../../api/supervisor";
import { GetActiveTellers, GetGrossPerDraw, GetTellerGrossPerDay, GetTellersAttendance } from "../../api/reports";
import { Button, DatePicker, Radio, Space, Spin } from "antd";
import { PrinterOutlined, RollbackOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export default function Home() {
    const [from, setFrom] = useState(moment().format('yyyy-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('yyyy-MM-DD'))
    const router = useRouter();
    const { drawTime } = router?.query;
    const { drawId } = router?.query;
    const { isOffline } = router?.query;
    const [data, setData] = useState([])
    const [tellersData, settellersData] = useState([])
    const [spvrData, setspvrData] = useState([])
    const [isfetching, Setisfetching] = useState(false);


    let TotalL2 = 0;
    let TotalL3 = 0;
    let TotalD4 = 0;
    let TotalP3 = 0;
    useEffect(() => {


        handleGetSpvr()
        handleGetData()
        handleGetTellers()
    }, [])



    const handleGetTellers = async () => {

        try {
            let ApiResponse = await GetActiveTellers()

            settellersData(ApiResponse.data?.data)
        }
        catch (error) {


        }

    }

    const handleGetSpvr = async () => {

        try {
            let ApiResponse = await GetSupervisor()

            setspvrData(ApiResponse.data?.data)
        }
        catch (error) {


        }

    }

    const handleGetData = async () => {
        Setisfetching(true)
        try {
            let ApiResponse = await GetTellersAttendance({
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


    const onChange = (date, dateString) => {
        console.log(dateString);

        setFrom(dateString)

    };

    const onChangeTo = (date, dateString) => {

        setTo(dateString)

    };


    function loopDateRange() {

        let currentDate = from;
        const columnElements = [];
        while (currentDate <= to) {
            // Do something with the current date
            const column = (
                spvrData?.map((item, key) => {
                    let active = 0;
                    let inactive = 0;
                    let count = 0;
                    return (

                        <div className="page" key={key}>


                            <div className="subpage">

                                <div className="text-sm font-semibold text-center grid grid-cols-2">
                                    <div className="MyBorder">
                                        DATE
                                    </div>
                                    <div className="MyBorder">{moment(from).format('YYYY/MM/DD')} - {moment(to).format('YYYY/MM/DD')}</div>
                                </div>
                                <div className="text-sm font-semibold text-center grid grid-cols-2">
                                    <div className="MyBorder">
                                        Supervisor
                                    </div>
                                    <div className="MyBorder">{item?.username}</div>
                                </div>
                                <div className="box1">
                                    <div className="grid grid-cols-6 ">
                                        <div className="text-sm font-semibold MyBorder text-center">Date</div>
                                        <div className="text-sm font-semibold MyBorder text-center">TELLER</div>
                                        <div className="text-sm font-semibold MyBorder text-center">OUTLET</div>
                                        <div className="text-sm font-semibold MyBorder text-center ">Gross</div>
                                        <div className="text-sm font-semibold MyBorder text-center ">Hits</div>
                                        <div className="text-sm font-semibold MyBorder text-center ">Kabig</div>

                                    </div>

                                    <div>
                                        {
                                            tellersData?.filter((entity) => {
                                                if (entity?.supervisor === item?.id) {
                                                    return item
                                                }
                                            })?.map((item2, key2) => {

                                                return (

                                                    <div className="grid grid-cols-6 " key={key2}>
                                                        <div className="text-sm font-normal MyBorder text-left">{count += 1}. {currentDate}</div>
                                                        <div className="text-sm font-normal MyBorder text-left">{item2?.username}</div>
                                                        <div className="text-sm font-normal MyBorder text-left">{item2?.outlet}</div>
                                                        <div className="text-sm font-normal MyBorder text-right">
                                                            {displayGross(item, item2, currentDate)}
                                                        </div>
                                                        <div className="text-sm font-normal MyBorder text-right">
                                                            {displayHits(item, item2, currentDate)}
                                                        </div>
                                                        <div className="text-sm font-normal MyBorder text-right">
                                                            {displayGross(item, item2, currentDate)-displayHits(item, item2, currentDate)}
                                                        </div>
                                                    </div>
                                                )

                                            })
                                        }
                                    </div>


                                    <div>


                                    </div>
                                </div>



                            </div>

                        </div>
                    )
                })
            );

            columnElements.push(column);

            // spvrData?.map((item, key) => {

            //     return (

            //         <div className="page" key={key}>


            //             <div className="subpage">

            //                 <div className="text-sm font-semibold text-center MyBorder">{item.username}</div>
            //                 <div className="box1">
            //                     <div className="grid grid-cols-4 " key={key}>
            //                         <div className="text-sm font-semibold MyBorder text-center">TELLER</div>
            //                         <div className="text-sm font-semibold MyBorder text-center">OUTLET</div>
            //                         <div className="text-sm font-semibold MyBorder text-center col-span-2">STATUS</div>

            //                     </div>
            //                     <div>


            //                     </div>
            //                 </div>



            //             </div>

            //         </div>
            //     )
            // })
            // Move to the next day

            currentDate = moment(currentDate).add(1, 'days').format('yyyy-MM-DD')
        }

        return columnElements

    }



    function displayGross(item, filter, currentDate) {

        let gross = 0;

        data?.filter((entity2) => {
            if (entity2?.id === filter?.id && moment(entity2?.created_at)?.format('YYYY-MM-DD') == currentDate) {
                return item
            } else {
                return 0
            }
        })?.map((item3, key3) => {

            console.log(item3);
            gross = item3?.TotalOverAllGross


        })

        return gross?.toLocaleString('en-US')

    }
    function displayHits(item, filter, currentDate) {

        let hits = 0;

        data?.filter((entity2) => {
            if (entity2?.id === filter?.id && moment(entity2?.created_at)?.format('YYYY-MM-DD') == currentDate) {
                return item
            } else {
                return 0
            }
        })?.map((item3, key3) => {

            console.log(item3);
            hits = item3?.TotalOverAllHits


        })

        return hits?.toLocaleString('en-US')

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

                <div className="text-center  mb-5 mt-5 ml-2">
                    <Space><span>From:</span><DatePicker onChange={onChange} defaultValue={dayjs(from, 'YYYY-MM-DD')} />
                        <span>To:</span>
                        <DatePicker onChange={onChangeTo} defaultValue={dayjs(from, 'YYYY-MM-DD')} />

                        <Button type="primary" onClick={(() => {
                            handleGetData()
                        })}>Generate</Button>
                    </Space>
                </div>
            </div>

            {
                !isfetching ? <>
                    <h1 className="text-sm text-center font-normal">
                        Tellers Report
                    </h1>
                    <h1 className="text-sm text-center font-normal">
                        From <span className="font-bold">{`${from}`}</span> To <span className="font-bold">{to}</span>
                    </h1>
                    <h1 className="text-sm text-center font-normal">
                        Date Generated:<span className="font-semibold">{moment().format('YYYY-MM-DD HH:mm')}</span>
                    </h1>


                    {
                        loopDateRange()
                    }
                </> : <div className="text-center">
                    <Spin tip='Generating...' />
                </div>
            }


        </>


    )




}
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { PrinterOutlined, RollbackOutlined } from "@ant-design/icons";
import { Button, DatePicker, Radio, Space, Spin } from "antd";
import Cookies from "js-cookie";
import { ClaimeWinningTickets } from "../../api/reports";
import { GetSupervisor } from "../../api/supervisor";
import dayjs from 'dayjs';

export default function Home() {
    const [from, setFrom] = useState(moment().format('yyyy-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('yyyy-MM-DD'))
    const area = Cookies.get("username")
    const router = useRouter();
    const { drawTime } = router?.query;
    const { currDate } = router?.query;
    const { drawId } = router?.query;
    const { isOffline } = router?.query;
    const [data, setData] = useState([])
    const [spvrData, setspvrData] = useState([])
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
            let ApiResponse = await GetSupervisor()

            setspvrData(ApiResponse.data?.data)
        }
        catch (error) {


        }

    }

    const handleGetData = async () => {
        Setisfetching(true)
        try {
            let ApiResponse = await ClaimeWinningTickets({
                isClaim: 0,
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


    const onChangeFrom = (date, dateString) => {
        console.log(dateString);

        setFrom(dateString)

    };

    const onChangeTo = (date, dateString) => {

        setTo(dateString)

    };


    useEffect(() => {

        handleGetData()


    }, [from, to])


    return (


        <>

            <div className="noPrint flex">

                <Radio.Group className="left-2">
                    <Radio.Button onClick={() => {
                        router.push({
                            pathname: '/reports',
                            query: {
                                isOffline: 0
                            },
                        }, `dashboard`, {})

                    }} value="large" type="primary" className=" mb-5 mt-5 "><RollbackOutlined className="mt-1" /> Back</Radio.Button>

                    <Radio.Button onClick={() => {
                        window.print();
                    }} value="large" type="primary" className=" mb-5 mt-5 "><PrinterOutlined className="mt-1" /> Print</Radio.Button>

                </Radio.Group>


                <div className="text-center ml-2">
                    <Space>

                        {/* <ExcelFile filename={`${area} Daily Gross ${from}`} element={<Button> <FileExcelOutlined /> Export Excel</Button>}>
                            <ExcelSheet dataSet={multiDataSet} name={area} />
                        </ExcelFile> */}

                        <div className="text-center  mb-5 mt-5 ml-2">
                            <Space><span>From:</span><DatePicker onChange={onChangeFrom} defaultValue={dayjs(from, 'YYYY-MM-DD')} />
                                <span>To:</span>
                                <DatePicker onChange={onChangeTo} defaultValue={dayjs(from, 'YYYY-MM-DD')} />


                            </Space>
                        </div>

                    </Space>
                </div>
            </div>

            {
                !isfetching ?
                    <>
                        <h1 className="text-sm text-center font-semibold">
                            {area?.toLocaleUpperCase()} Unclaimed Winning Tickets LIST
                        </h1>
                        <h1 className="text-sm text-center font-normal">
                            Date Generated:<span className="font-semibold">{moment().format('YYYY-MM-DD HH:mm')}</span>
                        </h1>

                        <div className="page" >
                            <div className="subpage">

                                {
                                    spvrData?.map((item, key) => {
                                        let TotalGross = 0;
                                        let TotalHits = 0;

                                        return (


                                            <div className="container" key={key}>

                                                <table id=" table">

                                                    <thead>

                                                        <tr>
                                                            <th colSpan={8} className="MyTableBorder font2 text-center">{item.username?.toLocaleUpperCase()}</th>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan={2} className="MyTableBorder font2 text-center">Teller</th>
                                                            <th className="MyTableBorder font2 text-center">Trans. ID</th>
                                                            <th className="MyTableBorder font2 text-center">Draw</th>
                                                            <th className="MyTableBorder font2 text-center">Bet No.</th>
                                                            <th className="MyTableBorder font2 text-center">Bet Code</th>
                                                            <th className="MyTableBorder font2 text-center">Bet Amount</th>
                                                            <th className="MyTableBorder font2 text-center">Win Amount</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        {
                                                            data?.filter((entity) => {
                                                                if (entity?.supervisor === item?.id) {
                                                                    return item
                                                                }
                                                            })?.map((item2, key2) => {

                                                                TotalGross += item2?.betAmount;
                                                                TotalHits += item2?.winAmount;

                                                                return (
                                                                    <tr className="" key={key2}>
                                                                        <td colSpan={2} className="MyTableBorder font2 text-left">{item2?.fullName}</td>
                                                                        <td className="MyTableBorder font2 text-right">{item2?.transactionId}</td>
                                                                        <td className="MyTableBorder font2 text-right">{item2?.drawTime=='10:30'?`${item2?.drawTime}AM`:`${item2?.drawTime-12}PM`} {item2?.drawDate?.split(' ')[0]}</td>
                                                                        <td className="MyTableBorder font2 text-right">{item2?.betNo}</td>
                                                                        <td className="MyTableBorder font2 text-right">{item2?.betCode}</td>
                                                                        <td className="MyTableBorder font2 text-right">{item2?.betAmount}</td>
                                                                        <td className="MyTableBorder font2 text-right ">{item2?.winAmount}</td>
                                                                    </tr>

                                                                )
                                                            })
                                                        }

                                                        <tr className="" >
                                                            <td colSpan={6} className="MyTableBorder font2 text-right font-bold">Total :</td>
                                                            <td className="MyTableBorder font2 text-right font-bold">{TotalGross?.toLocaleString("en-US")}</td>
                                                            <td className="MyTableBorder font2 text-right font-bold">{TotalHits?.toLocaleString("en-US")}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>


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
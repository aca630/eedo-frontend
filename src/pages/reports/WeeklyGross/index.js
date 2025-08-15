import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { GetActiveTellers, GetGrossPerDraw, GetSupervisorWithGross, GetTellerGrossPerDay, TellerGrossPerDateRange, TellerWeeklySalary } from "../../api/reports";
import { Button, DatePicker, Radio, Space, Spin } from "antd";
import { FileExcelOutlined, PrinterOutlined, RollbackOutlined } from "@ant-design/icons";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import ReactExport from 'react-data-export';
import Cookies from "js-cookie";
import { totalmem } from "os";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;





export default function Home() {
    const [from, setFrom] = useState(moment().format('yyyy-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('yyyy-MM-DD'))
    const router = useRouter();
    const { drawTime } = router?.query;
    const area = Cookies.get("username")
    const id = Cookies.get('id')
    const { drawId } = router?.query;
    const { isOffline } = router?.query;
    const [data, sedivata] = useState([])
    const [spvrData, setspvrData] = useState([])
    const [spvrData2, setspvrData2] = useState([{ name: 'test' }])
    const [tellerData, settellerData] = useState([])
    const [Datedata, sedivateData] = useState([{ drawDate: '02-28-2024' }, { drawDate: '02-29-2024' }])
    const [isfetching, Setisfetching] = useState(false);
    let TotalL2 = 0;
    let TotalL3 = 0;
    let TotalD4 = 0;
    let TotalP3 = 0;
    useEffect(() => {


        handleGetSpvr()
        handleGedivata()
    }, [])






    const handleGetTeller = async () => {

        try {
            let ApiResponse = await GetActiveTellers()

            settellerData(ApiResponse.data?.data)
        }
        catch (error) {


        }

    }


    const handleGetSpvr = async () => {

        try {
            let ApiResponse = await GetSupervisorWithGross({
                from: from,
                to: to
            })

            setspvrData(ApiResponse.data?.data)
        }
        catch (error) {


        }

    }



    const handleGedivata = async () => {
        Setisfetching(true)
        try {
            let ApiResponse = await TellerWeeklySalary({
                from: from,
                to: to
            })

            sedivata(ApiResponse.data?.data)
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

        handleGedivata()
        handleGetSpvr()
        handleGetTeller()


    }, [from, to])

    const onChangeFrom = (date, dateString) => {
        console.log(dateString);

        setFrom(dateString)

    };

    const onChangeTo = (date, dateString) => {

        setTo(dateString)

    };


    const multiDataSet = [
        {
            // xSteps: 1, // Will start putting cell widiv 1 empty cell on left most
            // ySteps: 5, //will put space of 5 rows,
            columns: [
                { title: `${area.toUpperCase()} DAILY GROSS ${from}`, widdiv: { wpx: 80 }, style: { font: { sz: "16", bold: true } } }
            ],
            data: [

            ]
        }


    ]
        ?.concat(spvrData?.map((item, key) => {

            let TotalGross = 0;
            let TotalHits = 0;
            let TotalSalary = 0;
            let TotalNet = 0;
            let TotalKabig = 0;


            return (
                {
                    // xSteps: 1, // Will start putting cell widiv 1 empty cell on left most
                    ySteps: 2, //will put space of 5 rows,
                    columns: [
                        { title: `Supervisor ${item?.username}`, widdiv: { wpx: 400 }, style: { font: { sz: "14", bold: true } } },//pixels widdiv 
                        { title: `Teller`, widdiv: { wpx: 200 }, style: { font: { sz: "14", bold: true } } },
                        { title: `Outlet`, widdiv: { wpx: 350 }, style: { font: { sz: "14", bold: true } } },
                        { title: `Gross`, widdiv: { wpx: 80 }, style: { font: { sz: "14", bold: true } } },
                        { title: `Hits`, widdiv: { wpx: 80 }, style: { font: { sz: "14", bold: true } } },
                        { title: `Net`, widdiv: { wpx: 80 }, style: { font: { sz: "14", bold: true } } },
                        { title: `Salary`, widdiv: { wpx: 80 }, style: { font: { sz: "14", bold: true } } },
                        { title: `Kabig`, widdiv: { wpx: 80 }, style: { font: { sz: "14", bold: true } } },


                    ],
                    data: [

                        [
                            { value: "", },
                            { value: `1`, widdiv: { wpx: 200 }, style: { font: { sz: "12", } } },
                            { value: `2`, widdiv: { wpx: 350 }, style: { font: { sz: "12", } } },
                            { value: 3, widdiv: { wpx: 80 }, style: { font: { sz: "12", }, numFmt: "0" } },
                            { value: 4, widdiv: { wpx: 80 }, style: { font: { sz: "12", }, numFmt: "0" } },
                            { value: 5, widdiv: { wpx: 80 }, style: { font: { sz: "12", color: { rgb: "000000" } }, numFmt: "0" } },
                            { value: 6, widdiv: { wpx: 80 }, style: { font: { sz: "12", } } },
                            { value: 7, widdiv: { wpx: 80 }, style: { font: { sz: "12", color: { rgb: "000000" } }, numFmt: "0" } },
                        ]

                    ]
                }

            )


        }))






    function displayTeller(spvrId) {
        const columnElements = [];
        {
            data?.filter((entity) => {
                if (entity?.supervisor === spvrId) {
                    return entity
                }
            })?.map((item2, key2) => {


                if (item2?.TotalOverAllGross > 1) {

                    const column = (



                        <tr className="" key={key2}>
                            <td colSpan={2} className="MyTableBorder font2 text-right"></td>
                            <td className="MyTableBorder font2 text-left">{item2?.username}</td>
                            <td className="MyTableBorder font2 text-left"> {item2?.fullName}</td>
                            <td className="MyTableBorder font2 text-center">{(item2?.TotalOverAllGross)?.toFixed(2)?.toLocaleString("en-US")}</td>
                            <td className="MyTableBorder font2 text-center">{DisplaySalary(item2?.TotalOverAllGross)?.toFixed(2)?.toLocaleString("en-US")}</td>
                        </tr>
                    );

                    columnElements.push(column);

                }




            })
        }

        return columnElements
    }


    function displayTotalGross(spvrId) {


        var totalGrossTemp = 0
        tellerData?.filter((entity) => {
            if (entity?.supervisor === spvrId) {
                return entity
            }
        })?.map((item2, key2) => {

            totalGrossTemp += DisplayGrossPerDay(item2?.id)

        })



        return totalGrossTemp
    }



    function displayTotalGross2(spvrId) {


        var totalGrossTemp = 0
        data?.filter((entity) => {
            if (entity?.supervisor === spvrId) {
                return entity
            }
        })?.map((item2, key2) => {

            totalGrossTemp += item2?.TotalOverAllGross;

        })



        return totalGrossTemp
    }


    function DisplaySalary(gross) {

        let commission = gross * .08;

        return commission;
    }



    function DisplayGrossPerDay(tellerId) {

        let currendivate = from;
        const columnElements = [];
        while (currendivate <= to) {
            // Do somediving widiv dive current date
            var column = (
                data.filter((entity) => {


                    if (entity?.id === tellerId && moment(currendivate).format("yyyy-MM-DD") == moment(entity?.created_at).format("yyyy-MM-DD")) {
                        return entity
                    }

                }).map((item, key) => {

                    return (
                        <div key={key} className="text-right">{item?.TotalOverAllGross}</div>
                    )

                })
            );

            if (column.lengdiv == 0) {
                column = (
                    <div className="text-right">0</div>
                )
            }

            // Move to dive next day
            columnElements.push(column);
            currendivate = moment(currendivate).add(1, 'days').format('yyyy-MM-DD')
        }

        return columnElements

    }


    function DisplaySalarySpvr(gross) {

        // let commission =id==2? (gross*.08)*.025:(gross*.08)*.07;
        let commission = (gross * .08);
        return commission;
    }

    function DisplaySalarySpvr2(gross) {

        let commission = id == 2 ? (gross) * .025 : (gross) * .07;

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
                    }} value="large" type="primary" className=" mb-5 mt-5 "><PrinterOutlined className="mt-1" /> Print PDF</Radio.Button>



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
                !isfetching ? <>


                    <div >


                        <div className="text-center">
                            <div>
                                <div>
                                    <div >{area.toLocaleUpperCase()} Weekly Salary</div>
                                </div>
                                <div>
                                    <div>From: {moment(from).format('MMM-DD-YY')} To: {moment(to).format('MMM-DD-YY')}</div>
                                    <div></div>
                                </div>
                                <div>
                                    <div>Date Generated</div>
                                    <div >{moment().format('YYYY-MM-DD HH:mm')}</div>
                                </div>
                            </div>

                            <div>

                                {
                                    spvrData?.map((item, key) => {

                                        return (
                                            <div className="container" key={key}>
                                                <table id=" table">

                                                    <thead>
                                                        <tr>
                                                            <th colSpan={2} className="MyTableBorder font2 text-left">{item?.username?.toUpperCase()}</th>
                                                            <th className="MyTableBorder font2 text-left text-center">Username</th>
                                                            <th className="MyTableBorder font2 text-left text-center">Full name</th>
                                            
                                                            <th className="MyTableBorder font2 text-left text-center w-24">Total Gross</th>
                                                            <th className="MyTableBorder font2 text-left text-center w-24">Salary</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {displayTeller(item.id)}

                                                        <tr className="">
                                                            <td colSpan={4} className="MyTableBorder font2 text-right font-bold">Total </td>
                                                            <td className="MyTableBorder font2 text-right font-bold"> {displayTotalGross2(item.id)?.toLocaleString('en-US')}</td>
                                                            <td className="MyTableBorder font2 text-right font-bold"> {DisplaySalarySpvr(displayTotalGross2(item.id))?.toLocaleString('en-US')}</td>
                                                        </tr>

                                                        <tr className="">
                                                    <td colSpan={4} className="MyTableBorder font2 text-right font-bold">Supervisor Salary</td>
                                                    <td className="MyTableBorder font2 text-right font-bold"> {DisplaySalarySpvr2(displayTotalGross2(item.id))?.toLocaleString('en-US')}</td>
                                                    <td className="MyTableBorder font2 text-right font-bold"></td>
                                                </tr>
                                                    </tbody>
                                                </table>



                                            </div>
                                        )

                                    })
                                }


                            </div>

                        </div>

                    </div>
                </> : <div className="h-screen text-center noPrint">
                    <Spin size="large" tip='Generating...' className="mt-20" />
                </div>
            }
        </>


    )




}
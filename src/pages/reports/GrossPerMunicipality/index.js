import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { GetActiveTellers, GetGrossPerDraw, GetSupervisorWithGross, GetTellerGrossPerDay, GrossPerMunicipality, TellerGrossPerDateRange } from "../../api/reports";
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
    const { drawId } = router?.query;
    const { isOffline } = router?.query;
    const [data, setData] = useState([])
    const [spvrData, setspvrData] = useState([])
    const [Datedata, setDateData] = useState([{ drawDate: '02-28-2024' }, { drawDate: '02-29-2024' }])
    const [isfetching, Setisfetching] = useState(false);
    let TotalGross = 0;
    let TotalHits = 0;
    useEffect(() => {

        handleGetData()
    }, [])







    const handleGetData = async () => {
        Setisfetching(true)
        try {
            let ApiResponse = await GrossPerMunicipality({
                from: from,
                to: moment(from).add(1, 'days').format('yyyy-MM-DD')
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
        else if (gross >= 4001 && gross <= 6000) {
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
        setTo(moment(dateString).add(1, 'days').format('yyyy-MM-DD'))
    };

    useEffect(() => {

        handleGetData()

    }, [from, to])

    const onChangeFrom = (date, dateString) => {
        console.log(dateString);

        setFrom(dateString)

    };

    const onChangeTo = (date, dateString) => {

        setTo(dateString)

    };


    // const multiDataSet = [
    //     {
    //         // xSteps: 1, // Will start putting cell with 1 empty cell on left most
    //         // ySteps: 5, //will put space of 5 rows,
    //         columns: [
    //             { title: `${area.toUpperCase()} DAILY GROSS ${from}`, width: { wpx: 80 }, style: { font: { sz: "16", bold: true } } }
    //         ],
    //         data: [

    //         ]
    //     }


    // ]
    //     ?.concat(spvrData?.map((item, key) => {

    //         let TotalGross = 0;
    //         let TotalHits = 0;
    //         let TotalSalary = 0;
    //         let TotalNet = 0;
    //         let TotalKabig = 0;


    //         return (
    //             {
    //                 // xSteps: 1, // Will start putting cell with 1 empty cell on left most
    //                 ySteps: 2, //will put space of 5 rows,
    //                 columns: [
    //                     { title: `Supervisor ${item?.username}`, width: { wpx: 400 }, style: { font: { sz: "14", bold: true } } },//pixels width 
    //                     { title: `Teller`, width: { wpx: 200 }, style: { font: { sz: "14", bold: true } } },
    //                     { title: `Outlet`, width: { wpx: 350 }, style: { font: { sz: "14", bold: true } } },
    //                     { title: `Gross`, width: { wpx: 80 }, style: { font: { sz: "14", bold: true } } },
    //                     { title: `Hits`, width: { wpx: 80 }, style: { font: { sz: "14", bold: true } } },
    //                     { title: `Net`, width: { wpx: 80 }, style: { font: { sz: "14", bold: true } } },
    //                     { title: `Salary`, width: { wpx: 80 }, style: { font: { sz: "14", bold: true } } },
    //                     { title: `Kabig`, width: { wpx: 80 }, style: { font: { sz: "14", bold: true } } },


    //                 ],
    //                 data: [

    //                     [
    //                         { value: "", },
    //                         { value: `1`, width: { wpx: 200 }, style: { font: { sz: "12", } } },
    //                         { value: `2`, width: { wpx: 350 }, style: { font: { sz: "12", } } },
    //                         { value: 3, width: { wpx: 80 }, style: { font: { sz: "12", }, numFmt: "0" } },
    //                         { value: 4, width: { wpx: 80 }, style: { font: { sz: "12", }, numFmt: "0" } },
    //                         { value: 5, width: { wpx: 80 }, style: { font: { sz: "12", color: { rgb: "000000" } }, numFmt: "0" } },
    //                         { value: 6, width: { wpx: 80 }, style: { font: { sz: "12", } } },
    //                         { value: 7, width: { wpx: 80 }, style: { font: { sz: "12", color: { rgb: "000000" } }, numFmt: "0" } },
    //                     ]

    //                 ]
    //             }

    //         )


    //     }))



    function loopDateRange(spvrId) {

        let currentDate = from;
        const columnElements = [];
        while (currentDate <= to) {
            // Do something with the current date
            const column = (
                <td className="bg-slate-200">{moment(currentDate).format('MMM-DD-YY')}</td>
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


    function getDateDifference() {

        return ((moment(to).format('D') - moment(from).format('D')) + 1)
    }


    // function displayTeller(spvrId) {
    //     const columnElements = [];
    //     {
    //         tellerData?.filter((entity) => {
    //             if (entity?.supervisor === spvrId) {
    //                 return entity
    //             }
    //         })?.map((item2, key2) => {

    //             const column = (
    //                 <tr key={key2}>
    //                 <td></td>
    //                     <td>{item2?.fullName}</td>
    //                     <td>{item2?.name},{item2?.address}</td>

    //                     {DisplayGrossPerDay(item2.id)}

    //                 </tr>
    //             );

    //             columnElements.push(column);


    //         })
    //     }

    //     return columnElements
    // }


    // function displayTotalGross(spvrId) {


    //     var totalGrossTemp=0
    //         tellerData?.filter((entity) => {
    //             if (entity?.supervisor === spvrId) {
    //                 return entity
    //             }
    //         })?.map((item2, key2) => {

    //          totalGrossTemp+=DisplayGrossPerDay(item2?.id)

    //         })



    //         return totalGrossTemp
    // }



    function displayTotalGross2(spvrId) {


        var totalGrossTemp = 0
        data?.filter((entity) => {
            if (entity?.supervisor === spvrId) {
                return entity
            }
        })?.map((item2, key2) => {

            console.log(item2, ' waaaa');

            totalGrossTemp += item2?.TotalOverAllGross;

        })



        return totalGrossTemp
    }




    function DisplayGrossPerDay(tellerId) {

        let currentDate = from;
        const columnElements = [];
        while (currentDate <= to) {
            // Do something with the current date
            var column = (
                data.filter((entity) => {


                    if (entity?.id === tellerId && moment(currentDate).format("yyyy-MM-DD") == moment(entity?.created_at).format("yyyy-MM-DD")) {
                        return entity
                    }

                }).map((item, key) => {

                    return (
                        <td key={key} className="text-right">{item?.TotalOveAllGross}</td>
                    )

                })
            );

            if (column.length == 0) {
                column = (
                    <td className="text-right">0</td>
                )
            }

            // Move to the next day
            columnElements.push(column);
            currentDate = moment(currentDate).add(1, 'days').format('yyyy-MM-DD')
        }

        return columnElements

    }


    function displayTeller(spvrId) {
        const columnElements = [];
        {
            data?.filter((entity) => {
                if (entity?.id === spvrId) {
                    return entity
                }
            })?.map((item2, key2) => {

                const column = (
                    <tr key={key2}>
                        <td></td>
                        <td>{item2?.fullName}</td>
                        <td>{item2?.name}</td>

                        {DisplayGrossPerDay(item2.id)}

                    </tr>
                );

                columnElements.push(column);


            })
        }

        return columnElements
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
                            <Space><span>Date:</span><DatePicker onChange={onChangeFrom} defaultValue={dayjs(from, 'YYYY-MM-DD')} />
                            </Space>
                        </div>

                    </Space>
                </div>
            </div>

            {
                !isfetching ? <>


                    <div className=" text-center "  >

                        <div>
                            <>
                                <h1 className="text-sm text-center font-normal">
                                    {area.toLocaleUpperCase()} GROSS PER MUNICIPALITY
                                </h1>
                                <h1 className="text-sm text-center font-normal">
                                    {`${from}`}
                                </h1>
                                <h1 className="text-sm text-center font-normal">
                                    Date Generated:<span className="font-semibold">{moment().format('YYYY-MM-DD HH:mm')}</span>
                                </h1>

                                <div className="page" >


                                    <div className="subpage">

                                        <div>

                                            <div className="MyBorder2" >
                                                <div className="box1">
                                                    <div className="grid grid-cols-5">
                                                        <div className="text-xl font-bold text-center col-span-2">MUNICIPALITY</div>
                                                        <div className="text-xl font-bold text-center">GROSS</div>
                                                        <div className="text-xl font-bold text-center">HITS</div>
                                                        <div className="text-xl font-bold text-center">KABIG</div>

                                                    </div>


                                                    {
                                                        data?.map((item, key) => {
TotalGross+=item?.TotalOveAllGross;
TotalHits+=item?.TotalOveAllHits;
                                                          
                                                            return (<div className="grid grid-cols-5" key={key}>
                                                                <div className="MyBorder2 text-lg   text-left col-span-2">{item?.name.toLocaleUpperCase()}</div>
                                                                <div className="MyBorder2 text-lg   text-right">{(item?.TotalOveAllGross)?.toLocaleString('en-US')}</div>
                                                                <div className="MyBorder2 text-lg   text-right">{(item?.TotalOveAllHits)?.toLocaleString('en-US')}</div>
                                                                <div className="MyBorder2 text-lg   text-right">{(item?.TotalOveAllGross - item?.TotalOveAllHits)?.toLocaleString('en-US')}</div>
                                                            </div>)



                                                        })

                                                    }


                                                    <div>



                                                        <div className="grid grid-cols-5">
                                                            <div className="MyBorder2 text-lg   text-right font-bold col-span-2">TOTAL:</div>
                                                            <div className="MyBorder2 text-lg   text-right">{(TotalGross)?.toLocaleString('en-US')}</div>
                                                            <div className="MyBorder2 text-lg   text-right">{(TotalHits)?.toLocaleString('en-US')}</div>
                                                            <div className="MyBorder2 text-lg   text-right">{(TotalGross-TotalHits)?.toLocaleString('en-US')}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                            </>
                        </div>



                    </div>
                </> : <div className="h-screen text-center noPrint">
                    <Spin size="large" tip='Generating...' className="mt-20" />
                </div>
            }
        </>


    )




}
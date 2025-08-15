import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { GetActiveTellers, GetGrossPerDraw, GetSupervisorWithGross, GetTellerGrossPerDay, TellerGrossPerDateRange } from "../../api/reports";
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
    const [spvrData2, setspvrData2] = useState([{ name: 'test' }])
    const [tellerData, settellerData] = useState([])
    const [Datedata, setDateData] = useState([{ drawDate: '02-28-2024' }, { drawDate: '02-29-2024' }])
    const [isfetching, Setisfetching] = useState(false);
    let TotalL2 = 0;
    let TotalL3 = 0;
    let TotalD4 = 0;
    let TotalP3 = 0;
    useEffect(() => {


        handleGetSpvr()
        handleGetData()
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



    const handleGetData = async () => {
        Setisfetching(true)
        try {
            let ApiResponse = await TellerGrossPerDateRange({
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
        handleGetTeller()


    }, [from, to])

    const onChangeFrom = (date, dateString) => {
        console.log(dateString);

        setFrom(dateString)

    };

    const onChangeTo = (date, dateString) => {

        setTo(dateString)

    };




    function loopDateRange(spvrId) {

        let currentDate = from;
        const columnElements = [];
        while (currentDate <= to) {
            // Do something with the current date
            const column = (
                <td className="MyTableBorder font2 font-bold text-center ">{moment(currentDate).format('MM-DD-YY')}</td>
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


    function displayTeller(spvrId) {
        const columnElements = [];
        {
            tellerData?.filter((entity) => {
                if (entity?.supervisor === spvrId) {
                    return entity
                }
            })?.map((item2, key2) => {

                const column = (
                    <tr key={key2}>
                    
                        <td colSpan={3} className="MyTableBorder font2 text-right">{item2?.fullName}</td>
                        <td className="MyTableBorder font2 text-center">{item2?.isActive == 1?'Active':'Inactive'}</td>
                        <td className="MyTableBorder font2 text-center">{item2?.created_at?.split(" ")[0]}</td>
                        <td className="MyTableBorder font2 text-center">{item2?.updated_at?.split(" ")[0]}</td>

                        {DisplayGrossPerDay(item2.id)}
                        <td className="MyTableBorder font2 font-bold">{disPlayTotalPerTeller(DisplayGrossPerDayRawData(item2.id))}</td>
                    </tr>
                );

                columnElements.push(column);


            })
        }

        return columnElements
    }

    function disPlayTotalPerTeller(data){

        let total =0;

      data.map((item,key)=>{
        total+=parseFloat(item);
        
      })
        


        return total


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
                       (<>
                        <td key={key} className="MyTableBorder font2  text-center">{item?.TotalOverAllGross}</td>
                        </>)
                        
                    )

                })
            );

            if (column.length == 0) {
                column = (
                    <td className="MyTableBorder font2  text-center">0</td>
                )
            }

       
            // Move to the next day
            columnElements.push(column);
            currentDate = moment(currentDate).add(1, 'days').format('yyyy-MM-DD')
        }

        return columnElements

    }


    
    function DisplayGrossPerDayRawData(tellerId) {

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
                       (item?.TotalOverAllGross)
                        
                    )

                })
            );

            if (column.length == 0) {
                column = (
                    0
                )
            }

       
            // Move to the next day
            columnElements.push(column);
            currentDate = moment(currentDate).add(1, 'days').format('yyyy-MM-DD')
        }

        return columnElements

    }


    function loopDateRangeTotal(spvrId) {

        let currentDate = from;
        const columnElements = [];
        while (currentDate <= to) {
            // Do something with the current date

            // Do something with the current date

            let totalPerDay = 0;
   
                data.filter((entity) => {


                    if (entity?.supervisor === spvrId && moment(currentDate).format("yyyy-MM-DD") == moment(entity?.created_at).format("yyyy-MM-DD")) {
                        return entity
                    }

                }).map((item, key) => {


                    totalPerDay += item?.TotalOverAllGross


                })
            


            const column = (
                <td className="MyTableBorder font2 font-bold text-center">{totalPerDay}</td>
            );

            columnElements.push(column);
            currentDate = moment(currentDate).add(1, 'days').format('yyyy-MM-DD')
        }

        return columnElements

    }


    function loopDateRangeTotalRaw(spvrId) {

        let currentDate = from;
        const columnElements = [];
        let total = 0;
        while (currentDate <= to) {
            // Do something with the current date

            // Do something with the current date


    
                data.filter((entity) => {


                    if (entity?.supervisor === spvrId && moment(currentDate).format("yyyy-MM-DD") == moment(entity?.created_at).format("yyyy-MM-DD")) {
                        return entity
                    }

                }).map((item, key) => {


                    total += item?.TotalOverAllGross


                })
       
            currentDate = moment(currentDate).add(1, 'days').format('yyyy-MM-DD')
        }

        return total

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




                


                    <div className="test" style={{ overflow: 'scroll' }} >



                        <table id="MyTable">
                            <thead>
                                <tr>
                                    <th className="MyTableBorder font2 font-bold text-center" colSpan={getDateDifference() + 3}> {area.toLocaleUpperCase()} DAILY GROSS</th>
                                </tr>
                                <tr>
                                    <td  className="MyTableBorder font2 font-bold text-center" colSpan={1}>From</td>
                                    <td className="MyTableBorder font2 font-bold text-center" colSpan={getDateDifference() + 2}>{moment(from).format('MMM-DD-YY')}</td>
                                </tr>
                                <tr>
                                    <td className="MyTableBorder font2 font-bold text-center" colSpan={1}>To</td>
                                    <td className="MyTableBorder font2 font-bold text-center" colSpan={getDateDifference() + 2}>{moment(to).format('MMM-DD-YY')}</td>
                                </tr>
                                <tr>
                                    <td className="MyTableBorder font2 font-bold text-center" colSpan={1}>Date Generated</td>
                                    <td className="MyTableBorder font2 font-bold text-center" colSpan={getDateDifference() + 2}>{moment().format('YYYY-MM-DD HH:mm')}</td>
                                </tr>

                                <tr>
                                    <td colSpan={getDateDifference() + 3} className="MyTableBorder font2 font-bold text-center"></td>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    spvrData?.map((item, key) => {

                                        return (
                                            <>
                                                <tr>
                                                    <td colSpan={2} className="MyTableBorder font2 font-bold">{item?.username}</td>
                                                    <td className="MyTableBorder font2 font-bold">Teller</td>
                                                    <td className="MyTableBorder font2 font-bold text-center">IsActive</td>
                                                    <td className="MyTableBorder font2 font-bold text-center">Date Created</td>
                                                    <td className="MyTableBorder font2 font-bold text-center">Date Updated</td>
                                                    {
                                                        loopDateRange(item.id)
                                                    }
                                                     <td className="MyTableBorder font2 font-bold text-center">Total</td>

                                                </tr>


                                                {displayTeller(item.id)}

                                                <tr>
                                                    <td colSpan={6} className="text-right font-bold ">
                                                        TOTAL
                                                    </td>
                                                    {
                                                        loopDateRangeTotal(item.id)
                                                    }

                                                    <td className="MyTableBorder font2 font-bold text-center">{loopDateRangeTotalRaw(item.id)}</td>


                                                </tr>

                                            </>
                                        )

                                    })
                                }


                            </tbody>

                        </table>

                    </div>
                </> : <div className="h-screen text-center noPrint">
                    <Spin size="large" tip='Generating...' className="mt-20" />
                </div>
            }
        </>


    )




}
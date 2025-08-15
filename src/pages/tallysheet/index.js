import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { GetTallyPerDraw } from "../api/tally";
import { TallysheetData,TallysheetDataS4R } from "../components/TallysheetData";
import { Button, Radio, Spin } from "antd";
import { PrinterOutlined, RollbackOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";


export default function Home() {
    const [from, setFrom] = useState(moment().format('yyyy-MM-DD'))
    const [to, setTo] = useState(moment().add(1, 'days').format('yyyy-MM-DD'))
    const router = useRouter();
    const { drawTime } = router?.query;
    const { drawId } = router?.query;
    const [isfetching, Setisfetching] = useState(true);
    const area = Cookies.get("username")

    const { isOffline } = router?.query;
    const [data, setData] = useState([])
    let TotalRambolitoBetWin = 0;
    let TotalL3 = 0;
    let TotalD4 = 0;
    let TotalP3 = 0;
    useEffect(() => {


        handleGetTallyPerDraw()
    }, [])





    const handleGetTallyPerDraw = async () => {

        try {
            let ApiResponse = await GetTallyPerDraw(
                {
                    from: from,
                    to: to,
                    drawId: drawId,
                    isOffline: isOffline
                }
            )

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


    function getRambolitoCombination(betNo, combination) {


        return combination?.replace(/'/g, '')?.replace(/,,/g, ',')?.split(',').length - 2
    }

    // function TallysheetComponent() {

    //     return TallysheetData?.map((item, key) => {
    //         return (
    //             <div className="grid grid-cols-3  MyBorder  " key={key}>
    //                 <div className="text-sm font-semibold ">{item}:|{'ss'}</div>
    //                 <div className="text-sm  text-right col-span-2 ">{(0)?.toFixed(2)?.replace(/\d(?=(\d{3})+\.)/g, '$&,')}</div>
    //             </div>
    //         )

    //     })





    // }



    function getRambolitoGross(betNo) {

        let total = 0;
        data?.filter((filter) => {


            // console.log(filter?.CombiNo?.indexOf(columnData[index]));

            if (filter?.CombiNo?.indexOf(betNo) > 0 && filter?.betCode == 'R') {
                return filter
            }
            // if(filter?.betNo == columnData[index] && filter?.betCode =='R'){
            //     filter
            // }

        })?.map((item2, key2) => {
            total += (parseFloat(item2?.TotalBetsPerNo / getRambolitoCombination(item2?.betNo, item2?.CombiNo)))
        })

        return parseFloat(total)?.toFixed(2);;

    }

    function getRambolitoGrossR(betNo) {

        let total = 0;
        data?.filter((filter) => {


            // console.log(filter?.CombiNo?.indexOf(columnData[index]));

            if (filter?.CombiNo?.indexOf(betNo) > 0 && filter?.betCode == 'R') {
                return filter
            }
            // if(filter?.betNo == columnData[index] && filter?.betCode =='R'){
            //     filter
            // }

        })?.map((item2, key2) => {
            total += (parseFloat(item2?.TotalBetsPerNo / getRambolitoCombination(item2?.betNo, item2?.CombiNo)))
        })

        return parseFloat(total)?.toFixed(2);;

    }




    function getRambolitoGrossS4R(betNo) {

        let total = 0;
        data?.filter((filter) => {


            // console.log(filter?.CombiNo?.indexOf(columnData[index]));

            if (filter?.CombiNo?.indexOf(betNo) > 0 && filter?.betCode == 'S4R') {
                return filter
            }
            // if(filter?.betNo == columnData[index] && filter?.betCode =='R'){
            //     filter
            // }

        })?.map((item2, key2) => {
            total += (parseFloat(item2?.TotalBetsPerNo / getRambolitoCombination(item2?.betNo, item2?.CombiNo)))
        })

        return parseFloat(total)?.toFixed(2);;

    }

    const renderColumns = () => {

        const columns = 6;
        const itemsPerColumn = Math.ceil(TallysheetData.length / columns);

        const columnElements = [];
        for (let i = 0; i < columns; i++) {
            const start = i * itemsPerColumn;
            const end = start + itemsPerColumn;
            const columnData = TallysheetData.slice(start, end);

            const column = (
                <div key={i} className="column">
                    {TallysheetData.map((item, index) => {
                        if (columnData[index] && getRambolitoGross(columnData[index]) > 0) {
                            return (
                                <div className="item grid grid-cols-3  MyBorder  " key={index}>
                                    <div className="text-sm font-semibold ">{columnData[index]}:|</div>
                                    <div className="text-sm  text-right col-span-2 "> {parseFloat(getRambolitoGross(columnData[index]))?.toFixed(2)?.replace(/\d(?=(\d{3})+\.)/g, '$&,')}</div>
                                </div>
                            )
                        }

                    })}
                </div>
            );

            columnElements.push(column);
        }

        return columnElements;
    }



    const renderColumnsS4R = () => {

        const columns = 6;
        const itemsPerColumn = Math.ceil(TallysheetDataS4R.length / columns);

        const columnElements = [];
        for (let i = 0; i < columns; i++) {
            const start = i * itemsPerColumn;
            const end = start + itemsPerColumn;
            const columnData = TallysheetDataS4R.slice(start, end);

            const column = (
                <div key={i} className="column">
                    {TallysheetDataS4R.map((item, index) => {
                        
                        if (columnData[index] && getRambolitoGrossS4R(columnData[index]) > 0) {
                            return (
                                <div className="item grid grid-cols-3  MyBorder  " key={index}>
                                    <div className="text-sm font-semibold ">{columnData[index]}:|</div>
                                    <div className="text-sm  text-right col-span-2 "> {parseFloat(getRambolitoGrossS4R(columnData[index]))?.toFixed(2)?.replace(/\d(?=(\d{3})+\.)/g, '$&,')}</div>
                                </div>
                            )
                        }

                    })}
                </div>
            );

            columnElements.push(column);
        }

        return columnElements;
    }

    const renderColumnsR = () => {

        const columns = 6;
        const itemsPerColumn = Math.ceil(TallysheetData.length / columns);

        const columnElements = [];
        for (let i = 0; i < columns; i++) {
            const start = i * itemsPerColumn;
            const end = start + itemsPerColumn;
            const columnData = TallysheetData.slice(start, end);

            const column = (
                <div key={i} className="column">
                    {TallysheetData.map((item, index) => {
                        if (columnData[index] && getRambolitoGrossR(columnData[index]) > 0) {
                            return (
                                <div className="item grid grid-cols-3  MyBorder  " key={index}>
                                    <div className="text-sm font-semibold ">{columnData[index]}:|</div>
                                    <div className="text-sm  text-right col-span-2 "> {parseFloat(getRambolitoGrossR(columnData[index]))?.toFixed(2)?.replace(/\d(?=(\d{3})+\.)/g, '$&,')}</div>
                                </div>
                            )
                        }

                    })}
                </div>
            );

            columnElements.push(column);
        }

        return columnElements;
    }


    const renderColumns2 = (betCode) => {

        const columns = 6;
        const itemsPerColumn = Math.ceil(data?.filter((item, key) => {
            if (item?.betCode == betCode) {
                return item
            }
        }).length / columns);

        const columnElements = [];
        for (let i = 0; i < columns; i++) {
            const start = i * itemsPerColumn;
            const end = start + itemsPerColumn;
            const columnData = data?.filter((item, key) => {
                if (item?.betCode == betCode) {
                    return item
                }
            })?.slice(start, end);

            const column = (
                <div key={i} className="column">
                    {
                        data?.filter((item, key) => {
                            if (item?.betCode == betCode) {
                                return item
                            }
                        })?.map((item, key) => {



                            if (item?.betCode == betCode) {
                                console.log(columnData, key);

                                if (columnData[key]?.betNo && columnData[key]?.TotalBetsPerNo > 0) {
                                    return (
                                        <div className="item grid grid-cols-3  MyBorder  " key={key}>
                                            <div className="text-sm font-semibold ">{columnData[key]?.betNo}:|</div>
                                            <div className="text-sm  text-right col-span-2 ">{columnData[key]?.TotalBetsPerNo}</div>
                                        </div>
                                    )
                                }

                            }

                        })

                    }
                </div>
            );

            columnElements.push(column);
        }

        return columnElements;
    }

    useEffect(() => {

        setTimeout(() => {

            Setisfetching(false)

        }, 5000)

    }, [])

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



            {
                !isfetching ? <> <div className="w-creen">



                    <div className="book" >
                        {
                            drawTime == 14 || drawTime == 17 ? <>   <div className="page">

                                <div className="subpage">

                                    <h1 className="text-sm text-center font-semibold">
                                        {area?.toLocaleUpperCase()} GENERAL TALLY SHEET{isOffline == 0 ? ` (Online)` : `(Offline)`}
                                    </h1>
                                    <h1 className="text-sm text-center font-normal">
                                        {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
                                    </h1>
                                    <h1 className="text-sm text-center font-normal">
                                        Time Generated:<span className="font-semibold">{moment().format('HH:m')}</span>
                                    </h1>
                                    <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">S2</span></h1>

                                    <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('S2')}</span></h1>


                                    <div className="columns-container">
                                        {renderColumns2('S2')}
                                    </div>





                                </div>

                            </div>
                                <div className="page">

                                    <div className="subpage">

                                        <h1 className="text-sm text-center font-normal">
                                            General Tallysheet{isOffline == 0 ? ` (Online)` : `(Offline)`}
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">
                                            {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">T</span></h1>

                                        <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('T')}</span></h1>


                                        <div className="columns-container">
                                            {renderColumns2('T')}
                                        </div>
                                    </div>

                                </div>
                                <div className="page">

                                    <div className="subpage">

                                        <h1 className="text-sm text-center font-normal">
                                            General Tallysheet{isOffline == 0 ? ` (Online)` : `(Offline)`}
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">
                                            {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">R</span></h1>

                                        <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('R')}</span></h1>



                                        <div className="columns-container">
                                            {renderColumns()}
                                        </div>

                                        <div className="box gap-x-2 gap-y-2">
     
                                        </div>
                                    </div>

                                </div></> : ''
                        }


                        {
                            drawTime != 14 && drawTime != 17  ? <>
                                {/* S2,S3 */}
                                <div className="page">

                                    <div className="subpage">

                                        <h1 className="text-sm text-center font-semibold">
                                            {area?.toLocaleUpperCase()} GENERAL TALLY SHEET{isOffline == 0 ? ` (Online)` : `(Offline)`}
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">
                                            {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">
                                            Time Generated:<span className="font-semibold">{moment().format('HH:m')}</span>
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">S2</span></h1>

                                        <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('S2')}</span></h1>


                                        <div className="columns-container">
                                            {renderColumns2('S2')}
                                        </div>

                                    </div>

                                </div>


                                <div className="page">

                                    <div className="subpage">

                                        <h1 className="text-sm text-center font-semibold">
                                            {area?.toLocaleUpperCase()} GENERAL TALLY SHEET{isOffline == 0 ? ` (Online)` : `(Offline)`}
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">
                                            {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">
                                            Time Generated:<span className="font-semibold">{moment().format('HH:m')}</span>
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">T</span></h1>

                                        <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('T')}</span></h1>


                                        <div className="columns-container">
                                            {renderColumns2('T')}
                                        </div>

                                    </div>

                                </div>

                                <div className="page">

                                    <div className="subpage">

                                        <h1 className="text-sm text-center font-normal">
                                            General Tallysheet{isOffline == 0 ? ` (Online)` : `(Offline)`}
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">
                                            {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
                                        </h1>
                                        <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">R</span></h1>

                                        <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('R')}</span></h1>



                                        <div className="columns-container">
                                            {renderColumnsR()}
                                        </div>

                                        <div className="box gap-x-2 gap-y-2">
                                        </div>



                                    </div>

                                </div></> : ''
                        }


                        {
                            drawTime == 21 && moment().day() != 0 ?
                                <>

                                    {/* S2,L3 */}

                                    <div className="page">

                                        <div className="subpage">

                                            <h1 className="text-sm text-center font-semibold">
                                                {area?.toLocaleUpperCase()} GENERAL TALLY SHEET{isOffline == 0 ? ` (Online)` : `(Offline)`}
                                            </h1>
                                            <h1 className="text-sm text-center font-normal">
                                                {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
                                            </h1>
                                            <h1 className="text-sm text-center font-normal">
                                                Time Generated:<span className="font-semibold">{moment().format('HH:m')}</span>
                                            </h1>
                                            <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">S2</span></h1>

                                            <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('S2')}</span></h1>


                                            <div className="columns-container">
                                                {renderColumns2('S2')}
                                            </div>

                                        </div>

                                    </div>
                                    <div className="page">

                                        <div className="subpage">

                                            <h1 className="text-sm text-center font-normal">
                                                General Tallysheet{isOffline == 0 ? ` (Online)` : `(Offline)`}
                                            </h1>
                                            <h1 className="text-sm text-center font-normal">
                                                {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
                                            </h1>
                                            <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">T</span></h1>

                                            <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('T')}</span></h1>


                                            <div className="columns-container">
                                                {renderColumns2('T')}
                                            </div>

                                        </div>

                                    </div>
                                    <div className="page">

                                        <div className="subpage">

                                            <h1 className="text-sm text-center font-normal">
                                                General Tallysheet{isOffline == 0 ? ` (Online)` : `(Offline)`}
                                            </h1>
                                            <h1 className="text-sm text-center font-normal">
                                                {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
                                            </h1>
                                            <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">R</span></h1>

                                            <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('R')}</span></h1>



                                            <div className="columns-container">
                                                {renderColumns()}
                                            </div>

                                            <div className="box gap-x-2 gap-y-2">


                                            </div>



                                        </div>

                                    </div>


                                    {/* END S2,L3 */}

                                    <div className="page">

                                        <div className="subpage">

                                            <h1 className="text-sm text-center font-normal">
                                                General Tallysheet{isOffline == 0 ? ` (Online)` : `(Offline)`}
                                            </h1>
                                            <h1 className="text-sm text-center font-normal">
                                                {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
                                            </h1>
                                            <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">S4T</span></h1>

                                            <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('S4T')}</span></h1>



                                            <div className="columns-container">
                                                {renderColumns2('S4T')}
                                            </div>


                                        </div>

                                    </div>


                                    <div className="page">

<div className="subpage">

    <h1 className="text-sm text-center font-normal">
        General Tallysheet{isOffline == 0 ? ` (Online)` : `(Offline)`}
    </h1>
    <h1 className="text-sm text-center font-normal">
        {`${from}:`} <span className="font-semibold">{drawTime > 12 ? `${drawTime - 12}PM` : `${drawTime}AM`}</span>
    </h1>
    <h1 className="text-sm text-center font-normal">GAME: <span className="font-semibold">S4R</span></h1>

    <h1 className="text-sm text-center font-normal">TOTAL: <span className="font-semibold"> {GetTotal('S4R')}</span></h1>



    <div className="columns-container">
        {renderColumnsS4R('S4R')}
    </div>


</div>

</div>
                                </> : ''
                        }







                    </div>

                </div></>
                    : <div className="h-screen text-center noPrint">
                        <Spin size="large" tip='Generating...' className="mt-20" />
                    </div>
            }

        </>

    )




}
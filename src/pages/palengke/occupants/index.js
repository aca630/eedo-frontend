import { BookOutlined, BuildOutlined, CalendarOutlined, CarOutlined, CarTwoTone, DeleteOutlined, DownOutlined, EditOutlined, GroupOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined, ShopOutlined, ShoppingCartOutlined, ShopTwoTone, SnippetsOutlined, UserAddOutlined, UserDeleteOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Form, Input, InputNumber, Menu, Modal, Popconfirm, Select, Space, Spin, Table, Tag } from "antd";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../layouts";
import { ToastContainer, toast } from 'react-toastify';
import moment from "moment";
import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dynamic from "next/dynamic";
import Link from "next/link";
import { GetArea } from "../../api/area";
import { deleteSection, GetSection, postSection, putSection } from "../../api/section";
import { GetAreaAndSection } from "../../api/reports";
import { deleteOccupant, GetOccupant, postOccupant, putOccupant } from "../../api/occupant";
import { GetCollector } from "../../api/collector";
import QRCode from "react-qr-code";
// Dynamically import only on client
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

dayjs.extend(customParseFormat);

export default function Home() {
    const [isfetching, Setisfetching] = useState(false);
    const [data, setData] = useState([])
    const [AreaData, setAreaData] = useState([])
    const [collectorData, setcollectorData] = useState([])
    const [openAdd, setOpenAdd] = useState(false);
    const [confirmLoadingAdd, setConfirmLoadingAdd] = useState(false);
    const [form] = Form.useForm();
    const [confirmLoadingEdit, setConfirmLoadingEdit] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [CurrentRow, setCurrentRow] = useState(null);
    const [formEdit] = Form.useForm();
    const [section_id, set_section_id] = useState(null);
    const [collector_id, set_collector_id] = useState(null);
    const [show_modal_qr, set_show_modal_qr] = useState(false);
    const handleCancelAdd = () => {
        setOpenAdd(false);
    }
    const showModalAdd = () => {
        setOpenAdd(true);
    };



    const handleGetData = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetOccupant()

            setData(ApiResponse?.data?.data)
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
    }




    const handleGetArea = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetAreaAndSection()

            setAreaData(ApiResponse?.data?.data)
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
    }


    const handleGetCollector = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetCollector()

            setcollectorData(ApiResponse?.data?.data)
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
    }



    const onFinish = async (values) => {
        try {

            let ApiResponse = await postOccupant({ ...values, section_id: section_id, collector_id: collector_id })
            Setisfetching(true)
            toast.success('Section saved!', {
                position: "top-center",
            })
            handleGetData()
            form.resetFields();
            setOpenAdd(false);
        }
        catch (error) {

            console.log(error);


            toast.error('Saving Failed!', {
                position: "top-center",
            })


        }

        Setisfetching(false)

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onFinishFailedEdit = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    //DELETE
    const handleDelete = async (record) => {
        try {

            let ApiResponse = await deleteOccupant(record?.id)
            toast.success('Record deleted!', {
                position: "top-center",
            })
            handleGetData();
        }
        catch (error) {
            if (error?.response?.status == 401) {
                toast.error('UnAuthenticated.', {
                    position: "top-center",
                })
                Cookies.remove('accessToken');
                setTimeout(() => {
                    router.push('/')
                }, 2000);
            } else {
                toast.error('Operation error.', {
                    position: "top-center",
                })
            }
            console.log('Get Coordinator Error: ', error?.response);

        }
    };


    //EDIT
    const onFinishEdit = async (values) => {
        try {
            let ApiResponse = await putOccupant({
                ...values, section_id: section_id, collector_id: collector_id, id: CurrentRow?.id
            })
            toast.success('Record updated.', {
                position: "top-center",
            })
            formEdit.resetFields();
            setShowModalEdit(false);
            handleGetData();
        }
        catch (error) {
            if (error?.response?.status == 401) {

                toast.error('UnAuthenticated.', {
                    position: "top-center",
                })
                Cookies.remove('accessToken');
                setTimeout(() => {
                    router.push('/')
                }, 2000);
            } else {
                toast.error('Operation error.', {
                    position: "top-center",
                })
            }
            console.log('Get Coordinator Error: ', error);

        }



    };

    const handleCloseModalEdit = () => {
        setShowModalEdit(false);
    }

    const handleCloseModal_qr = () => {
        set_show_modal_qr(false);
        setCurrentRow(null);
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


    const columns = [

        {
            title: 'Area  Name',
            dataIndex: 'area_name',
            key: 'area_name',
            render: (dom, entity) => {
                return dom

            }
        },

        {
            title: 'Section  Name',
            dataIndex: 'section_name',
            key: 'section_name',
            render: (dom, entity) => {
                return dom

            }
        },

        {
            title: 'Stall No.',
            dataIndex: 'stall_no',
            key: 'stall_no',
            render: (dom, entity) => {
                return (
                    <Button type="primary" onClick={(() => {
                        setCurrentRow(entity)
                        set_show_modal_qr(true)
                    })}>{dom}</Button>
                )

            }
        },

        {
            title: 'Awardee Name',
            dataIndex: 'awardee_name',
            key: 'awardee_name',
            render: (dom, entity) => {
                return dom

            }
        },
        {
            title: 'Occupant Name',
            dataIndex: 'occupant_name',
            key: 'occupant_name',
            render: (dom, entity) => {
                return dom

            }
        },

        {
            title: 'Collector Name',

            dataIndex: 'collector_name',
            key: 'collector_name',
            render: (dom, entity) => {
                return dom

            }
        },
        {
            title: 'W/BUSINESS PERMIT',

            dataIndex: 'is_with_business_permit',
            key: 'is_with_business_permit',
            render: (dom, entity) => {

                if (dom == 1) {
                    return <Tag color="green">Yes</Tag>
                }
                else {
                    return <Tag color="red">No</Tag>
                }


            }
        },
        {
            title: 'Rental Fee/month',
            dataIndex: 'rent_per_month',
            key: 'rent_per_month',
            render: (dom, entity) => {
                return dom

            }
        },

        {
            title: `Actions`,
            dataIndex: 'name',
            valueType: 'option',
            fixed: 'right',
            width: 180,
            render: (_, record) => (
                <Dropdown.Button
                    overlay={
                        <Menu>
                            {items.map((item) => {
                                return (
                                    <Menu.Item key={item.key}>
                                        {item.popconfirmTitle ? (
                                            <Popconfirm
                                                title={item.popconfirmTitle}
                                                onConfirm={() => handleDelete(record)}
                                                okText={`Yes`}
                                                cancelText={`No`}
                                            >
                                                <a>{item.label}</a>
                                            </Popconfirm>
                                        ) : (
                                            <a onClick={() => item.onClick(record)}>{item.label}</a>
                                        )}
                                    </Menu.Item>
                                );
                            })}
                        </Menu>

                    }
                >
                    Actions
                </Dropdown.Button>
            )
        },


    ];


    //ACTIONS TABLE
    const items = [

        {
            key: 'edit',
            label: `Edit`,
            onClick: async (record) => {
                formEdit.setFieldsValue({
                    stall_no: record.stall_no,
                    awardee_name: record.awardee_name,
                    occupant_name: record.occupant_name,
                    is_rentee: record.is_rentee,
                    is_with_business_permit: record.is_with_business_permit,
                    is_with_water_electricity: record.is_with_water_electricity,


                })
                setCurrentRow(record)
                setShowModalEdit(true)
            },

            visible: true,
        },

        {
            key: 'delete',
            label: `Delete`,
            onClick: (record) => {
                // handleRemove(record.id);
                actionRef.current?.reloadAndRest?.();
            },
            visible: true,
            popconfirmTitle: `Are you sure?`,
        },

    ];



    useEffect(() => {
        handleGetData()
        handleGetArea();
        handleGetCollector()
    }, []);

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
                            <h1 className="text-center text-purple-600">Occupants</h1>

                            <Button
                                onClick={showModalAdd}
                                type="primary"
                                style={{
                                    marginBottom: 16,
                                }}
                                icon={<PlusOutlined />}
                            >
                                New
                            </Button>




                            <Table dataSource={data} columns={columns} loading={isfetching} scroll={{
                                x: 800,
                            }} />

                        </div>


                    </>
                    : <div className="h-screen text-center noPrint">
                        <Spin size="large" tip='Generating...' className="mt-20" />
                    </div>
            }




            <Modal
                title="New occupant"
                open={openAdd}
                confirmLoading={confirmLoadingAdd}
                onCancel={handleCancelAdd}
                width={800}
                footer={[]}

            >


                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    // style={{
                    //     maxWidth: 400,
                    // }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"

                >

                    <Form.Item
                        label="Stall no."
                        name="stall_no"

                        rules={[
                            {
                                required: true,
                                message: 'Field required',
                            },
                        ]}
                    >
                        <Input size="large" onInput={e => e.target.value = e.target.value.toUpperCase()} />

                    </Form.Item>

                    <Form.Item
                        label="Awardee name"
                        name="awardee_name"

                        rules={[
                            {
                                required: true,
                                message: 'Field required',
                            },
                        ]}
                    >
                        <Input size="large" onInput={e => e.target.value = e.target.value.toUpperCase()} />

                    </Form.Item>

                    <Form.Item
                        label="Occupant ame"
                        name="occupant_name"

                        rules={[
                            {
                                required: true,
                                message: 'Field required',
                            },
                        ]}
                    >
                        <Input size="large" onInput={e => e.target.value = e.target.value.toUpperCase()} />

                    </Form.Item>

                    <Form.Item
                        label="Is rentee"
                        name="is_rentee"

                        rules={[
                            {
                                required: true,
                                message: 'Field required',
                            },
                        ]}
                    >
                        <Select showSearch size='large' name="is_rentee" style={{
                            width: '100%',
                        }} >
                            <Select.Option value={0}>No</Select.Option>
                            <Select.Option value={1}>Yes</Select.Option>
                        </Select>

                    </Form.Item>


                    <Form.Item
                        label="With business permit"
                        name="is_with_business_permit"

                        rules={[
                            {
                                required: true,
                                message: 'Field required',
                            },
                        ]}
                    >
                        <Select showSearch size='large' name="is_with_business_permit" style={{
                            width: '100%',
                        }} >
                            <Select.Option value={0}>No</Select.Option>
                            <Select.Option value={1}>Yes</Select.Option>
                        </Select>

                    </Form.Item>


                    <Form.Item
                        label="With water/electricity"
                        name="is_with_water_electricity"

                        rules={[
                            {
                                required: true,
                                message: 'Field required',
                            },
                        ]}
                    >
                        <Select showSearch size='large' name="is_with_water_electricity" style={{
                            width: '100%',
                        }} >
                            <Select.Option value={0}>None both</Select.Option>
                            <Select.Option value={1}>Water only</Select.Option>
                            <Select.Option value={2}>Electricity only</Select.Option>
                            <Select.Option value={3}>Yes both</Select.Option>
                        </Select>

                    </Form.Item>

                    <Form.Item
                        label="Area / Section / Rental Fee"
                        name="section_id"
                        rules={[
                            {
                                required: true,
                                message: 'Field required',
                            },
                        ]}
                    >
                        <Select showSearch size='large' name="section_id" onChange={(e) => {

                            console.log(e);

                            set_section_id(AreaData?.filter((item) => {
                                if (e == item?.section_id) {
                                    return item?.section_id
                                }
                            })?.[0]?.section_id)
                        }} style={{
                            width: '100%',
                        }} >

                            {
                                AreaData?.map((item, key) => {

                                    return (
                                        <Select.Option key={key} value={item?.section_id}>{`${item?.area_name} / ${item?.section_name ?? ''} / ${item?.rent_per_month ?? ''}`}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>



                    <Form.Item
                        label="Collector"
                        name="collector_id"
                        rules={[
                            {
                                required: true,
                                message: 'Field required',
                            },
                        ]}
                    >
                        <Select showSearch size='large' name="collector_id" onChange={(e) => {
                            set_collector_id(collectorData?.filter((item) => {
                                if (e == item?.id) {
                                    return item?.id
                                }
                            })?.[0]?.id)
                        }} style={{
                            width: '100%',
                        }} >
                            {
                                collectorData?.map((item, key) => {

                                    return (
                                        <Select.Option key={key} value={item?.id}>{`${item?.full_name}`}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>





                    <Form.Item
                        wrapperCol={{
                            span: 24,
                        }}

                    >
                        <Button style={{
                            width: '100%',
                        }} type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>



            </Modal>





            {
                showModalEdit ?
                    <>     <Modal
                        title="Edit Section"
                        open={showModalEdit}
                        // confirmLoading={confirmLoadingAdd}
                        onCancel={handleCloseModalEdit}

                        width={800}
                        footer={[]}
                    >


                        <Form
                            form={formEdit}
                            name="basic"
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 18,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinishEdit}
                            onFinishFailed={onFinishFailedEdit}
                            autoComplete="off"
                        >


                            <Form.Item
                                label="Stall no."
                                name="stall_no"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Field required',
                                    },
                                ]}
                            >
                                <Input size="large" onInput={e => e.target.value = e.target.value.toUpperCase()} />

                            </Form.Item>

                            <Form.Item
                                label="Awardee name"
                                name="awardee_name"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Field required',
                                    },
                                ]}
                            >
                                <Input size="large" onInput={e => e.target.value = e.target.value.toUpperCase()} />

                            </Form.Item>

                            <Form.Item
                                label="Occupant ame"
                                name="occupant_name"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Field required',
                                    },
                                ]}
                            >
                                <Input size="large" onInput={e => e.target.value = e.target.value.toUpperCase()} />

                            </Form.Item>

                            <Form.Item
                                label="Is rentee"
                                name="is_rentee"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Field required',
                                    },
                                ]}
                            >
                                <Select showSearch size='large' name="is_rentee" style={{
                                    width: '100%',
                                }} >
                                    <Select.Option value={0}>No</Select.Option>
                                    <Select.Option value={1}>Yes</Select.Option>
                                </Select>

                            </Form.Item>


                            <Form.Item
                                label="With business permit"
                                name="is_with_business_permit"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Field required',
                                    },
                                ]}
                            >
                                <Select showSearch size='large' name="is_with_business_permit" style={{
                                    width: '100%',
                                }} >
                                    <Select.Option value={0}>No</Select.Option>
                                    <Select.Option value={1}>Yes</Select.Option>
                                </Select>

                            </Form.Item>


                            <Form.Item
                                label="With water/electricity"
                                name="is_with_water_electricity"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Field required',
                                    },
                                ]}
                            >
                                <Select showSearch size='large' name="is_with_water_electricity" style={{
                                    width: '100%',
                                }} >
                                    <Select.Option value={0}>None both</Select.Option>
                                    <Select.Option value={1}>Water only</Select.Option>
                                    <Select.Option value={2}>Electricity only</Select.Option>
                                    <Select.Option value={3}>Yes both</Select.Option>
                                </Select>

                            </Form.Item>

                            <Form.Item
                                label="Area / Section / Rental Fee"
                                name="section_id"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Field required',
                                    },
                                ]}
                            >
                                <Select showSearch size='large' name="section_id" onChange={(e) => {

                                    console.log(e);

                                    set_section_id(AreaData?.filter((item) => {
                                        if (e == item?.section_id) {
                                            return item?.section_id
                                        }
                                    })?.[0]?.section_id)
                                }} style={{
                                    width: '100%',
                                }} >

                                    {
                                        AreaData?.map((item, key) => {

                                            return (
                                                <Select.Option key={key} value={item?.section_id}>{`${item?.area_name} / ${item?.section_name ?? ''} / ${item?.rent_per_month ?? ''}`}</Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>



                            <Form.Item
                                label="Collector"
                                name="collector_id"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Field required',
                                    },
                                ]}
                            >
                                <Select showSearch size='large' name="collector_id" onChange={(e) => {
                                    set_collector_id(collectorData?.filter((item) => {
                                        if (e == item?.id) {
                                            return item?.id
                                        }
                                    })?.[0]?.id)
                                }} style={{
                                    width: '100%',
                                }} >
                                    {
                                        collectorData?.map((item, key) => {

                                            return (
                                                <Select.Option key={key} value={item?.id}>{`${item?.full_name}`}</Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>





                            <Divider />
                            <Form.Item
                                wrapperCol={{
                                    span: 24,
                                }}

                            >
                                <Button type="primary" style={{
                                    width: '100%',
                                }} size='large' htmlType="submit">
                                    Update
                                </Button>
                            </Form.Item>
                        </Form>



                    </Modal></> : ''
            }





            {
                show_modal_qr ?
                    <>     <Modal
                        title=""
                        open={show_modal_qr}
                        // confirmLoading={confirmLoadingAdd}
                        onCancel={handleCloseModal_qr}

                        // width={00}
                        footer={[]}
                    >
                        <div clas>

                            {/* <QRCode
                                errorLevel="H"
                                value={CurrentRow?.stall_no}
                                icon="/logo.jpg"

                            /> */}


                            <QRCode value={CurrentRow?.stall_no} size={200} level="H" includeMargin={true} />


                            <h1>{CurrentRow?.stall_no}</h1>

                            <h1>{CurrentRow?.occupant_name}</h1>



                        </div>

                    </Modal></> : ''
            }



            <ToastContainer />
        </Layout>


    )

}
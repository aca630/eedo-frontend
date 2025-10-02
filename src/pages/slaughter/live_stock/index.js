import { BookOutlined, BuildOutlined, CalendarOutlined, CarOutlined, CarTwoTone, DeleteOutlined, DownOutlined, EditOutlined, GroupOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined, ShopOutlined, ShoppingCartOutlined, ShopTwoTone, SnippetsOutlined, UserAddOutlined, UserDeleteOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Form, Input, Menu, Modal, Popconfirm, Select, Space, Spin, Table, Tag } from "antd";
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
import { deleteLivestock, GetLivestock, postLivestock, putLivestock } from "../../api/livestock"; //tatawagin ang mga function sa api folder na livestock

// Dynamically import only on client
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

dayjs.extend(customParseFormat);

export default function Home() {
    const [isfetching, Setisfetching] = useState(false);
    const [data, setData] = useState([])
    const [openAdd, setOpenAdd] = useState(false);
    const [confirmLoadingAdd, setConfirmLoadingAdd] = useState(false);
    const [form] = Form.useForm();
    const [confirmLoadingEdit, setConfirmLoadingEdit] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [CurrentRow, setCurrentRow] = useState(null);
    const [formEdit] = Form.useForm();

    const handleCancelAdd = () => {
        setOpenAdd(false);
    }
    const showModalAdd = () => {
        setOpenAdd(true);
    };



//ang function na to ay para kunin ang data sa database table na livestock
    const handleGetData = async () => {
        Setisfetching(true)

        try {

            let ApiResponse = await GetLivestock()

            setData(ApiResponse?.data?.data)
            // settotalTransaction(ApiResponse?.data?.data[4][0]);

        } catch (error) {

            console.log('Error getting data: ', error);
        }
        Setisfetching(false)
    }



//ang function na to ay para magpost ng data sa database table na livestock
//ang ibig sabihin ng postLivestock({ ...values }) ay kukunin nya lahat ng laman ng form pagka submit
    const onFinish = async (values) => {
        try {

            let ApiResponse = await postLivestock({ ...values })
            Setisfetching(true)
            toast.success('Livestock saved!', {
                position: "top-center",
            })
            handleGetData();
            form.resetFields();
            setOpenAdd(false);
        }
        catch (error) {

            toast.error('Saving Livestock charges Failed!', {
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
        await deleteLivestock(record?.id);
        toast.success('Record deleted!', {
        position: "top-center",
        });
        handleGetData(); // refresh table
    } catch (error) {
        if (error?.response?.status === 401) {
        toast.error('UnAuthenticated.', { position: "top-center" });
        Cookies.remove('accessToken');
        setTimeout(() => {
            router.push('/');
        }, 2000);
        } else {
        toast.error('Delete failed!', {
            position: "top-center",
        });
        }
        console.log('Delete Error: ', error?.response);
    }
    };

<Menu.Item key="delete">
  <Popconfirm
    title="Are you sure to delete this record?"
    okText="Yes"
    cancelText="No"
    onConfirm={() => handleDelete(record)}
  >
    <a>Delete</a>
  </Popconfirm>
</Menu.Item>



    //EDIT
    const onFinishEdit = async (values) => {
    try {
        await putLivestock({
        ...values,
        id: CurrentRow?.id,
        });
        toast.success('Record updated.', { position: "top-center" });
        formEdit.resetFields();
        setShowModalEdit(false);
        handleGetData(); // refresh table
    } catch (error) {
        toast.error('Update failed!', { position: "top-center" });
        console.log('Update Error:', error?.response);
    }
    };


    const handleCloseModalEdit = () => {
        setShowModalEdit(false);
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
  title: '#',
  key: 'index',
  render: (text, record, index) => `${index + 1}.`,
},
  {
    title: 'Livestock Type',
    dataIndex: 'livestock_id',
    key: 'livestock_id',
    render: (id) => {
      if (id === 1) return "Small Cattle";
      if (id === 2) return "Large Cattle";
      if (id === 3) return "Goat";
      return "Unknown"; // fallback
    }
  },
  {
    title: 'Corral Fee (CF)',
    dataIndex: 'cf',
    key: 'cf',
  },
  {
    title: 'Slaughter Fee (SF)',
    dataIndex: 'sf',
    key: 'sf',
  },
  {
    title: 'Slaughter Permit Fee (SPF)',
    dataIndex: 'spf',
    key: 'spf',
  },
  {
    title: 'Post Mortem Fee (PMF)',
    dataIndex: 'pmf',
    key: 'pmf',
  },
  {
    title: 'Actions',
    key: 'actions',
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
    ),
  },
];



    //ACTIONS TABLE
    const items = [

        {
            key: 'edit',
            label: `Edit`,
            onClick: async (record) => {
                formEdit.setFieldsValue({
                livestock_id: record.livestock_id,
                cf: record.cf,
                sf: record.sf,
                spf: record.spf,
                pmf: record.pmf,
                });
                setCurrentRow(record);
                setShowModalEdit(true);
            },
            visible: true,
        },

        {
        key: 'delete',
        label: `Delete`,
        popconfirmTitle: `Are you sure you want to delete this record?`,
        onClick: (record) => {
            handleDelete(record); // call delete function
        },
        visible: true,
        },

    ];



    useEffect(() => {
        handleGetData();
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
                            <h1 className="text-center text-purple-600">Manage Live Stock Charges</h1>

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
                title="Livestock Charges Entry"
                open={openAdd}
                confirmLoading={confirmLoadingAdd}
                onCancel={handleCancelAdd}

                width={800}
                footer={[]}
            >


                <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                >
                <Form.Item
                    label="Type of Livestock"
                    name="livestock_id"
                    rules={[{ required: true, message: 'Please select livestock type!' }]}
                >
                    <Select placeholder="Select Type">
                    <Select.Option value={1}>Small Cattle</Select.Option>
                    <Select.Option value={2}>Large Cattle</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Corral Fee (CF)" name="cf" rules={[{ required: true }]}>
                    <Input type="number" min={0} />
                </Form.Item>

                <Form.Item label="Slaughter Fee (SF)" name="sf" rules={[{ required: true }]}>
                    <Input type="number" min={0} />
                </Form.Item>

                <Form.Item label="Slaughter Permit Fee (SPF)" name="spf" rules={[{ required: true }]}>
                    <Input type="number" min={0} />
                </Form.Item>

                <Form.Item 
                    label="Post Mortem Fee (PMF)" 
                    name="pmf" 
                    rules={[{ required: true, message: 'Please select PMF!' }]}
                >
                    <Select placeholder="Select PMF Amount">
                        {[50,100,150,200,250,300,350,400,450,500].map((amount) => (
                            <Select.Option key={amount} value={amount}>
                                {amount}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
                </Form>




            </Modal>





            {
                showModalEdit ?
                    <>     
                    <Modal
  title="Edit Livestock Charges"
  open={showModalEdit}
  onCancel={handleCloseModalEdit}
  width={800}
  footer={[]}
>
  <Form
    form={formEdit}
    layout="vertical"
    onFinish={onFinishEdit}
  >
    <Form.Item
      label="Type of Livestock"
      name="livestock_id"
      rules={[{ required: true, message: 'Please select livestock type!' }]}
    >
      <Select placeholder="Select Type">
        <Select.Option value={1}>Small Cattle</Select.Option>
        <Select.Option value={2}>Large Cattle</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item label="Corral Fee (CF)" name="cf" rules={[{ required: true }]}>
      <Input type="number" min={0} />
    </Form.Item>

    <Form.Item label="Slaughter Fee (SF)" name="sf" rules={[{ required: true }]}>
      <Input type="number" min={0} />
    </Form.Item>

    <Form.Item label="Slaughter Permit Fee (SPF)" name="spf" rules={[{ required: true }]}>
      <Input type="number" min={0} />
    </Form.Item>

    <Form.Item label="Post Mortem Fee (PMF)" name="pmf" rules={[{ required: true }]}>
      <Select placeholder="Select PMF Amount">
        {[50,100,150,200,250,300,350,400,450,500].map((amount) => (
          <Select.Option key={amount} value={amount}>
            {amount}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Divider />
    <Form.Item>
      <Button type="primary" style={{ width: '100%' }} size='large' htmlType="submit">
        Update
      </Button>
    </Form.Item>
  </Form>
</Modal>
</> : ''
            }




            <ToastContainer />
        </Layout>


    )

}
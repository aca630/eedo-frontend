import { AlignLeftOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag } from "antd";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../layouts";
import { Auth } from "../api/auth";
import { deleteCoordinator, GetCoordinator, postCoordinator } from "../api/coordinator";
import { ToastContainer, toast } from 'react-toastify';
import moment from "moment/moment";
import Icon from "@ant-design/icons/lib/components/Icon";
import Link from "next/link";
import { GetArea } from "../api/area";
import { GetAccountant, deleteAccountant, postAccountant } from "../api/accountant";
import { GetCashier, deleteCashier, postCashier } from "../api/cashier";



export default function Home() {
  const router = useRouter();
  const handleIsAunthorized = async () => {
    let auth = await Auth(router?.pathname);
    router.push({
      pathname: `${auth}`,
    });
  }
  const [data, setData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [isfetching, Setisfetching] = useState(false);
  const [searchText, setsearchText] = useState('')
  //start modal add
  const [openAdd, setOpenAdd] = useState(false);
  const [area, setArea] = useState([]);
  const [isActive, setIsactive] = useState(1);
  const [confirmLoadingAdd, setConfirmLoadingAdd] = useState(false);


  const [form] = Form.useForm();
  const handleCancelAdd = () => {
    setOpenAdd(false);
  }
  const showModalAdd = () => {
    setOpenAdd(true);
  };



  const onFinish = async (values) => {
    try {

      let ApiResponse = await postCashier({ ...values, accountantId: Cookies.get('id') })
      Setisfetching(true)
      toast.success('Data saved!')
      form.resetFields();
      setOpenAdd(false);
      handleGetCashier()
    }
    catch (error) {
      console.log(error);

      if (error?.response?.data.message == 'Username already taken!') {
        toast.warning(error?.response?.data.message)
      }
      else {
        toast.error('Saving Failed!')
      }

    }



  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };




  const handleGetCashier = async () => {

    try {

      let ApiResponse = await GetCashier()
      setData(ApiResponse?.data?.data);
      Setisfetching(false)
    }
    catch (error) {
      if (error?.response.status == 401) {

        Cookies.remove('accessToken')
        router.push({
          pathname: `/`,
        });


      }
      console.log('Get Accountant Error: ', error?.response);
    }

  }




  //end modal add
  useEffect(() => {
    Setisfetching(true);

    handleIsAunthorized()
    handleGetCashier()
  }, [])

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setsearchText(selectedKeys[0]);
  };

  const handleResetSelect = (confirm) => {
    confirm();
    setsearchText('');
    Setisfetching(true)
    handleGetCashier()
  };


  const handleChange = async (pagination, filters, sorter) => {

    // console.log( filters?.fullName);
    // // filters?.map((item) =>{

    // //   console.log( item);

    // // }); 


    Setisfetching(true);

    setInterval(() => {
      Setisfetching(false);

    }, 2000);

  };

  const getColumnSearchProps = (dataIndex) => ({

    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) =>
    (
      <div style={{ padding: 8 }}>


        <Input value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)} />




        <div className="mt-2">
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleResetSelect(confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined />
    ),

    render: text => {
      // const { searchText } = this.state;
      if (dataIndex === "status") {
        if (text === "paid") {
          return <Tag color="orange">{text.toUpperCase()}</Tag>;
        }
        if (text === "unpaid") {
          return <Tag color="lime">{text.toUpperCase()}</Tag>;
        }
        if (text === "shipped") {
          return <Tag color="green">{text.toUpperCase()}</Tag>;
        }
        if (text === "cancelled") {
          return <Tag color="cyan">{text.toUpperCase()}</Tag>;
        }
        if (text === "deleted") {
          return <Tag color="red">{text.toUpperCase()}</Tag>;
        }
        if (text === "failed") {
          return <Tag color="red">{text.toUpperCase()}</Tag>;
        }
        return text;
      }



      return "";
    }

  })


  const handleRemove = async (id) => {

    try {

      let ApiResponse = await deleteCashier(id);

      toast.success('Data deleted successfully.');
      Setisfetching(true)
      handleGetCashier()

    }
    catch (error) {
      console.log('Error deleteting coordinator: ', error);

    }

  }

  const columns = [

    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps("status")
    },

    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },

    {
      title: 'Created at',
      dataIndex: 'created_at',
      valueType: 'textarea',
      render: (dom, entity) => {
        return (
          moment(dom)?.format('MM-DD-YYYY')
        );
      },
      // moment().format('MM-DD-YYYY, h:mm:ss a')
    },

    {
      title: 'Actions',
      dataIndex: 'name',
      valueType: 'option',
      hideInDescriptions: false,
      fixed: 'right',
      width: 100,
      render: (id, record) => [
        <>
          <Space>
            {/* <Link
  key={`limit${id}`}
href={{
  pathname: '/coordinator/limit/[coorId]',
  query: {
    coorId: record?.id,
  },
}}
              >

            LIMIT
    </Link>


            <a
            key={`lw${id}`}
              onClick={async () => {
                // const newRow = (await getRequestById(record.id)).data;
                // setCurrentRow(record);
                // handleUpdateModalVisible(true);
              }}

            >
             LW
            </a> */}


            <a
              key={`edit${id}`}
              onClick={async () => {
                // const newRow = (await getRequestById(record.id)).data;
                // setCurrentRow(record);
                // handleUpdateModalVisible(true);
              }}

            >
             Edit
            </a>



{/* 
            <Popconfirm
              key="delete"
              title={'Are you sure'}
              okText={'Yes'}
              cancelText={'No'}
              placement="topLeft"
              onConfirm={() => {
                handleRemove(record.id);
                // actionRef.current?.reloadAndRest?.();
              }}
            >
              <a href="#">
                <DeleteOutlined className="text-red-500 hover:text-red-700" />
              </a>
            </Popconfirm> */}
          </Space>
        </>
      ],
    },
  ];


  return (


    <Layout>
      <Head>
        <title>EEDO</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1 className="text-center">Cashiers</h1>
      </div>

      <div>
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

        <Table dataSource={data} columns={columns} loading={isfetching} onChange={handleChange}
          scroll={{
            x: 1500,
          }} />


        <Modal
          title="New Cashier"
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
            style={{
              maxWidth: 400,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >



            <Form.Item
              label="Username"
              name="username"

              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />

            </Form.Item>


            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input password!',
                },
              ]}
            >
              <Input.Password value={123456} />
            </Form.Item>




            <Form.Item
              label="Full name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input fullname!',
                },
              ]}
            >
              <Input />

            </Form.Item>









            <Form.Item
              wrapperCol={{
               
                 span: 18,
              }}

            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>



        </Modal>

      </div>


      <ToastContainer />
    </Layout>


  )

}
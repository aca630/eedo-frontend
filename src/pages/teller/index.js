import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, HistoryOutlined, KeyOutlined, MobileOutlined, MobileTwoTone, PlusCircleOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
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
import { deleteSupervisor, GetSupervisor, postSupervisor } from "../api/supervisor";
import { ApiResetTellerPassword, ApiUpdateTellerStatus, deleteTeller, GetTeller, postTeller, putTeller } from "../api/teller";
import { ApiResetTellerDeviceId } from "../api/resetTellerDeviceId";
import { GetBarangay } from "../api/barangay";


export default function Home() {
  const router = useRouter();
  const handleIsAunthorized = async () => {
    let auth = await Auth(router?.pathname);
    router.push({
      pathname: `${auth}`,
    });
  }
  const [data, setData] = useState([]);
  const [SupervisorData, setSupervisorData] = useState([]);

  const [areaData, setAreaData] = useState([{ id: 1, name: 'Sultan Kudarat' }]);
  const [isfetching, Setisfetching] = useState(false);
  const [searchText, setsearchText] = useState('')
  //start modal add
  const [openAdd, setOpenAdd] = useState(false);
  const [area, setArea] = useState(1);
  const [isActive, setIsactive] = useState(1);
  const [multiLogin, setmultiLogin] = useState(1);
  const [selectedSupervisor, setselectedSupervisor] = useState(null);
  const [confirmLoadingAdd, setConfirmLoadingAdd] = useState(false);
  const [barangayData, setbarangayData] = useState([]);
  const [barangay, setbarangay] = useState(null);
  const [selectedSpvrArea, setselectedSpvrArea] = useState(null);
  const [selectedrow, setselectedrow] = useState(null);
  const [openEdit, setopenEdit] = useState(false);
  const [form] = Form.useForm();
  const handleCancelAdd = () => {
    setOpenAdd(false);
  }
  const showModalAdd = () => {
    setOpenAdd(true);
  };

  const handleCancelAddEdit = () => {
    setopenEdit(false);
  }

  const handleResetDevice = async (id) => {
    Setisfetching(true)
    try {
      let ApiResponse = await ApiResetTellerDeviceId({
        id: id
      })
      handleGetTeller()
      toast.success('Resetting Success!')
      Setisfetching(false)
    }
    catch (error) {
      toast.error('Resetting Failed!')
      console.log('Error reset', error);

    }

  }


  const handleGetSupervisor = async () => {

    try {

      let ApiResponse = await GetSupervisor()
      setSupervisorData(ApiResponse?.data?.data);
    }
    catch (error) {
      if (error?.response.status == 401) {

        Cookies.remove('accessToken')
        router.push({
          pathname: `/`,
        });


      }

      console.log('Get Coordinator Error: ', error?.response);
    }

  }


  const onFinish = async (values) => {
    try {

      let ApiResponse = await postTeller({ ...values, brgyId: barangay, isActive: isActive, supervisor: selectedSupervisor, multiLogin: multiLogin })
      Setisfetching(true)
      toast.success('Supervisor saved!')
      form.resetFields();
      setOpenAdd(false);
      handleGetTeller();
      setselectedSupervisor(null)
      setSupervisorData([])
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

    handleGetSupervisor()

  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  const onFinishEdit = async (values) => {
    try {

      let ApiResponse = await putTeller({ ...values, brgyId: barangay??selectedrow?.brgyId, isActive: isActive, supervisor: selectedSupervisor??selectedrow?.supervisor, multiLogin: multiLogin,id:selectedrow.id })
      Setisfetching(true)
      toast.success('Teller saved!')
      form.resetFields();
      setopenEdit(false);

      handleGetTeller();
      setselectedSupervisor(null)
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
  const onFinishFailedEdit = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleGetTeller = async () => {
    Setisfetching(true);
    try {

      let ApiResponse = await GetTeller()
      setData(ApiResponse?.data?.data);

 
    }
    catch (error) {
      if (error?.response.status == 401) {

        Cookies.remove('accessToken')
        router.push({
          pathname: `/`,
        });


      }

      console.log('Get Coordinator Error: ', error?.response);
    }
    Setisfetching(false);
  }


  //end modal add
  useEffect(() => {
    Setisfetching(true);

    handleIsAunthorized()

    handleGetTeller()
    handleGetSupervisor()
    HanldeGetBarangay()
  }, [])

  const handleSearch = (selectedKeys, confirm) => {

    confirm();
    Setisfetching(true)


    console.log(searchText);
    let arr = data.filter(function (item) {

      if (item.username.toString().toLocaleLowerCase().indexOf(searchText) > -1) {
        return item
      }
    })


    setData(arr)



    //  data.map((item,key)=>{

    //   if(item.username.toString().toLocaleLowerCase().indexOf(searchText) > -1){

    //     console.log(item);
    //     setData([...data,item]);

    //   }


    //  })

    Setisfetching(false)
  };

  const handleResetSelect = (confirm) => {
    confirm();
    setsearchText('');
    Setisfetching(true)
    handleGetTeller()
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
          onChange={(e) => {

            setsearchText(e.target.value);
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
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
            icon={<HistoryOutlined />}
          >
            Refresh
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

      let ApiResponse = await deleteTeller(id);

      toast.success('Data deleted successfully.');
      Setisfetching(true)
      handleGetTeller();

    }
    catch (error) {
      console.log('Error deleteting coordinator: ', error);

    }

  }


  const handleResetPassword = async (id) => {

    try {

      let ApiResponse = await ApiResetTellerPassword({
        id: id,
        password: 'abc123'
      });

      toast.success('Password updated successfully.');
      Setisfetching(true)
      handleGetTeller();

    }
    catch (error) {
      toast.error('Password updated failed.');
      console.log('Error deleteting coordinator: ', error);

    }

  }

  const handleUpdateStatus = async (data) => {

    console.log(data,' boom');

    try {

      let ApiResponse = await ApiUpdateTellerStatus({
        id: data?.id,
        isActive: data?.isActive==0?1:0
      });

      toast.success('Status updated successfully.');
      Setisfetching(true)
      handleGetTeller();

    }
    catch (error) {
      toast.error('Status updating failed.');

    }

  }



  const HanldeGetBarangay = async () => {

    try {
      let ApiResponse = await GetBarangay();
      setbarangayData(ApiResponse?.data?.data)
      Setisfetching(false);
    } catch (error) {

      console.log('Error area:', error);
    }

  }



  const HanldeSetSpvrAreaId = async (id) => {


    SupervisorData.map((item, key) => {
      if (item?.id == id) {

        setselectedSpvrArea(item?.area);
      }

    })


  }




  const columns = [

    {
      title: 'Supervisor',
      dataIndex: 'supervisor',
      key: 'supervisor',
      render: (dom, entity) => {
        let coor = {}
        SupervisorData.filter(element => {

          if (element.id == dom) {

            coor = element;
          }

        });


        if (coor) {
          return coor.username
        }
        else {
          return 'No Supervisor'
        }
      }
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (dom, entity) => {
        if (entity.isActive === 1) {
          return (
            <Tag color="green">
              Active
            </Tag>
          );
        } else {
          return (
            <Tag color="red">
              Inactive
            </Tag>
          );
        }
      },
    },
    {
      title: 'Full name',
      dataIndex: 'fullName',
      key: 'fullName',
    },

    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      ...getColumnSearchProps("status")
    },

    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'contact No.',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
    },
    {
      title: 'Outlet',
      dataIndex: 'outlet',
      key: 'outlet',
    },
    {
      title: 'Barangay',
      dataIndex: 'brgyId',
      key: 'brgyId',
      render:(dom,entity)=>{
        let coor ={}
        barangayData.filter(element =>{

   
          if(element.id== dom ){

            coor = element;
          }

        });

     if(coor){
     return coor.name
      }
      else{
return 'No coordinator'
      }
    }
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
      render: (_, record) => [
        <>
          <Space>


            <Popconfirm
              key="reset"
              title={'Are you sure'}
              okText={'Yes'}
              cancelText={'No'}
              placement="topLeft"
              onConfirm={() => {
                handleResetDevice(record.id);
                // actionRef.current?.reloadAndRest?.();
              }}
            >
              <a href="#" title="Reset">

                
                <MobileOutlined className="text-green-500 hover:text-green-700 " />
                {/* <DeleteOutlined className="text-red-500 hover:text-red-700" /> */}
              </a>
            </Popconfirm>



            <Popconfirm
              key="reset"
              title={'Are you sure'}
              okText={'Yes'}
              cancelText={'No'}
              placement="topLeft"
              onConfirm={() => {
                handleResetPassword(record.id);
                // actionRef.current?.reloadAndRest?.();
              }}
            >
              <a href="#" title="Pasword">

                
                <KeyOutlined className="text-green-500 hover:text-green-700 " />
              </a>
            </Popconfirm>

            {

record.isActive === 1?
<Popconfirm
key="reset"
title={'Are you sure'}
okText={'Yes'}
cancelText={'No'}
placement="topLeft"
onConfirm={() => {
  handleUpdateStatus(record);
  // actionRef.current?.reloadAndRest?.();
}}
>
<a href="#" title="Deactivate">

<CloseCircleOutlined className="text-red-500 hover:text-red-700 " />
  {/* <DeleteOutlined className="text-red-500 hover:text-red-700" /> */}
</a>
</Popconfirm>:  <Popconfirm
              key="reset"
              title={'Are you sure'}
              okText={'Yes'}
              cancelText={'No'}
              placement="topLeft"
              onConfirm={() => {
                handleUpdateStatus(record);
                // actionRef.current?.reloadAndRest?.();
              }}
            >
              <a href="#" title="Activate">

              <CheckCircleOutlined className="text-blue-500 hover:text-blue-700 " />
                {/* <DeleteOutlined className="text-red-500 hover:text-red-700" /> */}
              </a>
            </Popconfirm>
            }


            <a
              key="config" title="Edit"
              onClick={async () => {
                // const newRow = (await getRequestById(record.id)).data;
                setselectedrow(record);
                setopenEdit(true)
                // handleUpdateModalVisible(true);
              }}

            >
              <EditOutlined />
            </a>




            {/* <Popconfirm
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
              <a href="#" title="Delete">
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
    
    <div className="mt-2 mb-2">
    <Space>
      <Button
          onClick={showModalAdd}
          type="primary"

          icon={<PlusOutlined />}
        >
          New
        </Button>

        <Button
            onClick={() => handleGetTeller()}
            icon={<HistoryOutlined />}
          >
            Refresh
          </Button>
      </Space>
    </div>

        <Table dataSource={data} columns={columns} loading={isfetching} onChange={handleChange} scroll={{
          x: 1500,
        }} />


        <Modal
          title="New Teller"
          open={openAdd}
          confirmLoading={confirmLoadingAdd}
          onCancel={handleCancelAdd}

   width={800}
                footer={[]}
        >
{
  openAdd?
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

{
  openAdd ?<Form.Item label="Supervisor">
  <Select name="supervisor" ref={form} value={selectedSupervisor} onChange={(e) => {
    HanldeSetSpvrAreaId(e)
    setselectedSupervisor(e)
  }}>
    {
     SupervisorData.map((item, key) => {

        return (
          <Select.Option key={key} value={item.id}>{item?.username}</Select.Option>
        )

      })
    }



  </Select>
</Form.Item>:''
}
  

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
        message: 'Please input your password!',
      },
    ]}
  >
    <Input.Password value={'abc123'} />
  </Form.Item>




  <Form.Item
    label="Full name"
    name="fullName"
    rules={[
      {
        required: true,
        message: 'Please input your fullname!',
      },
    ]}
  >
    <Input />

  </Form.Item>


  <Form.Item label="Barangay">

    {
      selectedSupervisor ?
        <Select name="brgyId" onChange={(e) => {
          setbarangay(e)
        }}>
          {
            barangayData.map((item, key) => {

              if (selectedSpvrArea == item?.areaId) {
                return (
                  <Select.Option key={key} value={item.id}>{item?.name}</Select.Option>
                )
              }




            })
          }



        </Select> : <h1 className="text-sm text-red-500">*Please Select Supervisor</h1>
    }

  </Form.Item>


  <Form.Item
    label="Address"
    name="address"
    rules={[
      {
        required: true,
        message: 'Please input your address!',
      },
    ]}
  >
    <Input />

  </Form.Item>

  <Form.Item
    label="Contact Number"
    name="contactNumber"
    rules={[
      {
        required: true,
        message: 'Please input your contact number!',
      },
    ]}
  >

    <Input />

  </Form.Item>

  <Form.Item
    label="Location"
    name="location"
    rules={[
      {
        required: true,
        message: 'Please input your location!',
      },
    ]}
  >

    <Input />

  </Form.Item>

  <Form.Item
    label="Outlet"
    name="outlet"
    rules={[
      {
        required: true,
        message: 'Please input your outlet!',
      },
    ]}
  >

    <Input />

  </Form.Item>



  <Form.Item label="Is active">
    <Select name="isActive" onChange={(e) => {
      setIsactive(e)
    }}>
      <Select.Option value="1">Yes</Select.Option>
      <Select.Option value="0">No</Select.Option>

    </Select>
  </Form.Item>


  <Form.Item label="multiLogin">
    <Select name="multiLogin" onChange={(e) => {
      setmultiLogin(e)
    }}>
      <Select.Option value="1">Yes</Select.Option>
      <Select.Option value="0">No</Select.Option>

    </Select>
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
</Form>:''
}

        



        </Modal>




        <Modal
          title="Edit Teller"
          open={openEdit}
          confirmLoading={confirmLoadingAdd}
          onCancel={handleCancelAddEdit}

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
            onFinish={onFinishEdit}
            onFinishFailed={onFinishFailedEdit}
            // autoComplete="off"
          >

            <Form.Item label="Supervisor">
              <Select name="supervisor"  onChange={(e) => {
                HanldeSetSpvrAreaId(e)
                setselectedSupervisor(e)
              }}>
                {
                  SupervisorData.map((item, key) => {
                    

                    return (
                      <Select.Option key={key} value={item.id}>{item?.username}</Select.Option>
                    )

                  })
                }



              </Select>
            </Form.Item>

      



            <Form.Item
              label="Full name"
              name="fullName"
           
              rules={[
                {
                  required: true,
                  message: 'Please input your fullname!',
                },
              ]}
            >
              <Input    defaultValue={selectedrow?.fullName} />

            </Form.Item>


            <Form.Item label="Barangay">

             
                  <Select name="brgyId"  onChange={(e) => {
                    setbarangay(e)
                  }}>
                    {
                      barangayData.map((item, key) => {

                    
                          return (
                            <Select.Option key={key} value={item.id}>{item?.name}</Select.Option>
                          )
                        
                      })
                    }



                  </Select>

            </Form.Item>


            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: 'Please input your address!',
                },
              ]}
            >
              <Input    defaultValue={selectedrow?.address}  />

            </Form.Item>

            <Form.Item
              label="Contact Number"
              name="contactNumber"
              rules={[
                {
                  required: true,
                  message: 'Please input your contact number!',
                },
              ]}
            >

              <Input    defaultValue={selectedrow?.contactNumber} />

            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
              rules={[
                {
                  required: true,
                  message: 'Please input your location!',
                },
              ]}
            >

              <Input defaultValue={selectedrow?.location} />

            </Form.Item>

            <Form.Item
              label="Outlet"
              name="outlet"
              rules={[
                {
                  required: true,
                  message: 'Please input your outlet!',
                },
              ]}
            >

              <Input defaultValue={selectedrow?.outlet}  />

            </Form.Item>



            <Form.Item label="Is active">
              <Select name="isActive" onChange={(e) => {
                setIsactive(e)
              }}>
                <Select.Option value="1">Yes</Select.Option>
                <Select.Option value="0">No</Select.Option>

              </Select>
            </Form.Item>


            <Form.Item label="multiLogin">
              <Select name="multiLogin" onChange={(e) => {
                setmultiLogin(e)
              }}>
                <Select.Option value="1">Yes</Select.Option>
                <Select.Option value="0">No</Select.Option>

              </Select>
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
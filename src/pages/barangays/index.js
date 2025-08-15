import { DeleteOutlined, EditOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
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
import { GetArea, postArea } from "../api/area";
import { GetBarangay, postBarangay, putBarangay } from "../api/barangay";



export default function Home() {
  const router = useRouter();
  const handleIsAunthorized = async () => {
    let auth = await Auth(router?.pathname);
    router.push({
      pathname: `${auth}`,
    });
  }
  const [data, setData] = useState([]);
  const [isfetching, Setisfetching] = useState(false);
  const [searchText, setsearchText] = useState('')
  //start modal add
  const [openAdd, setOpenAdd] = useState(false);
  const [confirmLoadingAdd, setConfirmLoadingAdd] = useState(false);
  const [areaData, setAreaData] = useState([]);
  const [barangayData, setbarangayData] = useState([]);
  const [area, setArea] = useState(null);
  const [selectedrow, setselectedrow] = useState(null);
  const [openEdit, setopenEdit] = useState(false);
  const [form] = Form.useForm();
  const handleCancelAdd = () => {
    setOpenAdd(false);
  }
  const showModalAdd = () => {
    setOpenAdd(true);
  };


  const handleCanceEdit = () => {
    setopenEdit(false);
  }



  const onFinish = async (values) => {
    try {

      let ApiResponse = await postBarangay({ ...values,areaId:area})
      Setisfetching(true)
      toast.success('Barangay saved!')
      form.resetFields();
      setOpenAdd(false);
      HanldeGetBarangay()
      HanldeGetArea();
    }
    catch (error) {
    
        toast.error('Saving Failed!')
      

    }



  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };



  const onFinishEdit = async (values) => {
    try {

      let ApiResponse = await putBarangay({ ...values,areaId:area??selectedrow?.areaId,id:selectedrow?.id})
      Setisfetching(true)
      toast.success('Barangay saved!')
      form.resetFields();
      setopenEdit(false);
      HanldeGetBarangay()
      HanldeGetArea();
    }
    catch (error) {
    
        toast.error('Saving Failed!')
      

    }



  };
  const onFinishFailedEdit = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };



  const HanldeGetBarangay= async ()=>{

    try{
     let ApiResponse = await GetBarangay();
         setbarangayData(ApiResponse?.data?.data)
         Setisfetching(false);
    }catch(error){
   
     console.log('Error area:', error);
    }
   
     }


  const HanldeGetArea = async ()=>{

    try{
     let ApiResponse = await GetArea();
         setAreaData(ApiResponse?.data?.data)
     
    }catch(error){
   
     console.log('Error area:', error);
    }
   
     }

  //end modal add
  useEffect(() => {
    Setisfetching(true);
    HanldeGetArea()
    HanldeGetBarangay()
    handleIsAunthorized()
  }, [])

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setsearchText(selectedKeys[0]);
  };

  const handleResetSelect = (confirm) => {
    confirm();
    setsearchText('');
    Setisfetching(true)
    HanldeGetArea()
    HanldeGetBarangay()
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

      let ApiResponse = await deleteSupervisor(id);

      toast.success('Data deleted successfully.');
      Setisfetching(true)
      handleGetSupervisor();

    }
    catch (error) {
      console.log('Error deleteting coordinator: ', error);

    }

  }

  const columns = [
    {
      title: 'Municipality',
      dataIndex: 'areaId',
      key: 'areaId',
      render:(dom,entity)=>{
        let coor ={}
        areaData.filter(element =>{
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
      title: 'Barangay',
      dataIndex: 'name',
      valueType: 'textarea',
      ...getColumnSearchProps("name"),
      render: (dom, entity) => {
        return (
         dom
        );
      },
     
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
            <a
              key="config"
              onClick={async () => {
                // const newRow = (await getRequestById(record.id)).data;
                // setCurrentRow(record);
                // handleUpdateModalVisible(true);

                setselectedrow(record);
                setopenEdit(true)
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

        <Table dataSource={barangayData} columns={columns} loading={isfetching} onChange={handleChange} />


        <Modal
          title="New Barangay"
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

<Form.Item label="Municipality">
              <Select name="area" onChange={(e) => {
                setArea(e)
              }}>
                {
                  areaData.map((item,key)=>{

                    return (
                      <Select.Option key={key} value={item.id}>{item?.name}</Select.Option>
                    )

                  })
                }
              
              

              </Select>
            </Form.Item>


            <Form.Item
              label="Barangay"
              name="name"

              rules={[
                {
                  required: true,
                  message: 'Field required',
                },
              ]}
            >
              <Input onInput={e => e.target.value = e.target.value.toUpperCase()} />

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



        <Modal
          title="Edit Barangay"
          open={openEdit}
          confirmLoading={confirmLoadingAdd}
          onCancel={handleCanceEdit}

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
            autoComplete="off"
          >

<Form.Item label="Municipality">
              <Select name="area" defaultValue={selectedrow?.areaId} onChange={(e) => {
                setArea(e)
              }}>
                {
                  areaData.map((item,key)=>{

                    return (
                      <Select.Option key={key} value={item.id}>{item?.name} </Select.Option>
                    )

                  })
                }
              
              

              </Select>
            </Form.Item>


            <Form.Item
              label="Barangay"
              name="name"

              rules={[
                {
                  required: true,
                  message: 'Field required',
                },
              ]}
            >
              <Input onInput={e => e.target.value = e.target.value.toUpperCase()} defaultValue={selectedrow?.name} />

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
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Input, InputNumber, Menu, Modal, Popconfirm, Select, Skeleton, Space, Table, Tag } from "antd";
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
import { deleteSupervisor, GetSupervisor, postSupervisor, updateSupervisor } from "../api/supervisor";
import { GetArea } from "../api/area";
import { GetCashier } from "../api/cashier";



export default function Home() {
  const router = useRouter();
  const handleIsAunthorized = async () => {
    let auth = await Auth(router?.pathname);
    router.push({
      pathname: `${auth}`,
    });
  }
  const [data, setData] = useState([]);
  const [CashierData, setCashierData] = useState([]);

  const [areaData, setAreaData] = useState([]);
  const [isfetching, Setisfetching] = useState(false);
  const [searchText, setsearchText] = useState('')
  //start modal add
  const [openAdd, setOpenAdd] = useState(false);
  const [area, setArea] = useState(null);
  const [isActive, setIsactive] = useState(1);
  const [selectedCashier, setselectedCashier] = useState(null);
  const [confirmLoadingAdd, setConfirmLoadingAdd] = useState(false);
  const [confirmLoadingEdit, setConfirmLoadingEdit] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [CurrentRow, setCurrentRow] = useState(null);


  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();
  const handleCancelAdd = () => {
    setOpenAdd(false);
  }
  const showModalAdd = () => {
    setOpenAdd(true);
  };

  const handleCancelEdit = () => {
    formEdit.resetFields()
    setCurrentRow(null)
    setOpenEdit(false);
  }
  const showModalEdit = () => {
    setOpenAdd(true);
  };




  const handleGetCashier = async () => {

    try {

      let ApiResponse = await GetCashier()
      setCashierData(ApiResponse?.data?.data);
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

      let ApiResponse = await postSupervisor({ ...values, area: area, isActive: isActive, cashierId: selectedCashier, coorId: 0 })
      Setisfetching(true)
      toast.success('Supervisor saved!')
      form.resetFields();
      setOpenAdd(false);

      handleGetSupervisor();
      // selectedCashier(null)
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

  const handleGetSupervisor = async () => {

    try {

      let ApiResponse = await GetSupervisor()
      setData(ApiResponse?.data?.data);

      Setisfetching(false);
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


  //end modal add
  useEffect(() => {
    Setisfetching(true);

    handleIsAunthorized()

    handleGetSupervisor()
    handleGetCashier()
    HanldeGetArea()
  }, [])

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setsearchText(selectedKeys[0]);
  };

  const handleResetSelect = (confirm) => {
    confirm();
    setsearchText('');
    Setisfetching(true)
    handleGetSupervisor()
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

  const HanldeGetArea = async () => {

    try {
      let ApiResponse = await GetArea();
      setAreaData(ApiResponse?.data?.data)

    } catch (error) {

      console.log('Error area:', error);
    }

  }


  const onFinishEdit = async (values) => {
    try {

      console.log(values);

      let ApiResponse = await updateSupervisor({ ...values, area: area, isActive: isActive, cashierId: selectedCashier, coorId: 0, id: CurrentRow?.id })
      Setisfetching(true)
      toast.success('Supervisor updated!')
      formEdit.resetFields();
      setOpenEdit(false);

      handleGetSupervisor();
      setselectedCashier(null)
      setCurrentRow(null)
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

  const columns = [

    {
      title: 'Cashier',
      dataIndex: 'cashierId',
      key: 'cashierId',
      render: (dom, entity) => {
        let coor = {}
        CashierData.filter(element => {


          if (element.id == dom) {

            coor = element;
          }

        });

        if (coor) {
          return coor.username
        }
        else {
          return 'No coordinator'
        }
      }
    },
    {
      title: 'Full name',
      dataIndex: 'fullName',
      key: 'fullName',
      ...getColumnSearchProps("status")
    },

    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    // {
    //   title: 'Percentage',
    //   dataIndex: 'percentage',
    //   key: 'percentage',
    // },
    {
      title: 'Municipality',
      dataIndex: 'area',
      key: 'area',

      render: (dom, entity) => {

        let areas = "";
        let count = 1;
        areaData.filter(element => {


          if (dom == element.id) {
            areas = areas.concat(element.name)
          }

        });

        return (areas);
        // if(intersection.length > 0){

        //  return intersection.map((item,key)=>{
        //     return item?.name+','
        //   })
        // }
        // else{
        //   return 'No area'
        // }   

      }
    },
    {
      title: 'Active',
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
      title: `Actions`,
      dataIndex: 'name',
      valueType: 'option',
      fixed: 'right',
      width: 100,
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
        setCurrentRow(record)
        setOpenEdit(true)
      },

      visible: true,
    },


  ];


  const setCurrentRowData = (data) => {
    console.log(data);

    setCurrentRow(data);

  }


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

        <Table dataSource={data} columns={columns} loading={isfetching} onChange={handleChange} />


        <Modal
          title="New Supervisor"
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

            <Form.Item label="Cashier">
              <Select name="cashierId" onChange={(e) => {
                setselectedCashier(e)
              }}>
                {
                  CashierData.map((item, key) => {

                    return (
                      <Select.Option key={key} value={item.id}>{item?.username}</Select.Option>
                    )

                  })
                }



              </Select>
            </Form.Item>

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
              <Input.Password value={123456} />
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


            <Form.Item label="Municipality">
              <Select name="area" onChange={(e) => {
                setArea(e)
              }}>
                {
                  areaData.map((item, key) => {

                    return (
                      <Select.Option key={key} value={item.id}>{item?.name}</Select.Option>
                    )

                  })
                }



              </Select>
            </Form.Item>




            <Form.Item label="Is active">
              <Select name="isActive" onChange={(e) => {
                setIsactive(e)
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


        {
          openEdit ? <>
            <Modal
              title="Edit Supervisor"
              open={openEdit}
              confirmLoading={confirmLoadingEdit}
              onCancel={handleCancelEdit}

       width={800}
                footer={[]}
            >    <Form
              form={formEdit}
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

                {
                  CurrentRow ? <>      <Form.Item label="Cashier">
                    <Select name="cashierId" onChange={(e) => {
                      setselectedCashier(e)
                    }}>
                      {
                        CashierData.map((item, key) => {

                          return (
                            <Select.Option key={key} value={item.id}>{item?.username}</Select.Option>
                          )

                        })
                      }



                    </Select>
                  </Form.Item>

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
                      <Input defaultValue={CurrentRow && CurrentRow?.username} />

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
                      <Input defaultValue={CurrentRow?.fullName} />

                    </Form.Item>


                    <Form.Item label="Municipality">
                      <Select name="area" onChange={(e) => {
                        setArea(e)
                      }}>
                        {
                          areaData.map((item, key) => {

                            return (
                              <Select.Option key={key} value={item.id}>{item?.name}</Select.Option>
                            )

                          })
                        }



                      </Select>
                    </Form.Item>




                    <Form.Item label="Is active">
                      <Select name="isActive" onChange={(e) => {
                        setIsactive(e)
                      }}>
                        <Select.Option value="1">Yes</Select.Option>
                        <Select.Option value="0">No</Select.Option>

                      </Select>
                    </Form.Item>


                  </> : <Skeleton />
                }


                <Form.Item
                  wrapperCol={{
                   
                     span: 18,
                  }}

                >
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </Form>



            </Modal></> : ''
        }

      </div>


      <ToastContainer />
    </Layout>


  )

}
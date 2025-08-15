
import { AuditOutlined, BookOutlined, BorderRightOutlined, CopyOutlined, DashboardOutlined, DisconnectOutlined, GroupOutlined, InsertRowLeftOutlined, LoginOutlined, MailOutlined, RadiusUprightOutlined, RightOutlined, SettingOutlined, ShopOutlined, ShoppingCartOutlined, TagsOutlined, UserDeleteOutlined, UsergroupDeleteOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import TopicMenu from "../../components/TopicMenu";
import Footer from "../../components/Footer";

// const topics = ["Dashboard", "Coordinator", "Supervisor","Teller","Settings"];
const menu = [
  {
    label: 'Dashboard',
    key: '/dashboard',
    icon: <DashboardOutlined />,
  },
  {
    label: 'Palengke',
    key: '/palengke',
    icon: <ShoppingCartOutlined />,
  },
  {
    label: 'Terminal',
    key: '/terminal',
    icon: <InsertRowLeftOutlined />,
  },
  {
    label: 'Slaughter',
    key: '/slaughter',
    icon: <ShopOutlined />,
  },
  {
    label: 'Cemetery',
    key: '/cemetery',
    icon: <UserDeleteOutlined />,
  },
  // {
  //   label: 'Palengke',
  //   key: '/Palengke',
  //   icon: <UserOutlined />,
  // },
  // {
  //   label: 'Occupants',
  //   key: '/occupants',
  //   icon: <UsergroupDeleteOutlined />,
  // },
  // {
  //   label: 'Draws',
  //   key: '/draw',
  //   icon: <TagsOutlined />,
  // },
  // {
  //   label: 'Void',
  //   key: '/voids',
  //   icon: <CopyOutlined />,
  // },
  // {
  //   label: 'Limits',
  //   key: '/limit',
  //   icon: <DisconnectOutlined />,
  // },
  // {
  //   label: 'Areas',
  //   key: '/areas',
  //   icon: <RadiusUprightOutlined />,
  // },
  // {
  //   label: 'Sections',
  //   key: '/sectiond',
  //   icon: <BorderRightOutlined />,
  // },

  // {
  //   label: 'Reports',
  //   key: '/reports',
  //   icon: <BookOutlined />,
  // },
  // {
  //   label: 'Control',
  //   key: '/control',
  //   icon: <CopyOutlined />,
  // },
  // {
  //   label: 'Claim',
  //   key: '/claim',
  //   icon: <AuditOutlined />,
  // },
  // {
  //   label: 'Settings',
  //   key: '/settings',
  //   icon: <SettingOutlined />,
  // },
  {
    label: 'Logout',
    key: '/logout',
    icon: <LoginOutlined />,
  },
]


const Main = (props) => {



  const {
    children,
    locale,
    translate,
    user,
    countries,
    requests,
    setRequestList,
  } = props;

  const Menu = (
    <TopicMenu
      menu={menu}
    />
  );

  return (
    <div className="App">
      <NavBar menu={Menu} />
      <Layout>
        <SideBar menu={Menu} />
        <Layout.Content className="content p-2">
          {children}
        </Layout.Content>


      </Layout>
      <Footer />
    </div>
  );
};
export default Main;
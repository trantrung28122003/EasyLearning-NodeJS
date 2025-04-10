import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import React, { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import style from "./adminshared.module.css";
interface AdminSharedProps {
  children: ReactNode;
}
type MenuItem = Required<MenuProps>["items"][number];

const AdminShared: React.FC<AdminSharedProps> = ({ children }) => {
  const nagivate = useNavigate();
  const [tab, setTab] = useState<string[]>(["1"]);
  const [key, setKey] = useState<string[]>(["sub1"]);

  const handleOnClick = (key: string[], tab: string[], link: string) => {
    setTab(tab);
    setKey(key);
    nagivate(link);
  };

  const handleKeyOnClick = (key: string[]) => {
    console.log(key);
    setTab([]);
    setKey(key);
  };

  const items: MenuItem[] = [
    {
      key: "sub1",
      label: "Khóa học",
      icon: <AppstoreOutlined />,
      onTitleClick: () => handleKeyOnClick(["sub1"]),
      children: [
        {
          key: "1",
          label: "Xem danh sách",
          onClick: () => handleOnClick(["sub1"], ["1"], "/admin/course"),
        },
        {
          key: "2",
          label: "Thêm",
          onClick: () => handleOnClick(["sub1"], ["2"], "/admin/course/create"),
        },
        {
          key: "16",
          label: "Sửa",
          onClick: () => handleOnClick(["sub1"], ["16"], "/admin/course/update"),
        },
        {
          key: "17",
          label: "Chi tiết",
          onClick: () => handleOnClick(["sub1"], ["17"], "/admin/course/details"),
        },
      ],
    },
    {
      key: "sub2",
      label: "Lớp",
      icon: <SettingOutlined />,
      onTitleClick: () => handleKeyOnClick(["sub2"]),
      children: [
        {
          key: "3",
          label: "Xem danh sách",
          onClick: () => handleOnClick(["sub2"], ["3"], "/admin/event"),
        },
        {
          key: "4",
          label: "Thêm",
          onClick: () => handleOnClick(["sub2"], ["4"], "/admin/event/create"),
        },
      ],
    },
    
    {
      key: "sub3",
      label: "Loại khóa học",
      icon: <SettingOutlined />,
      onTitleClick: () => handleKeyOnClick(["sub3"]),
      children: [
        {
          key: "5",
          label: "Xem danh sách",
          onClick: () => handleOnClick(["sub3"], ["5"], "/admin/category"),
        },
        {
          key: "6",
          label: "Thêm",
          onClick: () =>
            handleOnClick(["sub3"], ["6"], "/admin/category/create"),
        },
      ],
    },
   {
      key: "sub4",
      label: "Người dùng",
      icon: <SettingOutlined />,
      onTitleClick: () => handleKeyOnClick(["sub4"]),
      children: [
        {
          key: "7",
          label: "Xem danh sách",
          onClick: () => handleOnClick(["sub4"], ["1"], "/admin/user"),
        },
      ],
    },
    {
      key: "sub5",
      label: "Doanh thu",
      icon: <SettingOutlined />,
      onTitleClick: () => handleKeyOnClick(["sub5"]),
      children: [
        { key: "13", label: "Xem danh sách" },
        { key: "14", label: "Thêm" },
        { key: "15", label: "Xóa" },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "sub6",
      label: "Thùng rác",
      icon: <SettingOutlined />,
      onClick: () => handleOnClick(["sub6"], ["sub6"], "/admin/course"),
    },
  ];
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  return (
    <div>
      <Navbar />
      <div className={`${style.admin_container}`}>
        <Menu
          onClick={onClick}
          style={{ width: 256 }}
          // selectedKeys={tab}
          // openKeys={key}
          // defaultSelectedKeys={["1"]}
          // defaultOpenKeys={["sub1"]}
          mode="inline"
          items={items}
        />
        <div className={style.wrapper}>
          <div id="content-wrapper" className="d-flex flex-column">
            <div className="main-container">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminShared;

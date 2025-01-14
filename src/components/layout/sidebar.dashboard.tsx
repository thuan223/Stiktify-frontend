'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    MailOutlined,
    TeamOutlined,

} from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import Link from 'next/link'
import { DashboardContext } from "@/library/dashboard.context";
import { usePathname } from "next/navigation";

type MenuItem = Required<MenuProps>['items'][number];
const DashboardSideBar = () => {
    const pathname = usePathname();
    const { Sider } = Layout;
    const { collapseMenu } = useContext(DashboardContext)!;
    const [pathActive, setPathActive] = useState(pathname)
    const items: MenuItem[] = [

        {
            key: 'grp',
            label: 'Stiktify',
            type: 'group',
            children: [
                {
                    key: "/dashboard",
                    label: <Link href={"/dashboard"}>Dashboard</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "/dashboard/user",
                    label: <Link href={"/dashboard/user"}>Manage Users</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: 'sub1',
                    label: 'Navigation One',
                    icon: <MailOutlined />,
                    children: [
                        {
                            key: 'g1',
                            label: 'Item 1',
                            type: 'group',
                            children: [
                                { key: '1', label: 'Option 1' },
                                { key: '2', label: 'Option 2' },
                            ],
                        },
                        {
                            key: 'g2',
                            label: 'Item 2',
                            type: 'group',
                            children: [
                                { key: '3', label: 'Option 3' },
                                { key: '4', label: 'Option 4' },
                            ],
                        },
                    ],
                },
                {
                    type: 'divider',
                },
            ],
        },
    ];


    return (
        <Sider
            collapsed={collapseMenu}
        >
            <Menu
                mode="inline"
                defaultSelectedKeys={[pathActive]}
                items={items}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default DashboardSideBar;
'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    ExceptionOutlined,
    InfoCircleOutlined,
    MailOutlined,
    PlayCircleOutlined,
    TeamOutlined,
    VideoCameraOutlined,
    WarningOutlined
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
                    key: "/dashboard/short-video",
                    label: <Link href={"/dashboard/short-video"}>Manage Short Video</Link>,
                    icon: <VideoCameraOutlined />,
                },

                {
                    key: "/dashboard/music",
                    label: <Link href={"/dashboard/music"}>Manage Music</Link>,
                    icon: <PlayCircleOutlined />,
                },
                {
                    key: 'sub1',
                    label: 'Manage Report',
                    icon: <InfoCircleOutlined />,
                    children: [
                        {
                            key: '/dashboard/report/report-video',
                            label: <Link href={"/dashboard/report/report-video"}>Video Report</Link>,
                        },
                        {
                            key: '/dashboard/report-music',
                            label: <Link href={"/dashboard/report/report-music"}>Music Report</Link>,
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
                defaultSelectedKeys={[pathname]}
                items={items}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default DashboardSideBar;
import React, { ReactNode } from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Select, Space } from 'antd';

interface IProps {
    title?: string,
    icon?: ReactNode,
    selected: string,
    setSelect: any
}

const DropdownCustomize: React.FC<IProps> = (props) => {
    const { icon, title, selected, setSelect } = props
    const { Option } = Select;

    return (
        <Select defaultValue="filter" menuItemSelectedIcon={icon} style={{ width: 120 }} onChange={setSelect}>
            <Option value="filter" disabled>{title}</Option>
            <Option value="" >None</Option>
            <Option value="lock">Block</Option>
            <Option value="unlock">Unblock</Option>
        </Select>
    )
}

export default DropdownCustomize;
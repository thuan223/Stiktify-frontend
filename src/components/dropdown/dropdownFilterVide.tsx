import React, { ReactNode } from "react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Select, Space } from "antd";

interface IProps {
  title?: string;
  icon?: ReactNode;
  selected: string;
  setSelect: any;
}

const DropdownCustomizeFilterVideo: React.FC<IProps> = (props) => {
  const { icon, title, selected, setSelect } = props;
  const { Option } = Select;

  return (
    <Select
      defaultValue="filter"
      menuItemSelectedIcon={icon}
      style={{ width: 120 }}
      onChange={setSelect}
    >
      <Option value="filter" disabled>
        {title}
      </Option>
      <Option value="">None</Option>
      <Option value="Mashup">Mashup</Option>
      <Option value="Cover">Cover</Option>
      <Option value="Dance">Dance</Option>
      <Option value="Guitar">Guitar</Option>
      <Option value="Japan Music">Japan Music</Option>
      <Option value="EDM">EDM</Option>
      <Option value="Game Music">Game Music</Option>
      <Option value="Movie Music">Movie Music</Option>
      <Option value="Funk">Funk</Option>
      <Option value="Rap">Rap</Option>
    </Select>
  );
};

export default DropdownCustomizeFilterVideo;

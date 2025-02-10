"use client";
import { ColumnsType } from "antd/es/table";
import TableCustomize from "../table/table.dashboard";
import { useEffect, useState } from "react";
import { formatNumber } from "@/utils/utils";
import { FilterOutlined, FlagTwoTone, SearchOutlined } from "@ant-design/icons";
import { notification, Popconfirm } from "antd";
import {
  handleFlagShortVideoAction,
  handleSearchShortVideos,
} from "@/actions/manage.short.video.action";
import InputCustomize from "../input/input.customize";
import DropdownCustomize from "../dropdown/dropdown.customize";

interface IProps {
  dataSource: IShortVideo[];
  meta: {
    current: number;
    pageSize: number;
    total: number;
  };
}

const ManageShortVideoTable = (props: IProps) => {
  const { dataSource, meta } = props;
  const [dataTable, setDataTable] = useState<IShortVideo[]>(dataSource);
  const [metaTable, setMetaTable] = useState(meta);
  const [search, setSearch] = useState<string>("");
  const [filterReq, setFilterReq] = useState<string>("");
  const [forceRender, setForceRender] = useState<number>(0);

  const handleFlagVideo = async (record: IShortVideo) => {
    const res = await handleFlagShortVideoAction(record._id, !record.flag);
    notification.success({ message: res?.message });
  };

  useEffect(() => {
    (async () => {
      if (search.length > 0 || filterReq.length > 0) {
        const res = await handleSearchShortVideos(
          search,
          meta.current,
          meta.pageSize
        );

        if (res?.data?.result && Array.isArray(res.data.result)) {
          // Sắp xếp video có chứa từ khóa lên đầu
          const sortedVideos = [...res.data.result].sort((a, b) => {
            const aMatch = a.videoDescription
              ?.toLowerCase()
              .includes(search.toLowerCase())
              ? 1
              : 0;
            const bMatch = b.videoDescription
              ?.toLowerCase()
              .includes(search.toLowerCase())
              ? 1
              : 0;
            return bMatch - aMatch;
          });

          setDataTable(sortedVideos);
          setMetaTable(res.data.meta);
          setForceRender((prev) => prev + 1);
        } else {
          setDataTable(dataSource);
          setMetaTable(meta);
        }
      } else {
        setDataTable(dataSource);
        setMetaTable(meta);
      }
    })();
  }, [search, filterReq, dataSource, meta]);

  const columns: ColumnsType<IShortVideo> = [
    {
      title: "Username",
      dataIndex: "userId",
      key: "userId",
      render: (value) => {
        return <div>{value?.userName ?? "Unknown"}</div>;
      },
    },
    {
      title: "Thumbnail",
      dataIndex: "videoThumbnail",
      key: "videoThumbnail",
      render: (value) => (
        <div
          style={{
            width: "150px",
            height: "100px",
            borderRadius: "3px",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            textAlign: "center",
          }}
        >
          <img
            src={value}
            alt="Thumbnail"
            style={{ borderRadius: "3px", width: "100%", height: "100%" }}
          />
        </div>
      ),
    },
    {
      title: "Views",
      dataIndex: "totalViews",
      key: "totalViews",
      render: (value) => <div>{formatNumber(value ?? 0)}</div>,
    },
    {
      title: "Reactions",
      dataIndex: "totalReaction",
      render: (value) => <div>{formatNumber(value ?? 0)}</div>,
    },
    {
      title: "Comments",
      dataIndex: "totalComment",
      key: "totalComment",
      render: (value) => <div>{formatNumber(value ?? 0)}</div>,
    },
    {
      title: "Favorite",
      dataIndex: "totalFavorite",
      key: "totalFavorite",
      render: (value) => <div>{formatNumber(value ?? 0)}</div>,
    },
    {
      title: "Description",
      dataIndex: "videoDescription",
      key: "videoDescription",
    },
    {
      title: "Action",
      dataIndex: "flag",
      key: "flag",
      render: (value, record) => (
        <Popconfirm
          title="Sure to flag video?"
          onConfirm={() => handleFlagVideo(record)}
          okText="Yes"
          cancelText="No"
        >
          <FlagTwoTone
            style={{ fontSize: "20px" }}
            twoToneColor={value ? "#ff7675" : ""}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          fontWeight: 600,
          fontSize: 20,
        }}
      >
        <span>Manager Short Video</span>
      </div>

      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "start",
          gap: 10,
        }}
      >
        <div style={{ width: "300px" }}>
          <InputCustomize
            setValue={(val: any) => {
              setSearch(val);
            }}
            value={search}
            icon={<SearchOutlined />}
          />
        </div>
        <div>
          <DropdownCustomize
            title="Filter"
            selected={filterReq}
            setSelect={setFilterReq}
            icon={<FilterOutlined />}
          />
        </div>
      </div>

      <TableCustomize
        key={forceRender}
        columns={columns}
        dataSource={dataTable}
        meta={metaTable}
      />
    </>
  );
};

export default ManageShortVideoTable;

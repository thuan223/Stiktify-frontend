'use client'

import { CrownOutlined } from "@ant-design/icons"
import { Result } from "antd"

const DashboardPageComponent = () => {
    return (
        <div style={{ padding: 20 }}>
            <Result
                icon={<CrownOutlined />}
                title="Fullstack Next/Nest - createdBy @hoidanit"
            />
        </div>
    )
}

export default DashboardPageComponent;


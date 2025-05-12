// src/features/equipment/components/IconSelect.tsx
import React, { useState } from 'react';
import { Select, Space } from 'antd';
import * as AntdIcons from '@ant-design/icons';

const { Option } = Select;

// Danh sách các icon liên quan đến xây dựng và công trường
const constructionIcons = [
  'BuildOutlined',
  'ToolOutlined',
  'RobotOutlined',
  'CarOutlined',
  'RocketOutlined',
  'ApartmentOutlined',
  'DeploymentUnitOutlined',
  'ControlOutlined',
  'FormatPainterOutlined',
  'SlackOutlined',
  'EnvironmentOutlined',
  'CompassOutlined',
  'ColumnWidthOutlined',
  'BoxPlotOutlined',
  'FundOutlined',
  'ForkOutlined',
  'BulbOutlined',
  'FlagOutlined',
  'SwitcherOutlined',
  'GroupOutlined',
  'NodeIndexOutlined',
  'BorderOutlined',
  'PartitionOutlined',
  'RadarChartOutlined',
  'LoadingOutlined',
  'DatabaseOutlined',
  'InboxOutlined',
  'ExpandOutlined',
  'CompressOutlined',
  'GoldOutlined'
];

interface IconSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const IconSelect: React.FC<IconSelectProps> = ({ 
  value, 
  onChange, 
  placeholder = "Chọn biểu tượng", 
  required = false 
}) => {
  const [searchText, setSearchText] = useState('');
  
  // Lọc danh sách icon dựa trên từ khóa tìm kiếm
  const filteredIcons = constructionIcons.filter(iconName => 
    iconName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Render icon
  const renderIcon = (iconName: string) => {
    const IconComponent = AntdIcons[iconName as keyof typeof AntdIcons] as React.ComponentType;
    return IconComponent ? (
      <IconComponent style={{ fontSize: '18px' }} />
    ) : null;
  };

  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: '100%' }}
      onSearch={setSearchText}
      filterOption={false}
      notFoundContent={<div className="text-center py-2">Không tìm thấy biểu tượng</div>}
      suffixIcon={value ? renderIcon(value) : null}
    >
      {filteredIcons.map(iconName => {
        const IconComponent = AntdIcons[iconName as keyof typeof AntdIcons] as React.ComponentType;
        return (
          <Option key={iconName} value={iconName}>
            <Space>
              {IconComponent && <IconComponent />}
              <span>{iconName.replace('Outlined', '')}</span>
            </Space>
          </Option>
        );
      })}
    </Select>
  );
};

export default IconSelect;
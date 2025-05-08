// src/features/site-layout/components/CanvasControlsHelp.tsx
import React from 'react';
import { Modal, Typography, Space, Row, Col } from 'antd';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  DragOutlined,
  FullscreenOutlined,
  AimOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface CanvasControlsHelpProps {
  visible: boolean;
  onClose: () => void;
}

const CanvasControlsHelp: React.FC<CanvasControlsHelpProps> = ({ visible, onClose }) => {
  return (
    <Modal
      title={
        <Space>
          <QuestionCircleOutlined />
          <span>Hướng dẫn điều khiển mặt bằng</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Typography>
        <Paragraph>
          Mặt bằng công trường cho phép bạn phóng to, thu nhỏ và di chuyển tự do 
          giống như AutoCAD. Dưới đây là các cách điều khiển:
        </Paragraph>

        <Title level={4}>Di chuyển chuột</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Space direction="vertical" className="text-center w-full">
              <AimOutlined style={{ fontSize: 24 }} />
              <Text strong>Cuộn chuột</Text>
              <Text>Phóng to / thu nhỏ</Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" className="text-center w-full">
              <DragOutlined style={{ fontSize: 24 }} />
              <Text strong>Shift + Kéo chuột</Text>
              <Text>Di chuyển mặt bằng</Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" className="text-center w-full">
              <AimOutlined style={{ fontSize: 24 }} />
              <Text strong>Nhấp chuột</Text>
              <Text>Chọn đối tượng</Text>
            </Space>
          </Col>
        </Row>

        <Title level={4} className="mt-4">Bàn phím</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Space direction="vertical" className="text-center w-full">
              <Text strong>Ctrl + +</Text>
              <ZoomInOutlined style={{ fontSize: 24 }} />
              <Text>Phóng to</Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" className="text-center w-full">
              <Text strong>Ctrl + -</Text>
              <ZoomOutOutlined style={{ fontSize: 24 }} />
              <Text>Thu nhỏ</Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" className="text-center w-full">
              <Text strong>Ctrl + 0</Text>
              <FullscreenOutlined style={{ fontSize: 24 }} />
              <Text>Khớp màn hình</Text>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-2">
          <Col span={8}>
            <Space direction="vertical" className="text-center w-full">
              <Text strong>Shift</Text>
              <DragOutlined style={{ fontSize: 24 }} />
              <Text>Kích hoạt kéo mặt bằng</Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" className="text-center w-full">
              <Text strong>Delete</Text>
              <Text style={{ fontSize: 24 }}>🗑️</Text>
              <Text>Xóa đối tượng đã chọn</Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" className="text-center w-full">
              <Text strong>Enter</Text>
              <Text style={{ fontSize: 24 }}>⏎</Text>
              <Text>Mở thuộc tính đối tượng</Text>
            </Space>
          </Col>
        </Row>

        <Title level={4} className="mt-4">Thiết bị cảm ứng</Title>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Space direction="vertical" className="text-center w-full">
              <Text strong>Vuốt với 1 ngón tay</Text>
              <DragOutlined style={{ fontSize: 24 }} />
              <Text>Di chuyển mặt bằng (khi nhấn shift)</Text>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" className="text-center w-full">
              <Text strong>Chụm / Tách 2 ngón tay</Text>
              <Space>
                <ZoomInOutlined style={{ fontSize: 18 }} />
                <ZoomOutOutlined style={{ fontSize: 18 }} />
              </Space>
              <Text>Phóng to / thu nhỏ</Text>
            </Space>
          </Col>
        </Row>

        <Paragraph className="mt-4">
          <blockquote className="p-3 bg-blue-50 border-l-4 border-blue-500 mt-4">
            <Text strong>Lưu ý quan trọng:</Text>
            <br />
            <Text>
              1. Để <b>di chuyển mặt bằng</b>, hãy nhấn giữ phím <b>Shift</b> và kéo chuột.
              <br />
              2. Để <b>di chuyển đối tượng</b>, chỉ cần nhấp chọn và kéo đối tượng đó.
              <br />
              3. Nhấp đôi để mở cửa sổ chỉnh sửa thuộc tính đối tượng.
            </Text>
          </blockquote>
        </Paragraph>
      </Typography>
    </Modal>
  );
};

export default CanvasControlsHelp;
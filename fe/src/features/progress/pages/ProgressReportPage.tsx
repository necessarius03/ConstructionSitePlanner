// fe/src/features/progress/pages/ProgressReportPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, Select, DatePicker, Card, Typography, Row, Col, Spin, Empty, Progress as AntProgress, Table, message } from 'antd';
import { 
  FileExcelOutlined, 
  FilePdfOutlined, 
  PrinterOutlined,
  BarChartOutlined,
  PieChartOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import ProgressService, { Progress, ProgressStatus } from '../../../services/ProgressService';
import SiteLayoutService from '../../../services/SiteLayoutService';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Cell, Pie, Bar } from 'recharts';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProgressReportPage: React.FC = () => {
  const { siteLayoutId } = useParams<{ siteLayoutId: string }>();
  const navigate = useNavigate();
  
  const [progress, setProgress] = useState<Progress[]>([]);
  const [filteredProgress, setFilteredProgress] = useState<Progress[]>([]);
  const [siteLayoutName, setSiteLayoutName] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [statusFilter, setStatusFilter] = useState<ProgressStatus | 'all'>('all');
  const [completionFilter, setCompletionFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (siteLayoutId) {
      fetchProgressData();
      fetchSiteLayoutData();
    } else {
      message.error('Không tìm thấy mã mặt bằng');
      navigate('/progress');
    }
  }, [siteLayoutId]);

  useEffect(() => {
    if (progress) {
      applyFilters();
    }
  }, [progress, dateRange, statusFilter, completionFilter]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const data = await ProgressService.getProgressBySiteLayout(siteLayoutId!);
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      message.error('Không thể tải dữ liệu tiến độ');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSiteLayoutData = async () => {
    try {
      const layout = await SiteLayoutService.getLayoutById(siteLayoutId!);
      setSiteLayoutName(layout.name);
    } catch (error) {
      console.error('Error fetching site layout data:', error);
      message.error('Không thể tải thông tin mặt bằng');
    }
  };

  const applyFilters = () => {
    let filtered = [...progress];
    
    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(item => {
        const startDate = dayjs(item.startDate);
        const endDate = dayjs(item.endDate);
        return (
          (startDate.isAfter(dateRange[0]) || startDate.isSame(dateRange[0])) &&
          (endDate.isBefore(dateRange[1]) || endDate.isSame(dateRange[1]))
        );
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Apply completion filter
    if (completionFilter !== 'all') {
      const [min, max] = completionFilter.split('-').map(Number);
      filtered = filtered.filter(item => {
        return item.completionPercentage >= min && item.completionPercentage <= max;
      });
    }
    
    setFilteredProgress(filtered);
  };

  const resetFilters = () => {
    setDateRange(null);
    setStatusFilter('all');
    setCompletionFilter('all');
  };

  const generateStatusData = () => {
    const statusCounts = {
      not_started: 0,
      in_progress: 0,
      completed: 0,
      delayed: 0
    };
    
    filteredProgress.forEach(item => {
      statusCounts[item.status as keyof typeof statusCounts]++;
    });
    
    return [
      { name: 'Chưa bắt đầu', value: statusCounts.not_started },
      { name: 'Đang thực hiện', value: statusCounts.in_progress },
      { name: 'Hoàn thành', value: statusCounts.completed },
      { name: 'Bị trễ', value: statusCounts.delayed }
    ];
  };

  const generateCompletionData = () => {
    const completionGroups = {
      '0-25': 0,
      '26-50': 0,
      '51-75': 0,
      '76-99': 0,
      '100': 0
    };
    
    filteredProgress.forEach(item => {
      const percentage = item.completionPercentage;
      if (percentage === 0) {
        completionGroups['0-25']++;
      } else if (percentage <= 25) {
        completionGroups['0-25']++;
      } else if (percentage <= 50) {
        completionGroups['26-50']++;
      } else if (percentage <= 75) {
        completionGroups['51-75']++;
      } else if (percentage < 100) {
        completionGroups['76-99']++;
      } else {
        completionGroups['100']++;
      }
    });
    
    return [
      { name: '0-25%', value: completionGroups['0-25'] },
      { name: '26-50%', value: completionGroups['26-50'] },
      { name: '51-75%', value: completionGroups['51-75'] },
      { name: '76-99%', value: completionGroups['76-99'] },
      { name: '100%', value: completionGroups['100'] }
    ];
  };

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `Báo cáo tiến độ - ${siteLayoutName}`,
  });

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const ratio = canvas.width / canvas.height;
    const width = pdfWidth;
    const height = width / ratio;
    
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`BaoCaoTienDo_${siteLayoutName}.pdf`);
  };

  const exportToExcel = () => {
    // This is a placeholder for Excel export functionality
    // In a real application, you would use a library like xlsx
    alert('Excel export functionality would be implemented here');
  };

  const getStatusText = (status: ProgressStatus) => {
    switch (status) {
      case 'not_started':
        return 'Chưa bắt đầu';
      case 'in_progress':
        return 'Đang thực hiện';
      case 'completed':
        return 'Hoàn thành';
      case 'delayed':
        return 'Bị trễ';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProgressStatus) => getStatusText(status),
    },
    {
      title: 'Tiến độ',
      dataIndex: 'completionPercentage',
      key: 'completionPercentage',
      render: (percentage: number) => <AntProgress percent={percentage} size="small" />,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'responsiblePerson',
      key: 'responsiblePerson',
      render: (person: string) => person || '-',
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(`/site-layout/${siteLayoutId}`)}
            style={{ marginRight: 12 }}
          >
            Quay lại mặt bằng
          </Button>
          <Title level={3}>Báo cáo tiến độ: {siteLayoutName}</Title>
        </div>
        <div className="flex space-x-2">
          <Button 
            icon={<PrinterOutlined />} 
            onClick={handlePrint}
          >
            In báo cáo
          </Button>
          <Button 
            icon={<FilePdfOutlined />} 
            onClick={handleExportPDF}
          >
            Xuất PDF
          </Button>
          <Button 
            icon={<FileExcelOutlined />} 
            onClick={exportToExcel}
          >
            Xuất Excel
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Khoảng thời gian</label>
            <RangePicker 
              value={dateRange} 
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              style={{ width: 280 }}
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Trạng thái</label>
            <Select 
              value={statusFilter} 
              onChange={setStatusFilter}
              style={{ width: 180 }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="not_started">Chưa bắt đầu</Option>
              <Option value="in_progress">Đang thực hiện</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="delayed">Bị trễ</Option>
            </Select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Tiến độ</label>
            <Select 
              value={completionFilter} 
              onChange={setCompletionFilter}
              style={{ width: 150 }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="0-25">0-25%</Option>
              <Option value="26-50">26-50%</Option>
              <Option value="51-75">51-75%</Option>
              <Option value="76-99">76-99%</Option>
              <Option value="100-100">100%</Option>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button onClick={resetFilters}>Đặt lại bộ lọc</Button>
          </div>
        </div>
      </Card>

      <div ref={reportRef} className="bg-white p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">BÁO CÁO TIẾN ĐỘ CÔNG TRƯỜNG</h1>
          <h2 className="text-xl">{siteLayoutName}</h2>
          <p className="text-gray-500">
            Ngày tạo: {dayjs().format('DD/MM/YYYY')}
          </p>
          {dateRange && dateRange[0] && dateRange[1] && (
            <p className="text-gray-500">
              Khoảng thời gian: {dayjs(dateRange[0]).format('DD/MM/YYYY')} - {dayjs(dateRange[1]).format('DD/MM/YYYY')}
            </p>
          )}
        </div>

        <Row gutter={24} className="mb-6">
          <Col span={12}>
            <Card title={<div className="flex items-center"><BarChartOutlined className="mr-2" /> Phân bố trạng thái</div>}>
              {filteredProgress.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={generateStatusData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Số lượng" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="Không có dữ liệu" />
              )}
            </Card>
          </Col>
          <Col span={12}>
            <Card title={<div className="flex items-center"><PieChartOutlined className="mr-2" /> Phân bố tiến độ</div>}>
              {filteredProgress.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={generateCompletionData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {generateCompletionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="Không có dữ liệu" />
              )}
            </Card>
          </Col>
        </Row>

        <Card title="Danh sách tiến độ" className="mb-6">
          {filteredProgress.length > 0 ? (
            <Table
              columns={columns}
              dataSource={filteredProgress}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          ) : (
            <Empty description="Không có dữ liệu tiến độ phù hợp với bộ lọc" />
          )}
        </Card>

        <div className="mt-10">
          <div className="text-right">
            <div className="mb-16">
              <Text>Người lập báo cáo</Text>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressReportPage;
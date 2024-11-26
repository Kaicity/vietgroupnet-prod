import { Table } from 'antd';

const DataTable = ({
  pagination,
  isScroll,
  rows = [],
  columns,
  page,
  limit,
  total,
  onPageChange,
  rowSelection,
  title,
  loading,
  showExpand,
  expandColumns,
  expandDataSource,
}) => {
  const expandedRowRender = () => (
    <Table
      columns={expandColumns}
      dataSource={expandDataSource}
      pagination={false}
    />
  );

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      title={() => title}
      dataSource={
        Array.isArray(rows)
          ? rows.map((row, index) => ({ ...row, key: row.id || index }))
          : []
      }
      rowKey={(record) => record.id || record.key}
      pagination={
        pagination && {
          current: page,
          pageSize: limit,
          total,
          onChange: onPageChange,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `Tổng ${total} mục`,
        }
      }
      scroll={
        isScroll && {
          y: 470,
          x: 'max-content',
        }
      }
      style={{
        height: '100%',
      }}
      loading={loading}
      expandable={
        showExpand
          ? {
              expandedRowRender,
              expandIconColumnIndex: 1,
            }
          : undefined
      }
    />
  );
};

export default DataTable;

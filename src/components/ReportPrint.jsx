import React from 'react';

const ReportPrint = React.forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <h1>Báo cáo</h1>
      <p>Đây là nội dung của báo cáo...</p>
    </div>
  );
});

export default ReportPrint;

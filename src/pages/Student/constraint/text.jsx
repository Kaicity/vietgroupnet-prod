const handleDeleteMultiple = async () => {
    if (!selectedRows || selectedRows.length === 0) {
      setContent('Không có cộng tác viên nào được chọn để xóa.');
      setSeverity('warning');
      setIsShowMessage(true);
      return;
    }
  
    try {
      // Gửi yêu cầu xóa đồng thời
      const results = await Promise.allSettled(
        selectedRows.map((student) => deleteStudent(student.studentCode))
      );
  
      // Phân tích kết quả
      const failed = results.filter((res) => res.status === 'rejected');
      const succeeded = results.filter(
        (res) => res.status === 'fulfilled' && res.value.status === 'success'
      );
  
      if (failed.length > 0) {
        setContent(
          `Xóa thành công ${succeeded.length} cộng tác viên, thất bại ${failed.length} cộng tác viên.`
        );
        setSeverity('warning');
      } else {
        setContent('Đã xóa thành công tất cả cộng tác viên!');
        setSeverity('success');
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setIsVisibleDelete(false);
      }
  
      // Cập nhật danh sách sau khi xóa
      getDataStudents();
    } catch (error) {
      setContent('Có lỗi xảy ra trong quá trình xóa. Vui lòng thử lại.');
      setSeverity('error');
      console.error(error);
    } finally {
      setIsShowMessage(true);
    }
  };
  
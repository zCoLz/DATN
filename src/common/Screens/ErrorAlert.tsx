import { Modal } from 'antd';

const ErrorAlert = (title: any, content: any, path: string) => {
    Modal.error({
        title: title,
        className: 'custom-modal-alert',
        content: content,
        okText: 'OK',
        onOk: () => {
            // Xử lý đăng xuất và chuyển về trang login
            window.location.replace(path); // Chuyển hướng về trang login
        },
    });
};
export default ErrorAlert;

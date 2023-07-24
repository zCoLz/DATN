import { Modal } from 'antd';

const ErrorCommon = (title: any, content: any) => {
    Modal.error({
        title: title,
        className: 'custom-modal-alert',
        content: content,
        okText: 'OK',
    });
};
export default ErrorCommon;

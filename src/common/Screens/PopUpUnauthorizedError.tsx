import { Modal } from 'antd';
import React from 'react';
import UnauthorizedError from '../exception/unauthorized_error';
interface PopUpUnauthorizedErrorProps {
    title: string;
    content: string;
    onOk: () => void;
    onCanel: () => void;
}
const PopUpUnauthorizedError: React.FC<PopUpUnauthorizedErrorProps> = ({ title, content, onOk, onCanel }) => {
    const handleOk = () => {
        Modal.destroyAll();
        onOk();
    };
    const handleCancel = () => {
        Modal.destroyAll();
        onCanel();
    };
    return (
        <>
            <div>
                <Modal
                    title={title}
                    visible={true}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Có"
                    cancelText="Không"
                >
                    {content}
                </Modal>
            </div>
        </>
    );
};

export default PopUpUnauthorizedError;

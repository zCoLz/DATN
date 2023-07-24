import React, { useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { MdMoreVert } from 'react-icons/md';

interface Item {
    id: number;
    name: string;
}

interface Props {
    item: any;
    onDelete: (id: number) => void;
}

const CustomButtonDelete: React.FC<Props> = ({ item, onDelete }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const handleMenuClick = (e: any) => {
        if (e.key === 'delete') {
            onDelete(item.id);
        }
    };
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="delete">Xóa</Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} visible={dropdownVisible} onVisibleChange={(visible) => setDropdownVisible(visible)}>
            <button>
                <MdMoreVert size={20} />
            </button>
        </Dropdown>
    );
};

export default CustomButtonDelete;

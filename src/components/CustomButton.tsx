import React, { useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { MdMoreVert } from 'react-icons/md';
import { useParams } from 'react-router-dom';
interface Comment {
    id: number;
    content: string;
    last_name: string;
    first_name: string;
    comment_date: string;
    account_id: number;
}
interface File {
    file_id: string;
    file_name: string;
    file_type: string;
}
interface Item {
    id: number;
    content: string;
    post_category_id: number;
    files: File[];
    comments: Comment[];
    create_date: string;
    finish_date: string;
    start_date: string;
    title: string;
    last_name: string;
    first_name: string;
}

interface Props {
    item: Item;
    post_category_id: number;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

const CustomButton: React.FC<Props> = ({ item, onDelete, onEdit, post_category_id }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const handleMenuClick = (e: any) => {
        if (e.key === 'delete') {
            onDelete(item.id);
            setDropdownVisible(false);
        } else if (e.key === 'edit') {
            onEdit(item.id);
            setDropdownVisible(false);
        }
    };
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="delete">Xóa</Menu.Item>
            {post_category_id === 1 ? <Menu.Item key="edit">Sửa</Menu.Item> : ''}{' '}
        </Menu>
    );

    return (
        <div
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            <Dropdown
                overlay={menu}
                trigger={['click']}
                visible={dropdownVisible}
                onVisibleChange={(visible) => setDropdownVisible(visible)}
            >
                <button className="m-auto p-1 w-8 h-8 flex items-center justify-center hover:bg-slate-300 focus:bg-slate-300  rounded-full duration-300">
                    <MdMoreVert size={20} />
                </button>
            </Dropdown>
        </div>
    );
};

export default CustomButton;

import React, { useEffect, useState } from 'react';
import logoTruong from '../../img/Logotruong.png';
import { MenuOutlined } from '@ant-design/icons';
import iconUser from '../../img/iconUser.svg';
import { Drawer, Dropdown, Menu, Space } from 'antd';
import './style.scss';
import HeaderToken from '../../common/utils/headerToken';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import { MdAccountCircle, MdNotificationsNone } from 'react-icons/md';
import SystemConst from '../../common/consts/system_const';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
const BASE_URL = `${SystemConst.DOMAIN}`;
interface listNotification {
    class_name: string;
    classroom_id: number;
    create_date: string;
    id: number;
    message: '';
    post_id: number;
    read: boolean;
}
const HeaderHomeStudent = ({ list_notification }: { list_notification: any }) => {
    const [visbleDrawer, setVisibleDrawer] = useState(false);
    const [visbleNotification, setVisibleNotification] = useState(false);
    const [isData, setIsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isDataNoti, setIsDataNoti] = useState<listNotification[]>([]);

    const navigate = useNavigate();
    const handleDrawer = () => {
        setVisibleDrawer(true);
        handleFetchData();
    };
    const handleNavHome = () => {
        navigate('/sinh-vien');
    };
    useEffect(() => {
        handleFetchData();
    }, []);
    const config = HeaderToken.getTokenConfig();
    const handleFetchData = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            setLoading(true);
            axios
                .get(`${BASE_URL}/classrooms`, config)
                .then((response) => {
                    // Xử lý dữ liệu từ response
                    const data = response.data.response_data.list_classrooms;
                    const dataNoti = response.data.response_data.list_notifications;
                    console.log('data nè', data);
                    setIsData(data);
                    setIsDataNoti(dataNoti);
                    const unreadCount = isDataNoti.filter((notification) => !notification.read).length;
                    setNotificationCount(unreadCount);
                    //Chuyển dữ liệu khi tạo mới phòng
                })
                .catch((error) => {
                    const isError = UnauthorizedError.checkError(error);
                    if (!isError) {
                        const content = 'Lỗi máy chủ';
                        const title = 'Lỗi';
                        ErrorCommon(title, content);
                    }
                    // Xử lý lỗi nếu có
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handlePassPageNoti = (item: any) => {
        console.log('dsadasdasdsa', item);
        // navigate(`/sinh-vien/class/${item['classroom_id']}`);
        if (item['read'] === false) {
            const data = {};
            axios.patch(`${BASE_URL}/students/${item['id']}/student-read-notification`, data, config).finally(() => {
                //window.location.replace(`/sinh-vien/class/${item['classroom_id']}`);
                handleFetchData();
            });
        }
        window.location.replace(`/sinh-vien/class/${item['classroom_id']}`);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.reload(); // Tải lại trang web
        window.location.replace('/');
    };
    //State Class Code
    const items = [
        {
            label: <button onClick={handleLogout}>Đăng xuất</button>,
            key: 1,
        },
    ];
    const handleFormatDate = (formatDate: any) => {
        return dayjs(formatDate).format('DD/MM/YYYY HH:mm');
    };
    const colorBg = (read: boolean) => {
        return read ? 'bg-white' : 'bg-slate-200';
    };
    return (
        <>
            <div className="bg-blue-400 shadow-md h-16 p-5 flex items-center justify-between">
                <div className="flex items-center">
                    <button className=" flex items-center justify-center ">
                        <MenuOutlined
                            className="hover:bg-gray-200 rounded-full p-2 flex items-center  transition duration-150 ease-in-out"
                            onClick={handleDrawer}
                            size={40}
                        />{' '}
                    </button>
                    <div>
                        <img className="h-12 cursor-pointer" src={logoTruong} alt="" />
                    </div>
                </div>

                <div>
                    <Dropdown
                        className="w-24"
                        menu={{
                            items,
                        }}
                        trigger={['click']}
                        overlayClassName="w-[10rem] z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-md text-center cursor-pointer"
                    >
                        <a
                            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Space>
                                <img className="w-9 h-9" src={iconUser} alt="" />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </div>
            <Drawer
                visible={visbleDrawer}
                maskClosable={true}
                onClose={() => setVisibleDrawer(false)}
                title={
                    <Space>
                        <button onClick={handleNavHome}>Danh sách lớp học phần</button>
                    </Space>
                }
                closable={true}
                placement="left"
                extra={
                    <Space>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <div className="max-h-[28rem] overflow-auto">
                                        {isDataNoti.map((item: any) => (
                                            <Menu.Item className="max-h-96 h-auto overflow-auto" key={item.id}>
                                                <button
                                                    onClick={() => handlePassPageNoti(item)}
                                                    className={`${colorBg(
                                                        item.read,
                                                    )} hover:text-black  hover:bg-slate-400 transition duration-500 w-full h-auto py-2 px-2 border-2 rounded-md flex flex-col items-center gap-x-2`}
                                                >
                                                    <span className="flex flex-col">
                                                        <span className="font-medium">{item.class_name}</span>
                                                    </span>
                                                    <span className="flex gap-x-3">
                                                        <span>{item.message}</span>
                                                        <span>{handleFormatDate(item.create_date)}</span>
                                                    </span>
                                                </button>
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu>
                            }
                            trigger={['click']}
                        >
                            <button className="hover:bg-slate-200 duration-200 transition-all p-2 rounded-full relative">
                                <div className="flex items-center justify-center">
                                    {notificationCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                            {notificationCount}
                                        </span>
                                    )}
                                    <MdNotificationsNone size={20} />
                                </div>
                            </button>
                        </Dropdown>
                    </Space>
                }
                footer={
                    <Space>
                        <button>Lưu lớp học phần</button>
                    </Space>
                }
            >
                <div>
                    <div>Giảng dạy</div>
                    <div className="mt-2">
                        <div className="flex flex-col gap-y-5 h-auto overflow-auto ">
                            {isData.map((item: any) => (
                                <Link
                                    to={`class/${item['id']}`}
                                    className="hover:text-black hover:bg-slate-200 transition duration-500   w-full h-auto py-2 px-2 border-2 rounded-md flex items-center gap-x-2"
                                >
                                    <span>
                                        <MdAccountCircle size={30} />
                                    </span>
                                    <span className="flex flex-col">
                                        <span className="font-medium">{item.class_name}</span>
                                        <span>
                                            Học kỳ {item.semester} - {item.school_year}
                                        </span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default HeaderHomeStudent;

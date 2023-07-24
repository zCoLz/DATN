import React, { useEffect, useState } from 'react';
import { Drawer, Dropdown, Menu, MenuProps, Modal, Space, Spin, Tabs, Tooltip } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { MenuOutlined } from '@ant-design/icons';
import ClassBulletin from '../../screens/Classbulletin/ClassBulletin';
import ClassroomExercisesStudent from '../../screens/ClassExercises/ClassroomExercisesStudent';
import '../../style/JoinClass.css';
import iconUser from '../../img/iconUser.svg';
import AllPeople from '../../screens/AllPeople';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ErrorAlert from '../../common/Screens/ErrorAlert';
import SystemConst from '../../common/consts/system_const';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import headerToken from '../../common/utils/headerToken';
import ClassBulletinStudent from '../../screens/Classbulletin/ClassBulletinStudent';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import HeaderToken from '../../common/utils/headerToken';
import { MdNotificationsNone, MdAccountCircle } from 'react-icons/md';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
interface listNotification {
    class_name: string;
    classroom_id: number;
    create_date: string;
    id: number;
    message: '';
    post_id: number;
    read: boolean;
}
const BASE_URL = `${SystemConst.DOMAIN}`;
const JoinClassedStudent = () => {
    const navigate = useNavigate();
    const { classroom_id } = useParams();
    const [isData, setIsData] = useState();
    const [isDataNoti, setIsDataNoti] = useState<listNotification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visbleDrawer, setVisibleDrawer] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isDataDrawer, setIsDataDawer] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            handleFetchData();
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };
    const handleFetchData = () => {
        const config = headerToken.getTokenConfig();
        setIsLoading(true);
        axios
            .get(`${SystemConst.DOMAIN}/classrooms/get-posts/${classroom_id}`, config)
            .then((response) => {
                const data = response.data.response_data;
                setIsData(data);
            })
            .catch((error) => {
                if (error) {
                    const isError = UnauthorizedError.checkError(error);

                    if (!isError) {
                        let content = '';
                        const {
                            status,
                            data: { error_message: errorMessage },
                        } = error.response;
                        if (status === 404 && errorMessage === 'Classroom no exist') {
                            content = 'Lớp không tồn tại';
                        } else if (status === 403 && errorMessage === 'No permission') {
                            content = 'Bạn không có quyền truy cập vào lớp này';
                        } else {
                            content = 'Lỗi máy chủ';
                        }
                        const title = 'Lỗi';
                        const path = '/sinh-vien';

                        ErrorAlert(title, content, path);
                    }
                } else {
                    const title = 'Lỗi';
                    const content = 'Máy chủ không hoạt động';
                    localStorage.clear();
                    const path = '/';
                    ErrorAlert(title, content, path);
                }
                // Xử lý lỗi nếu có
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    const items = [
        {
            label: <button onClick={handleLogout}>Đăng xuất</button>,
            key: 1,
        },
    ];
    const handleDrawer = () => {
        setVisibleDrawer(true);
        handleFetchDataDrawer();
    };
    useEffect(() => {
        handleFetchDataDrawer();
    }, []);
    const config = HeaderToken.getTokenConfig();
    const handleFetchDataDrawer = () => {
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
                    setIsDataDawer(data);
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
    const handleNavHome = () => {
        navigate('/sinh-vien');
    };
    const handlePassPage = (item: any) => {
        navigate(`/sinh-vien/class/${item['id']}`);
        // window.location.replace(`/sinh-vien/class/${item['id']}`);
        handleFetchData();
    };
    const handlePassPageNoti = (item: any) => {
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
    const handleFormatDate = (formatDate: any) => {
        return dayjs(formatDate).format('DD/MM/YYYY HH:mm');
    };
    const colorBg = (read: boolean) => {
        return read ? 'bg-white' : 'bg-slate-200';
    };
    return (
        <>
            {!isData ? (
                <Spin size="large" className="flex justify-center mt-[20rem]" spinning={isLoading} />
            ) : (
                <div className="h-16 p-5  shadow-md flex flex-grow sm:grid-cols-2 max-w-full ">
                    <div className=" basis-1/6 flex items-center full">
                        <button className="flex items-center justify-center ">
                            <MenuOutlined
                                className="hover:bg-gray-200 rounded-full p-2 flex items-center  transition duration-150 ease-in-out"
                                onClick={handleDrawer}
                                size={40}
                            />{' '}
                        </button>
                        <div className="h-auto w-auto ml-2">
                            <div className="block max-w-full overflow-hidden truncate ... w-44">
                                <Tooltip title={isData['class_name']}>
                                    <span className="truncate">{isData['class_name']}</span>
                                </Tooltip>
                            </div>
                            <span className="text-sm">{isData['title']}</span>
                        </div>
                    </div>
                    <div className="grid iphone 12:grid-flow-col basis-2/3 justify-center">
                        <Tabs className=" items-center " defaultActiveKey="1">
                            <TabPane className="" tab="Bảng Tin" key="1">
                                <ClassBulletinStudent onFetchData={handleFetchData} data={isData} />
                            </TabPane>
                            <TabPane className="" tab="Bài Tập Trên Lớp" key="2">
                                <ClassroomExercisesStudent data={isData} />
                            </TabPane>
                            <TabPane className="" tab="Mọi Người" key="3">
                                <AllPeople />
                            </TabPane>
                        </Tabs>
                    </div>
                    <div className="basis-1/6 flex justify-end">
                        <div>
                            <Dropdown
                                className="w-24"
                                menu={{
                                    items,
                                }}
                                trigger={['click']}
                                overlayClassName="w-[10rem] z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-md text-center"
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
                </div>
            )}
            {isDataDrawer ? (
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
                                        <Spin size="default" spinning={loading}>
                                            <div className="max-h-[28rem] overflow-auto">
                                                {isDataNoti.map((item: any) => (
                                                    <Menu.Item key={item.id}>
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
                                        </Spin>
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
                                {isDataDrawer.map((item: any) => (
                                    <button
                                        onClick={() => handlePassPage(item)}
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
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Drawer>
            ) : (
                ''
            )}
        </>
    );
};

export default JoinClassedStudent;

{
    /* <div>
                                            {isDataNoti.map((item: any) => (
                                                <Link to={`class/${item.id}`}>{item.class_name}</Link>
                                            ))}
                                        </div> */
}
{
    /* <Dropdown menu={{ items: menuItems }} trigger={['click']}>
    <a onClick={(e) => e.preventDefault}></a>
    <button className="hover:bg-slate-200 duration-200 transition-all p-2 rounded-full">
        <MdNotificationsNone size={20} />
    </button>
</Dropdown>; */
}

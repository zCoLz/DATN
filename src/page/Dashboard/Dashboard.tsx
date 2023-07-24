import { Dropdown, Layout, Menu, Space } from 'antd';
import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logoTruong from '../../img/Logotruong.png';
import './scss/styleDashboard.scss';
import { MdAccountCircle } from 'react-icons/md';
const { Sider, Content, Header } = Layout;
const Dashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/admin') {
            navigate('/admin/app-faculty');
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.history.replaceState(null, '', '/');
        window.location.replace('/');
        window.location.reload(); // Tải lại trang web
    };
    const items = [
        {
            label: <button onClick={handleLogout}>Đăng xuất</button>,
            key: 1,
        },
    ];
    return (
        <>
            <Layout className="min-h-screen">
                <Header className="bg-blue-400 py-2 ">
                    <div className="flex justify-between items-center">
                        <div className="min-w-full">
                            <img src={logoTruong} className="w-48" alt="Error" />
                        </div>
                        <div>
                            <div>
                                <Dropdown
                                    className="w-24"
                                    menu={{
                                        items,
                                    }}
                                    trigger={['click']}
                                    overlayClassName="w-[10rem] z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-md text-center cursor-pointer"
                                >
                                    <a onClick={(e) => e.preventDefault()}>
                                        <MdAccountCircle size={40} />
                                    </a>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </Header>
                <Layout>
                    <Sider width={200} theme="dark" className="bg-blue-400">
                        <Menu mode="vertical" selectedKeys={[location.pathname]} className="h-full bg-slate-300">
                            <Menu.Item key="admin/app-faculty">
                                <Link to="/admin/app-faculty">Khoa</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-genre">
                                <Link to="/admin/app-genre">Bộ môn</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-subject">
                                <Link to="/admin/app-subject">Môn học</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-teacher">
                                <Link to="/admin/app-teacher">Giảng Viên</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-student">
                                <Link to="/admin/app-student">Sinh viên</Link>
                            </Menu.Item>
                            <Menu.Item key="/app-class">
                                <Link to="/admin/app-class">Lớp</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-class-section">
                                <Link to="/admin/app-class-section">Lớp Học Phần</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-storage">
                                <Link to="/admin/app-storage">Lưu trữ</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content className="custom-main p-5">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default Dashboard;

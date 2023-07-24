import React, { useEffect, useState } from 'react';
import list from '../../data';
import iconUserSquare from '../../img/user.png';
import iconFolder from '../../img/folder.png';
import { Link } from 'react-router-dom';
import HeaderHomeStudent from '../HeaderHome/HeaderHomeStudent';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import Logout from '../../common/utils/logoutToken';
import { Spin } from 'antd';
import { MdAccountCircle } from 'react-icons/md';
import SystemConst from '../../common/consts/system_const';
import { io } from 'socket.io-client';

interface Item {
    id: number;
    title: string;
    school_year: string;
    teacher: string;
    img: string;
}

const HomeScreenStudent: React.FC = () => {
    const config = HeaderToken.getTokenConfig();
    const [screenClass, setScreenClass] = useState([]);
    const [dataNoti, setDataNoti] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            return window.location.replace('/');
        }
        handleFetchData();
        // const socket = io('https://103.116.9.71:3443');
        // socket.on('connect', () => {
        //     console.log('Connected to server');
        //   });
        // return () => {
        //     // Hủy kết nối khi component bị unmount
        //     socket.disconnect();
        //   };
    }, []);
    const handleFetchData = () => {
        setIsLoading(true);
        axios
            .get(`${SystemConst.DOMAIN}/classrooms`, config)
            .then((response) => {
                // Xử lý dữ liệu từ response
                const data = response.data.response_data;
                console.log('data', data);
                setScreenClass(data.list_classrooms);
                setDataNoti(data.list_notifications);
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
                setIsLoading(false);
            });
    };
    return (
        <>
            <div>
                <HeaderHomeStudent list_notification={dataNoti} />
                <div>
                    <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4  gap-x-8 gap-y-12  m-auto mt-12 px-12 ">
                        {screenClass.map((item) => (
                            <div
                                className="border bg-slate-50 drop-shadow-lg hover:shadow-xl shawdow- rounded-lg  cursor-pointer ease-in duration-300  w-auto max-h-80 h-[25rem] relative"
                                key={item['id']}
                            >
                                <div className="p-5 h-[6.5rem] bg-gray-400 rounded-t-md overflow-hidden truncate ...">
                                    <Link
                                        className="text-xl font-semibold hover:underline underline-offset-[5px]"
                                        to={`class/${item['id']}`}
                                    >
                                        <span className="">{item['class_name']}</span>
                                        <br />
                                        <span className="text-base truncate">
                                            Học kỳ {item['semester']} <span> - Năm học {item['school_year']}</span>
                                        </span>
                                    </Link>
                                </div>

                                <div className=" absolute right-6 top-[4.33rem]">
                                    <MdAccountCircle size={52} />
                                </div>

                                {/* <div className="mt-8 p-5 flex justify-between items-center"></div> */}
                            </div>
                        ))}
                    </section>
                </div>
                <div className="flex justify-center">
                    <Spin size="large" className="" spinning={isLoading} />
                </div>
            </div>
        </>
    );
};

export default HomeScreenStudent;

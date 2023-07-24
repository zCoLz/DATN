import React, { useEffect, useState } from 'react';
import SystemConst from '../../common/consts/system_const';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import { Button, Modal, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { MdOutbox } from 'react-icons/md';
import Notification from '../../components/Notification';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
interface DataType {
    nameclasssection: string;
    class: string;
    semester: number;
    schoolyear: number;
    action: React.ReactNode;
    detail: React.ReactNode;
    id: number;
}
const BASE_URL = `${SystemConst.DOMAIN}`;
const AppStorage = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên lớp học phần',
            dataIndex: 'nameclasssection',
        },
        {
            title: 'Lớp',
            dataIndex: 'class',
        },
        {
            title: 'Học kỳ',
            dataIndex: 'semester',
            width: '20%',
        },
        {
            title: 'Năm học',
            dataIndex: 'schoolyear',
            width: '20%',
        },
        {
            title: '',
            width: '10%',
            dataIndex: 'action',
        },
    ];
    const [dataStorage, setDataStorage] = useState<DataType[]>([]);
    const [storageModalVisible, setStorageModalVisible] = useState(false);
    const [selectedItemStorageClassName, setSelectedItemStorageClassName] = useState<{
        id?: number;
    } | null>(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            handleFecthDataStorge();
        }
    }, []);
    const handleFecthDataStorge = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/classrooms/get-storage-classrooms`, config)
            .then((response) => {
                const data_Storage = response.data.response_data;
                console.log(data_Storage);
                const newData: DataType[] = data_Storage.map(
                    (item: {
                        id: number;
                        class_name: any;
                        regular_class_name: any;
                        semester: any;
                        school_year: any;
                    }) => ({
                        id: item.id,
                        nameclasssection: item.class_name,
                        class: item.regular_class_name,
                        semester: item.semester,
                        schoolyear: item.school_year,
                        action: (
                            <>
                                <Tooltip title="Mở lớp lưu trữ">
                                    <button
                                        className="bg-blue-400 px-3 py-2 rounded-lg w-10 hover:text-white flex justify-center items-center"
                                        onClick={() => handleOpenStorage(item)}
                                    >
                                        <div>
                                            <MdOutbox size={20} />
                                        </div>
                                    </button>
                                </Tooltip>
                            </>
                        ),
                    }),
                );
                setDataStorage(newData);
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    const title = 'Lỗi';
                    let content = '';
                    {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const handleOptenStorageClass = () => {
        const config = HeaderToken.getTokenConfig();
        const classroom_id = selectedItemStorageClassName?.id;
        axios
            .patch(`${BASE_URL}/classrooms/${classroom_id}/open-storage`, {}, config)
            .then((response) => {
                handleFecthDataStorge();
                Notification('success', 'Thông báo', 'Mở lớp lưu trữ thành công');
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    const title = 'Lỗi';
                    let content = '';
                    const {
                        status,
                        data: { error_message: errorMessage },
                    } = error.response;
                    if (status === 400 && errorMessage === 'Required more information') {
                        content = 'Cần đầy đủ thông tin !!!';
                    } else if (status === 400 && errorMessage === 'Update not success') {
                        content = 'Cập nhật không thành công !!!';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const handleOpenStorage = (item: { id: any }) => {
        setSelectedItemStorageClassName(item);
        setStorageModalVisible(true);
    };
    const handleSubmitStorageClassSection = () => {
        handleOptenStorageClass();
        setStorageModalVisible(false);
    };
    return (
        <>
            <div className="mb-5 text-lg font-bold">Lưu Trữ Lớp Học Phần </div>
            <Table columns={columns} dataSource={dataStorage}></Table>
            <>
                <div>
                    <Modal
                        className="custom-delete"
                        title="Xác nhận mở"
                        visible={storageModalVisible}
                        onCancel={() => setStorageModalVisible(false)}
                        footer={null}
                    >
                        <div>
                            <p>Bạn có bạn muốn mở lại lớp đã lưu trữ ?</p>
                        </div>
                        <div className="flex justify-end h-full mt-20">
                            <Button onClick={handleSubmitStorageClassSection} type="primary" className="mr-5">
                                Xác nhận
                            </Button>
                            <Button onClick={() => setStorageModalVisible(false)} type="default" className="mr-5">
                                Hủy
                            </Button>
                        </div>
                    </Modal>
                </div>
            </>
        </>
    );
};

export default AppStorage;

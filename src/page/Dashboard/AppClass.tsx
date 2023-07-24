import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import './scss/styleDashboard.scss';
import { Button, Modal, Input, Spin } from 'antd';
import { MdPersonAdd } from 'react-icons/md';
import SelectOption from '../../components/SelectOption';
import SystemConst from '../../common/consts/system_const';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import Notification from '../../components/Notification';
import ErrorAlert from '../../common/Screens/ErrorAlert';
import { title } from 'process';
interface DataType {
    nameclass: string;
    subject: string;
    numberofstudent: number;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/admin`;
const AppClass = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [nameClass, setNameClass] = useState('');
    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
    const [errorMessage, setErrorMessage] = useState(false);
    const [isOption, setIsOption] = useState<any[]>([]);
    const [selectedOptionSubject, setSelectedOptionSubjet] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên lớp',
            dataIndex: 'nameclass',
        },
        {
            title: 'Bộ môn',
            dataIndex: 'subject',
        },
        {
            title: 'Số lượng sinh viên',
            dataIndex: 'numberofstudent',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    useEffect(() => {
        handleFecthData();
    }, []);
    const [dataClass, setDataClass] = useState<DataType[]>([]);
    const handleFecthData = () => {
        const config = HeaderToken.getTokenConfig();
        setLoading(true);
        axios
            .get(`${BASE_URL}/regular-class`, config)
            .then((response) => {
                const Api_data_Class = response.data.response_data;
                console.log('Data:', Api_data_Class);
                setIsOption(Api_data_Class);
                const newData: DataType[] = Api_data_Class.map(
                    (item: {
                        class_name: any;
                        id: any;
                        Department: { department_name: any };
                        student_quantity: any;
                    }) => ({
                        id: item.id,
                        nameclass: item.class_name,
                        subject: item.Department.department_name,
                        numberofstudent: item.student_quantity,
                        action: (
                            <>
                                <div className="flex gap-x-1">
                                    <button
                                        className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
                                        // onClick={() => handleEdit(item)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
                                        // onClick={() => handleDelete(item)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </>
                        ),
                    }),
                );
                setDataClass(newData);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                if (error) {
                    const isError = UnauthorizedError.checkError(error);
                    if (!isError) {
                        const title = 'Lỗi';
                        let content = '';
                        {
                            content = 'Lỗi máy chủ';
                        }
                        ErrorCommon(title, content);
                    }
                } else {
                    const title = 'Lỗi';
                    const content = 'Máy chủ không hoạt động';
                    localStorage.clear();
                    ErrorCommon(title, content);
                }
            });
    };
    const handleCreateClass = () => {
        const config = HeaderToken.getTokenConfig();
        const data = { class_name: nameClass, department_id: selectedOptionSubject };
        axios
            .post(`${BASE_URL}/regular-class/create-regular-class`, data, config)
            .then((response) => {
                const Api_create_class = response.data.response_data;
                console.log('data: ', Api_create_class);
                setNameClass('');
                setOpenModal(false);
                handleFecthData();
                handleSuccesCreateClassRegularClass();
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    let content = '';
                    const title = 'Lỗi';
                    const {
                        status,
                        data: { error_message: errorMessage },
                    } = error.response;
                    if (status === 400 && error === 'Required more information') {
                        content = 'Cần gửi đầy đủ thông tin';
                    } else if (status === 400 && errorMessage === 'Not exist') {
                        content = 'Khoa không tồn tại';
                    } else if (status === 409 && errorMessage === 'Already exist') {
                        content = 'Bộ môn đã tồn tại';
                    } else if (status === 400 && errorMessage === 'Create not success') {
                        content = 'Tạo bộ môn không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
                console.error(error);
            });
    };
    const handleFecthDataOption = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/subjects/get-subjects`, config)
            .then((response) => {
                const Api_data_option = response.data.response_data;
                console.log('data option: ', Api_data_option);
                setIsOption(Api_data_option);
            })
            .catch((error) => {
                setLoading(false);
                if (error) {
                    const isError = UnauthorizedError.checkError(error);
                    if (!isError) {
                        const title = 'Lỗi';
                        let content = '';
                        {
                            content = 'Lỗi máy chủ';
                        }
                        ErrorCommon(title, content);
                    }
                } else {
                    const title = 'Lỗi';
                    const content = 'Máy chủ không hoạt động';
                    localStorage.clear();
                    ErrorCommon(title, content);
                }
            });
    };
    const handleEdit = (row: DataType) => {
        setEditedData(row);
        setOpenModalEdit(true);
    };

    const handleDelete = (row: DataType) => {
        setSelectedDeleteData(row);
        setDeleteModalVisible(true);
    };
    const handleOptionChangeSubject = (value: number | null) => {
        setSelectedOptionSubjet(value);
    };
    // Hàm hiển thị Modal
    const handleShowModal = () => {
        setOpenModal(true);
        handleFecthDataOption();
    };
    const handleCancel = () => {
        setOpenModal(false);
    };

    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    //Hàm xử lí lưu giá trị đã chọn trong Option
    const handleOptionChange = (value: number | null) => {
        setSelectedOption(value);
    };
    //Hàm xử lí khi người dùng ấn vào Lưu để trả dữ liệu
    const handleSubmitCreateSubject = () => {
        if (nameClass.length === 0) {
            setErrorMessage(true);
        } else if (!isOption) {
            setErrorMessage(true);
        } else {
            handleCreateClass();
        }
    };
    //Xử lí cập nhập lại dữ liệu đã sửa
    const handleSubmitEditSubject = () => {
        if (nameClass === '' || selectedOption === null) {
            setErrorMessage(true);
        } else {
            const FormData = {
                nameClass,
                selectedOption,
            };
            console.log('data', FormData);
            setOpenModal(false);
            setNameClass('');
            setSelectedOption(null);
            setErrorMessage(false);
        }
    };
    const handleSubmitOkDeleteSubject = () => {
        // Xử lý logic khi xóa dữ liệu
        setDeleteModalVisible(false); // Đóng Modal sau khi xóa
    };
    const handleSuccesCreateClassRegularClass = () => {
        Notification('success', 'Thông báo', 'Tạo lớp thành công !!!');
    };
    return (
        <>
            <div className="container mt-5">
                <div className="flex justify-end mb-5">
                    <Button type="primary" onClick={handleShowModal}>
                        <MdPersonAdd />
                    </Button>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center mt-40">
                        <Spin size="large" tip="Loading">
                            <div className="content mr-40" />
                        </Spin>
                    </div>
                ) : (
                    <Table
                        dataSource={dataClass}
                        columns={columns}
                        pagination={{
                            defaultPageSize: 6,
                            showSizeChanger: true,
                            pageSizeOptions: ['4', '6', '8', '12'],
                        }}
                    />
                )}
            </div>
            {/* Modal thêm lớp */}
            <>
                <Modal className="custom-modal-create_class" open={openModal} onCancel={handleCancel} footer={null}>
                    <div className="p-5">
                        <span className="text-base font-medium">Thêm lớp</span>
                        <div className="grid grid-cols-2 gap-2 mt-10 csrespone">
                            <div>
                                <label htmlFor="">Tên lớp</label>
                                <Input
                                    value={nameClass}
                                    className="bg-slate-200"
                                    onChange={(e) => {
                                        {
                                            setNameClass(e.target.value);
                                        }
                                    }}
                                />
                                {errorMessage && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                            </div>

                            <div className="flex flex-col ">
                                <label htmlFor="">Bộ môn</label>
                                {/* <SelectOption value={selectedOption} onChange={handleOptionChange} apiUrl="" /> */}
                                <select
                                    onChange={(e) => {
                                        handleOptionChangeSubject(Number(e.target.value));
                                    }}
                                    className="bg-slate-200 h-8 rounded-md focus:outline-none focus:border-blue-600 "
                                >
                                    <option value="" disabled selected hidden>
                                        Chọn Bộ Môn
                                    </option>
                                    {isOption.map((option: any) => (
                                        <option key={option.id} value={option.id}>
                                            {option.subject_name}
                                        </option>
                                    ))}
                                </select>
                                {errorMessage && <p className="text-red-500">Vui lòng chọn dữ liệu</p>}
                                {/* {errorMessage && !isOption ? (
                                    <div className="text-red-500 font-normal">Vui lòng chọn dữ liệu.</div>
                                ) : (
                                    ''
                                )} */}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end custom">
                        <Button onClick={handleSubmitCreateSubject} type="primary" className="mr-10 ">
                            Lưu
                        </Button>
                    </div>
                </Modal>
            </>
            {/* Modal Sửa */}
            <>
                <Modal className="custom-edit" footer={null} open={openModalEdit} onCancel={handleCancelEdit}>
                    <div className="p-5">
                        <span>Thêm lớp</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">Tên lớp</label>
                                <Input
                                    className="bg-slate-200"
                                    onChange={(e) => {
                                        {
                                            setNameClass(e.target.value);
                                        }
                                    }}
                                />{' '}
                                {!errorMessage && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                            </div>

                            <div className="flex flex-col ">
                                <label htmlFor="">Bộ môn</label>
                                {/* <SelectOption value={selectedOption} onChange={handleOptionChange} apiUrl="" /> */}
                                {errorMessage && <p className="text-red-500">Vui lòng chọn dữ liệu</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSubmitEditSubject} type="primary" className="mr-5 ctmEdit">
                            Lưu
                        </Button>
                    </div>
                </Modal>
            </>
            {/* Modal Xóa */}
            <>
                <div>
                    <Modal
                        className="custom-delete "
                        title="Xác nhận xóa"
                        visible={deleteModalVisible}
                        onCancel={() => setDeleteModalVisible(false)}
                        footer={null}
                    >
                        <div>
                            <p>Bạn có chắc chắn muốn xóa không?</p>
                        </div>
                        <div className="flex justify-end h-full mt-20">
                            <Button onClick={handleSubmitOkDeleteSubject} type="primary" className="mr-5">
                                Xóa
                            </Button>
                            <Button onClick={() => setDeleteModalVisible(false)} type="default" className="mr-5">
                                Hủy
                            </Button>
                        </div>
                    </Modal>
                </div>
            </>
        </>
    );
};

export default AppClass;

import { Button, Modal, Input, Spin } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { MdPersonAdd } from 'react-icons/md';
import Notification from '../../components/Notification';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import HeaderToken from '../../common/utils/headerToken';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
interface DataType {
    facultyname: string;
    numberofsubjects: number;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/admin/faculties`;
const AppFaculty = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên khoa',
            dataIndex: 'facultyname',
        },
        {
            title: 'Số lượng bộ môn',
            dataIndex: 'numberofsubjects',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    const [dataFaculty, setDataFaculy] = useState<DataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItemEdit, setSelectedItemEdit] = useState<{ id?: number; faculty_name: string } | null>(null);
    const [selectedItemDetele, setSelectedItemDelete] = useState<{ id?: number } | null>(null);

    //Xử lý Call APU Get Data
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            handleFecthData();
        }
        handleFecthData();
    }, []);
    const handleFecthData = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(BASE_URL, config)
            .then((response) => {
                const Api_Data_Faculty = response.data.response_data;
                console.log('data: ', Api_Data_Faculty);
                const newData: DataType[] = Api_Data_Faculty.map(
                    (item: { id: number; faculty_name: any; department_quantity: any }) => ({
                        facultyname: item.faculty_name,
                        numberofsubjects: item.department_quantity,
                        action: (
                            <>
                                <div className="flex gap-x-1">
                                    <button
                                        className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
                                        onClick={() => handleDelete(item)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </>
                        ),
                    }),
                );
                setDataFaculy(newData);
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    const content = 'Lỗi máy chủ';
                    const title = 'Lỗi';
                    ErrorCommon(title, content);
                }
            });
    };
    //Xử lý Call API Create
    const handleCreateFaculty = () => {
        const data = { faculty_name: isValueFaculty };

        console.log('Data: ', data);
        const config = HeaderToken.getTokenConfig();
        axios

            .post(`${BASE_URL}/create-faculty`, data, config)
            .then((response) => {
                handleFecthData();
                setIsValueFaculty('');
                setOpenModal(false);
                handleClickSuccess();
                console.log('Data', response);
                // const data = response.data.respone_data;
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
                    if (status === 400 && errorMessage === 'Required more information') {
                        content = 'Cần gửi đầy đủ thông tin';
                    } else if (status === 409 && errorMessage === 'Already exist') {
                        content = 'Khoa này đã tồn tại';
                    } else if (status === 400 && errorMessage === 'Create not success') {
                        content = 'Tạo khoa không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    //Xử lý Call API Update
    const handleUpdateFaculy = () => {
        const data = { faculty_id: selectedItemEdit?.id, faculty_name: selectedItemEdit?.faculty_name };
        const config = HeaderToken.getTokenConfig();
        axios
            .patch(`${BASE_URL}/update-faculty`, data, config)
            .then((response) => {
                handleClickEditSuccess();
                handleFecthData();
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
                        content = 'Cần gửi đầy đủ thông tin';
                    } else if (status === 409 && errorMessage === 'Already exist') {
                        content = 'Khoa này đã tồn tại';
                    } else if (status === 409 && errorMessage === 'Already exist no active') {
                        content =
                            'Khoa này không thể đổi tên khoa này. Nếu muốn có khoa này xin vui lòng bạn hãy tạo khoa mới !!!';
                    } else if (status === 400 && errorMessage === 'Update not success') {
                        content = 'Cập nhật khoa không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    //Xử lý Call API Delete
    const handleDeleteFaculty = () => {
        const dataDelete = selectedItemDetele?.id;
        const config = HeaderToken.getTokenConfig();
        axios
            .delete(`${BASE_URL}/delete-faculty/${dataDelete}`, config)
            .then((response) => {
                handleFecthData();
                handleClickDeleteSuccess();
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
                        content = 'Cần gửi đầy đủ thông tin';
                    } else if (status === 400 && errorMessage === 'Delete not success') {
                        content = 'Xóa khoa không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const handleSubmitCreateFaculty = () => {
        if (isValueFaculty.length === 0) {
            setErrorFaculty(true);
        } else {
            handleCreateFaculty();
        }
    };
    const handleSubmitEditFaculty = () => {
        handleUpdateFaculy();
        setOpenModalEdit(false);
    };
    const handleSubmitDeleteFaculty = () => {
        handleDeleteFaculty();
        setDeleteModalVisible(false);
    };

    //Khai báo các State quản lí trạng thái
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isValueFaculty, setIsValueFaculty] = useState('');
    const [errorFaculty, setErrorFaculty] = useState(false);

    const handleChangeValueFaculty = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = e.target.value;
        setIsValueFaculty(e.target.value);
        if (selectedValue !== '') {
            setErrorFaculty(false);
        }
    };

    const handleEdit = (item: { id: number; faculty_name: string }) => {
        setOpenModalEdit(true);
        setSelectedItemEdit(item);
    };

    const handleChangeEdit = (e: { target: { value: any } }) => {
        setSelectedItemEdit({ ...selectedItemEdit, faculty_name: e.target.value || null });
    };
    const handleDelete = (item: { id: number }) => {
        setDeleteModalVisible(true);
        setSelectedItemDelete(item);
    };

    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    const handleClickSuccess = () => {
        Notification('success', 'Thông báo', 'Tạo Khoa thành công');
    };
    const handleClickEditSuccess = () => {
        Notification('success', 'Thông báo', 'Cập nhật thành công khoa');
    };
    const handleClickDeleteSuccess = () => {
        Notification('success', 'Thông báo', 'Xóa thành công khoa');
    };
    return (
        <>
            <div className="container mt-5 ">
                <div className="flex justify-end mb-5">
                    <Button type="primary" onClick={handleShowModal}>
                        <MdPersonAdd />
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataFaculty}
                    loading={isLoading}
                    pagination={{
                        defaultPageSize: 6,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '6', '8', '12', '16'],
                    }}
                >
                    {/* <Spin spinning={isLoading} size="large"></Spin> */}
                </Table>
            </div>
            {/* Modal thêm khoa */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_faculty"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm khoa</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên khoa</label>
                            <Input
                                onChange={handleChangeValueFaculty}
                                value={isValueFaculty}
                                className="bg-slate-200"
                            />
                            {errorFaculty && <p className="text-red-500">Vui lòng điền vào chỗ trống</p>}
                        </div>

                        <div className="flex justify-end items-end ">
                            <Button onClick={handleSubmitCreateFaculty} type="primary" className="cstCreateFaculty">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa khoa */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_faculty"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa khoa</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên khoa</label>
                            <Input
                                onChange={(e) => handleChangeEdit({ target: e.target })}
                                value={selectedItemEdit?.faculty_name}
                                className="bg-slate-200"
                            />
                        </div>

                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEditFaculty} type="primary" className="cstCreateFaculty">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal xóa khoa */}
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
                            <Button onClick={handleSubmitDeleteFaculty} type="primary" className="mr-5">
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

export default AppFaculty;

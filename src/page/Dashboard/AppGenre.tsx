import { Modal, Input, Button } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { MdAddBox } from 'react-icons/md';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import Notification from '../../components/Notification';
const BASE_URL = `${SystemConst.DOMAIN}/admin`;
interface DataType {
    department_name: string;
    facultyname: string;
    numberofsubjects: number;
    nameofregularclass: number;
    action: React.ReactNode;
}
const AppGenre = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên bộ môn',
            dataIndex: 'department_name',
        },
        {
            title: 'Khoa',
            dataIndex: 'facultyname',
        },
        {
            title: 'Số môn học',
            dataIndex: 'numberofsubjects',
        },
        {
            title: 'Số lượng lớp',
            dataIndex: 'nameofregularclass',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    const [openModal, setOpenModal] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [errorGenre, setErrorGenre] = useState(false);
    const [nameGenre, setNameGenre] = useState('');
    const [selectedOptionGenre, setSelectedOptionGenre] = useState<number | null>(null);
    const [dataGenre, setDataGenre] = useState<DataType[]>([]);
    const [isOptions, setIsOptions] = useState<any[]>([]);
    const [isOptionEdit, setIsOptionEdit] = useState<any[]>([]);
    const [selectedItemEdit, setSelectedItemEdit] = useState<{
        id?: number;
        department_name: string;
        Faculty: { faculty_name: any };
    } | null>(null);
    const [selectedItemDetele, setSelectedItemDelete] = useState<{ id?: number } | null>(null);

    const handleFecthData = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/departments`, config)
            .then((response) => {
                const Api_Data_Faculty = response.data.response_data;
                console.log('data: ', Api_Data_Faculty);
                setIsOptions(Api_Data_Faculty);
                setIsOptionEdit(Api_Data_Faculty);
                const newData: DataType[] = Api_Data_Faculty.map(
                    (item: {
                        regular_class_quantity: any;
                        Faculty: any;
                        id: number;
                        department_name: any;
                        subject_quantity: any;
                    }) => ({
                        id: item.id,
                        department_name: item.department_name,
                        facultyname: item.Faculty.faculty_name,
                        numberofsubjects: item.subject_quantity,
                        nameofregularclass: item.regular_class_quantity,
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
                setDataGenre(newData);
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
    //Xử lý gọi dữ liệu ở trong Khoa
    const fetchDataSelectOption = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/faculties/get-faculties`, config)
            .then((response) => {
                const Api_all_faculty = response.data.response_data;
                console.log(Api_all_faculty);
                setIsOptions(Api_all_faculty);
                console.log(Api_all_faculty);
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
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            handleFecthData();
        }
    }, []);
    const handleCreateSubject = () => {
        const config = HeaderToken.getTokenConfig();
        const data = { department_name: nameGenre, faculty_id: selectedOptionGenre };
        console.log(data);
        axios
            .post(`${BASE_URL}/departments/create-department`, data, config)
            .then((response) => {
                setNameGenre('');
                setOpenModal(false);
                handleSuccesCreate();
                handleFecthData();
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
    const handleUpdateGenre = () => {
        const config = HeaderToken.getTokenConfig();
        const dataUpdate = { department_id: selectedItemEdit?.id, department_name: selectedItemEdit?.department_name };
        console.log(dataUpdate, ' dasdsad');
        axios
            .patch(`${BASE_URL}/departments/update-department`, dataUpdate, config)
            .then((response) => {
                handleSuccesUpdate();
                handleFecthData();
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
                    } else if (status === 409 && errorMessage === 'Already exist no active') {
                        content =
                            'Bộ môn này không thể đổi tên khoa này. Nếu muốn có bộ môn này xin vui lòng bạn hãy tạo bộ môn mới !!!';
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
    const handleSubjectDelete = () => {
        const config = HeaderToken.getTokenConfig();
        const dataDelete = selectedItemDetele?.id;
        axios
            .delete(`${BASE_URL}/departments/delete-department/${dataDelete}`, config)
            .then(() => {
                handleSuccesDelete();
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
                    } else if (status === 400 && errorMessage === 'Delete not success') {
                        content = 'Xóa bộ môn không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const handleEdit = (item: { id: number; Faculty: { faculty_name: any }; department_name: any }) => {
        setEditModalVisible(true);
        setSelectedItemEdit(item);
    };
    const handleChangeEdit = (e: { target: { value: any } }) => {
        setSelectedItemEdit({
            ...selectedItemEdit,
            Faculty: { faculty_name: selectedItemEdit?.Faculty.faculty_name },
            department_name: e.target.value || null,
        });
    };
    const handleShowModal = () => {
        setOpenModal(true);
        fetchDataSelectOption();
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const handleCancelEdit = () => {
        setEditModalVisible(false);
    };
    const handleDelete = (item: { id: number }) => {
        setDeleteModalVisible(true);
        setSelectedItemDelete(item);
    };
    const handleSubmitCreateGenre = () => {
        if (nameGenre.length === 0) {
            setErrorGenre(true);
        } else if (!selectedOptionGenre) {
            setErrorGenre(true);
        } else {
            handleCreateSubject();
            handleFecthData();
        }
    };
    const handleSubmitEditGenre = () => {
        handleUpdateGenre();
        setEditModalVisible(false);
    };
    const handleSubmitDeleteGenre = () => {
        handleSubjectDelete();
        setDeleteModalVisible(false);
    };
    const handleOptionChangeGenre = (value: number | null) => {
        setSelectedOptionGenre(value);
    };
    const handleChangeNameGenre = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameGenre(e.target.value);
        const selectValue = e.target.value;
        if (selectValue !== '') {
            setErrorGenre(false);
        }
    };
    const handleSuccesCreate = () => {
        Notification('success', 'Thông báo', 'Thêm bộ môn thành công');
    };
    const handleSuccesUpdate = () => {
        Notification('success', 'Thông báo', 'Cập nhật bộ môn thành công');
    };
    const handleSuccesDelete = () => {
        Notification('success', 'Thông báo', 'Xóa thành công bộ môn');
    };
    return (
        <>
            <div className="container mt-5">
                {' '}
                <div className="flex justify-end mb-5">
                    <Button type="primary" onClick={handleShowModal}>
                        <MdAddBox />
                    </Button>
                </div>
                <Table
                    dataSource={dataGenre}
                    columns={columns}
                    pagination={{
                        defaultPageSize: 6,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '6', '8', '12', '16'],
                    }}
                />
            </div>
            <div className="">
                {/* Modal thêm bộ môn */}
                <>
                    <Modal className="custom-modal-genre" open={openModal} onCancel={handleCancel} footer={null}>
                        <div className="p-5">
                            <span>Thêm bộ môn</span>
                            <div className="grid grid-cols-2 gap-2 mt-10">
                                <div>
                                    <label htmlFor="">Tên bộ môn</label>
                                    <Input
                                        value={nameGenre}
                                        onChange={handleChangeNameGenre}
                                        className="bg-slate-200"
                                    />
                                    {errorGenre && <p className="text-red-500">Vui lòng điền bộ môn</p>}
                                </div>
                                <div>
                                    <label htmlFor="">Khoa</label>
                                    <div className="flex flex-col">
                                        <select
                                            onChange={(e) => {
                                                handleOptionChangeGenre(Number(e.target.value));
                                            }}
                                            className="bg-slate-200 h-8 rounded-md focus:outline-none focus:border-blue-600 "
                                        >
                                            <option value="" disabled selected hidden>
                                                Chọn Khoa
                                            </option>
                                            {isOptions.map((option: any) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.faculty_name}
                                                </option>
                                            ))}
                                            <label htmlFor="Chọn Khoa"></label>
                                        </select>
                                    </div>
                                    {errorGenre && <p className="text-red-500">Vui lòng chọn khoa</p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end px-5 items-end ctmGenre">
                            <Button onClick={handleSubmitCreateGenre} value="" type="primary" className="mt-5">
                                Lưu
                            </Button>
                        </div>
                    </Modal>
                    {/* Modal sửa bộ môn */}
                </>
                <>
                    <Modal
                        className="custom-modal-genre"
                        open={editModalVisible}
                        onCancel={handleCancelEdit}
                        footer={null}
                    >
                        <div className="p-5">
                            <span>Sửa bộ môn</span>
                            <div className="grid grid-cols-2 gap-2 mt-10">
                                <div>
                                    <label htmlFor="">Tên bộ môn</label>
                                    <Input
                                        // value={selectedItemEdit?.department_name}
                                        onChange={(e) => handleChangeEdit({ target: { value: e.target.value } })}
                                        className="bg-slate-200"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Khoa</label>
                                    <div className="flex flex-col">
                                        {/* <SelectOption
                                            onChange={handleOptionChangeGenre}
                                            value={selectedOptionGenre}
                                            apiUrl=""
                                        /> */}
                                        <select
                                            disabled
                                            onChange={(e) => {
                                                handleOptionChangeGenre(Number(e.target.value));
                                            }}
                                            className="bg-slate-200 h-8 rounded-md focus:outline-none focus:border-blue-600 "
                                        >
                                            <option value={selectedItemEdit?.id} disabled selected hidden>
                                                {selectedItemEdit?.Faculty.faculty_name}
                                            </option>
                                            {isOptionEdit.map((option: any) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.faculty_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end px-5 items-end ctmGenre">
                            <Button onClick={handleSubmitEditGenre} type="primary" className="mt-5">
                                Lưu
                            </Button>
                        </div>
                    </Modal>
                </>
                <></>
                {/* Modal xóa bộ môn */}
                <>
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
                            <Button onClick={handleSubmitDeleteGenre} type="primary" className="mr-5">
                                Xóa
                            </Button>
                            <Button onClick={() => setDeleteModalVisible(false)} type="default" className="mr-5">
                                Hủy
                            </Button>
                        </div>
                    </Modal>
                </>
            </div>
        </>
    );
};

export default AppGenre;

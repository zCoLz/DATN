import { Button, Input, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { MdAddBox, MdPersonAdd } from 'react-icons/md';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import HeaderToken from '../../common/utils/headerToken';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import Notification from '../../components/Notification';
interface DataType {
    subjecttitle: string;
    subject: string;
    credits: number;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/admin`;
const AppSubject = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên môn học',
            dataIndex: 'subjecttitle',
        },
        {
            title: 'Tín chỉ',
            dataIndex: 'credits',
        },
        {
            title: 'Bộ môn',
            dataIndex: 'subject',
        },
        { title: 'Hành động', dataIndex: 'action' },
    ];

    const [dataSubject, setDataSubject] = useState<DataType[]>([]);
    const [selectedItemEditSubjectName, setSelectedItemEditSubjectName] = useState<{
        id?: number;
        subject_name: string;
        Department: { department_name: any };
    } | null>(null);
    const [selectedItemEditCredit, setSelectedItemEditCredit] = useState<{
        id?: number;
        credit: number;
        Department: { department_name: any };
    } | null>(null);
    const [isOptionEdit, setIsOptionEdit] = useState<any[]>([]);
    const [selectedItemDetele, setSelectedItemDelete] = useState<{ id?: number } | null>(null);
    const handleFecthData = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/subjects`, config)
            .then((response) => {
                const Api_data_Subject = response.data.response_data;
                console.log('Data: ', Api_data_Subject);
                const newData: DataType[] = Api_data_Subject.map(
                    (item: { Department: any; subject_name: any; id: number; department_name: any; credit: any }) => ({
                        id: item.id,
                        subjecttitle: item.subject_name,
                        credits: item.credit,
                        subject: item.Department.department_name,
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
                setDataSubject(newData);
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
    const selectOptionAPISubject = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/departments/get-departments`, config)
            .then((response) => {
                const Api_option = response.data.response_data;
                setIsOptions(Api_option);
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
    const handlecCreateSubject = () => {
        const dataSubject = { subject_name: nameSubject, credit: credits, department_id: selectOptionSubject };
        console.log('data: ', dataSubject);
        const config = HeaderToken.getTokenConfig();
        axios
            .post(`${BASE_URL}/subjects/create-subject`, dataSubject, config)
            .then(() => {
                setNameSubject('');
                setCredits('');
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
                    if (status === 400 && errorMessage === 'Required more information') {
                        content = 'Cần gửi đầy đủ thông tin';
                    } else if (status === 409 && errorMessage === 'Already exist') {
                        content = 'Môn học này đã tồn tại';
                    } else if (status === 400 && errorMessage === 'Create not success') {
                        content = 'Tạo môn học không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const handleUpdateSubject = () => {
        const dataSubject = {
            subject_name: selectedItemEditSubjectName?.subject_name,
            credit: selectedItemEditCredit?.credit,
            subject_id: selectedItemEditSubjectName?.id,
        };
        console.log('data: ', dataSubject);
        const config = HeaderToken.getTokenConfig();
        axios
            .patch(`${BASE_URL}/subjects/update-subject`, dataSubject, config)
            .then(() => {
                setNameSubject('');
                setCredits('');
                handleFecthData();
                handleSuccesUpdate();
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
                    } else if (status === 409 && errorMessage === 'Already exist no active') {
                        content =
                            'Môn học này không thể đổi tên ... này. Nếu muốn có môn học này xin vui lòng bạn hãy tạo môn học mới !!!';
                    } else if (status === 400 && errorMessage === 'Create not success') {
                        content = 'Tạo khoa không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const handleDeleSubject = () => {
        const dataSubject = selectedItemDetele?.id;
        const config = HeaderToken.getTokenConfig();
        axios
            .delete(`${BASE_URL}/subjects/delete-subjects/${dataSubject}`, config)
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
                        content = 'Xóa môn học không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isOptions, setIsOptions] = useState<any[]>([]);
    const [selectOptionSubject, setSelectOptionSubject] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [nameSubject, setNameSubject] = useState('');
    const [credits, setCredits] = useState('');
    const [error, setError] = useState(false);

    const handleChangeNameSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setNameSubject(inputValue);
    };
    const handleChangeEditSubjectName = (e: { target: { value: any } }) => {
        setSelectedItemEditSubjectName({
            ...selectedItemEditSubjectName,
            Department: { department_name: selectedItemEditSubjectName?.Department.department_name },
            subject_name: e.target.value || null,
        });
    };
    const handleChangeEditCredit = (e: { target: { value: any } }) => {
        setSelectedItemEditCredit({
            ...selectedItemEditCredit,
            Department: { department_name: selectedItemEditCredit?.Department.department_name },
            credit: e.target.value || null,
        });
    };
    const handleChangeCredits = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const regex = /^[0-9\b]+$/; // Biểu thức chính quy cho số kiểu int
        if (inputValue === '' || regex.test(inputValue)) {
            setCredits(inputValue);
        }
    };

    const handleEdit = (item: { id: number; Department: { department_name: any }; subject_name: any; credit: any }) => {
        setSelectedItemEditSubjectName(item);
        setSelectedItemEditCredit(item);
        setOpenModalEdit(true);
    };
    const handleDelete = (item: { id: number }) => {
        setSelectedItemDelete(item);
        setDeleteModalVisible(true);
    };

    const handleShowModal = () => {
        setOpenModal(true);
        selectOptionAPISubject();
    };
    // const handleShowModalEdit = () => {
    //     setOpenModalEdit(true);
    // };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    const handleSubmitCreateSubject = () => {
        if (nameSubject.length === 0) {
            setError(true);
        } else if (credits.length === 0) {
            setError(true);
        } else if (!selectOptionSubject) {
            setError(true);
        } else {
            handlecCreateSubject();
        }
    };

    const handleSubmitEditSubject = () => {
        handleUpdateSubject();
        setOpenModalEdit(false);
    };
    const handleSubmitDeleteSubject = () => {
        handleDeleSubject();
        setDeleteModalVisible(false);
    };
    const handleOptionChangeSubject = (value: number | null) => {
        setSelectOptionSubject(value);
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
                <div className="flex justify-end mb-5">
                    <Button type="primary" onClick={handleShowModal}>
                        <MdAddBox />
                    </Button>
                </div>
                <Table dataSource={dataSubject} columns={columns} />
            </div>

            <div className="">
                {/* Modal Thêm Môn Học*/}
                <Modal className="custom-modal-subject h-auto" open={openModal} onCancel={handleCancel} footer={null}>
                    <div className="p-5">
                        <span className="text-base font-medium">Thêm môn học</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">Tên môn học</label>
                                <Input
                                    onChange={handleChangeNameSubject}
                                    value={nameSubject}
                                    className="bg-slate-200"
                                />
                                {error && <p className="text-red-500">Vui lòng nhập tên môn học</p>}
                            </div>
                            <div>
                                <label htmlFor="">Tín chỉ</label>
                                <Input onChange={handleChangeCredits} value={credits} className="bg-slate-200" />
                                {error && <p className="text-red-500">Vui lòng nhập số tín chỉ</p>}
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="">Bộ môn</label>
                                {/* <SelectOption
                                    onChange={handleOptionChangeSubject}
                                    value={selectOptionSubject}
                                    apiUrl=""
                                /> */}
                                <select
                                    onChange={(e) => {
                                        handleOptionChangeSubject(Number(e.target.value));
                                    }}
                                    className="bg-slate-200 h-8 rounded-md focus:outline-none focus:border-blue-600 "
                                >
                                    <option value="" disabled selected hidden>
                                        Chọn Bộ Môn
                                    </option>
                                    {isOptions.map((Department: any) => (
                                        <option key={Department.id} value={Department.id}>
                                            {Department.department_name}
                                        </option>
                                    ))}
                                    <label htmlFor="Chọn Khoa"></label>
                                </select>
                                {error && <p className="text-red-500">Vui lòng chọn bộ môn</p>}
                            </div>
                        </div>

                        <div className="text-end ">
                            <Button onClick={handleSubmitCreateSubject} type="primary" className="mt-5 ctmSubject">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
                {/* Modal Sửa Môn Học*/}
                <Modal className="custom-modal-subject" open={openModalEdit} onCancel={handleCancelEdit} footer={null}>
                    <div className="p-5">
                        <span>Sửa môn học</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">Tên môn học</label>
                                <Input
                                    onChange={(e) => handleChangeEditSubjectName({ target: { value: e.target.value } })}
                                    value={selectedItemEditSubjectName?.subject_name}
                                    className="bg-slate-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Tín chỉ</label>
                                <Input
                                    onChange={(e) => handleChangeEditCredit({ target: { value: e.target.value } })}
                                    value={selectedItemEditCredit?.credit}
                                    className="bg-slate-200"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="">Bộ môn</label>
                                {/* <SelectOption
                                    onChange={handleOptionChangeSubject}
                                    value={selectOptionSubject}
                                    apiUrl=""
                                /> */}
                                <select
                                    disabled
                                    // onChange={(e) => {
                                    //     handleOptionChangeGenre(Number(e.target.value));
                                    // }}
                                    className="bg-slate-200 h-8 rounded-md focus:outline-none focus:border-blue-600 "
                                >
                                    <option value={selectedItemEditSubjectName?.id} disabled selected hidden>
                                        {selectedItemEditSubjectName?.Department.department_name}
                                    </option>
                                    {isOptionEdit.map((option: any) => (
                                        <option key={option.id} value={option.id}>
                                            {option.faculty_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="text-end">
                            <Button onClick={handleSubmitEditSubject} type="primary" className="mt-5 ctmSubject">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
                {/* Modal xóa subject */}
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
                            <Button onClick={handleSubmitDeleteSubject} type="primary" className="mr-5">
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

export default AppSubject;

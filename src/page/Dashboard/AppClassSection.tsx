import { Button, Col, Dropdown, Input, Menu, Modal, Row, Space, Spin, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useState, useEffect } from 'react';
import './scss/styleDashboard.scss';
import {
    MdBookmarkAdd,
    MdDelete,
    MdLockOpen,
    MdLockOutline,
    MdManageSearch,
    MdOutlineEditCalendar,
    MdOutlineMoreHoriz,
    MdOutlineSave,
    MdPreview,
} from 'react-icons/md';
import { Header } from 'antd/es/layout/layout';
import { Link, useNavigate } from 'react-router-dom';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import SystemConst from '../../common/consts/system_const';
import Notification from '../../components/Notification';
interface DataType {
    nameclasssection: string;
    class: string;
    semester: number;
    schoolyear: number;
    action: React.ReactNode;
    status: '1' | '2';
    detail: React.ReactNode;
}

const BASE_URL = `${SystemConst.DOMAIN}`;
const option = [
    {
        key: '1',
    },
    {
        key: '2',
    },
    {
        key: '3',
    },
    {
        key: '4',
    },
    {
        key: '5',
    },
    {
        key: '6',
    },
    {
        key: 'Học kỳ phụ',
    },
];
const AppClassSection: React.FC = () => {
    //Khai báo các useState
    const navigate = useNavigate();
    const [selectedItemStatus, setSelectedItemStatus] = useState<{ id?: number; status?: boolean } | null>(null);
    const [selectedItemDelete, setSelectedItemDelete] = useState<{ id?: number } | null>(null);
    const [selectedItemDetail, setSelectedItemDetail] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nameClass, setNameClass] = useState('');
    const [selectedNameTeacher, setSelectedNameTeacher] = useState('');
    const [schoolYear, SetSchoolYear] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectRefresh, setSubjectRefresh] = useState([]);
    const [teacherRefresh, setTeacherRefresh] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [error, setError] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [teacher, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [classesEdit, setClassesEdit] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [storageModalVisible, setStorageModalVisible] = useState(false);
    const [dataClassSection, setDataClassSection] = useState<DataType[]>([]);
    const [isOpenModalEdit, setIsModalOpenEdit] = useState(false);
    const [isOpenModalRowTable, setIsModalOpenModalRowTable] = useState(false);
    const [selectedItemEditClassName, setSelectedItemEditClassName] = useState<{
        id?: number;
        class_name: string;
    } | null>(null);
    const [selectedItemStorageClassName, setSelectedItemStorageClassName] = useState<{
        id?: number;
    } | null>(null);
    const [selectedItemEditSemester, setSelectedItemEditSemester] = useState<{
        id?: number;
        semester: number;
    } | null>(null);
    const [selectedItemEditSchoolYear, setSelectedItemEditSchoolYear] = useState<{
        id?: number;
        school_year: number;
    } | null>(null);

    const items = [
        {
            key: '1',
            label: (
                <div>
                    <MdOutlineEditCalendar />
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div>
                    <MdOutlineEditCalendar />
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <div>
                    <MdOutlineEditCalendar />
                </div>
            ),
        },
        {
            key: '4',
            label: (
                <div>
                    <MdOutlineEditCalendar />
                </div>
            ),
        },
    ];

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
        },
        {
            title: 'Năm học',
            dataIndex: 'schoolyear',
        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status: DataType['status']) => (
                <span
                    className={`text-sm ${
                        String(status) === 'Đang mở'
                            ? 'text-green-400 px-4 py-1 rounded-sm font-semibold'
                            : 'text-red-400 px-3 py-1 rounded-sm font-semibold'
                    }`}
                >
                    {status}
                </span>
            ),
        },
        {
            title: 'Hành động ',
            dataIndex: 'action',
        },
        {
            title: '',
            dataIndex: 'details',
        },
    ];
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            handleFetchData();
        }
    }, []);
    const handleFetchData = () => {
        setLoading(true);
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/admin/classrooms`, config)
            .then((response) => {
                const Api_class_section = response.data.response_data;
                const newData: DataType[] = Api_class_section.map(
                    (item: {
                        id: any;
                        status: number;
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
                        status: item.status === 1 ? 'Đang mở' : 'Đang đóng',
                        action: (
                            <>
                                <Dropdown
                                    trigger={['click']}
                                    overlay={
                                        <Menu>
                                            <Menu.Item
                                                onClick={() => {
                                                    handleDetail(item.id);
                                                }}
                                            >
                                                <div className="flex items-center gap-x-1">
                                                    <MdManageSearch size={22} />
                                                    Xem chi tiết
                                                </div>
                                            </Menu.Item>
                                            <Menu.Item onClick={() => handleEdit(item)}>
                                                <div className="flex items-center gap-x-1 ">
                                                    <MdOutlineEditCalendar size={20} /> Sửa lớp học phần
                                                </div>
                                            </Menu.Item>
                                            <Menu.Item onClick={() => handleStatus(item)}>
                                                {item.status === 1 ? (
                                                    <div className="flex items-center gap-x-1">
                                                        <MdLockOutline size={20} /> Đóng lớp học phần
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-x-1">
                                                        <MdLockOpen size={20} />
                                                        Mở lớp học phần
                                                    </div>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item onClick={() => handleStorage(item)}>
                                                <div className="flex items-center gap-x-1">
                                                    <MdOutlineSave size={20} />
                                                    Lưu trữ lớp học phần
                                                </div>
                                            </Menu.Item>
                                            <Menu.Item onClick={() => handleDelete(item)}>
                                                <div className="flex items-center gap-x-1">
                                                    <MdDelete size={20} />
                                                    Xóa lớp học phần
                                                </div>
                                            </Menu.Item>
                                        </Menu>
                                    }
                                >
                                    <button className="bg-blue-400 px-3 py-2 w-10 rounded-lg hover:bg-blue-700 hover:text-white flex justify-center items-center">
                                        <div>
                                            <MdOutlineMoreHoriz size={18} />
                                        </div>
                                    </button>
                                </Dropdown>
                            </>
                        ),
                    }),
                );
                setDataClassSection(newData);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    const content = 'Lỗi máy chủ';
                    const title = 'Lỗi';
                    ErrorCommon(title, content);
                }
                // Xử lý lỗi nếu có
                console.error(error);
            });
    };
    const customItemMenu = () => {
        return 'flex items-center gap-x-1 hover:bg-slate-300 w-full px-2 rounded-md py-1';
    };
    const colorStatus = (status: any) => {
        return status === 1 ? 'bg-red-500 hover:bg-red-700' : 'bg-green-400 hover:bg-green-700';
    };
    const title = (status: any) => {
        return status === 1 ? 'đóng' : 'mở';
    };
    const handleCreateRoom = () => {
        const roomData = {
            class_name: nameClass,
            semester: selectedSemester,
            regular_class_id: parseInt(selectedClass),
            subject_id: parseInt(selectedSubject),
            teacher_id: parseInt(selectedNameTeacher),
            school_year: parseInt(schoolYear),
        };
        const config = HeaderToken.getTokenConfig();
        setLoading(false);
        axios
            .post(`${BASE_URL}/admin/classrooms/create-classroom`, roomData, config)
            .then((response) => {
                //Đặt lại giá trị của các ô đầu vào sau khi tạo lớp học thành công
                setNameClass('');
                SetSchoolYear('');
                setSelectedSemester('');
                setSelectedClass('');
                handleFetchData();
                handleSuccesCreate();
                setIsModalOpen(false);
                //Chuyển dữ liệu khi tạo mới phòng
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
                    if (status === 400) {
                        content = 'Cần gửi đầy đủ thông tin';
                    } else if (status === 403 && errorMessage === 'Teacher not assigned to subject') {
                        content = 'Giáo viên không có quyền tạo môn học này';
                    } else if (status === 403 && errorMessage === 'Teacher not assigned to class') {
                        content = 'Giáo viên không được phân công lớp này';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
                console.error(error);
            });
    };
    const handleClassSectionUpdate = () => {
        const config = HeaderToken.getTokenConfig();
        const dataUpdate = {
            classroom_id: selectedItemEditClassName?.id,
            class_name: selectedItemEditClassName?.class_name,
            school_year: selectedItemEditSchoolYear?.school_year,
            semester: selectedItemEditSemester?.semester,
        };

        axios
            .patch(`${BASE_URL}/admin/classrooms/update-classroom`, dataUpdate, config)
            .then((response) => {
                handleFetchData();
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
    const handleClassSectionStatus = () => {
        const config = HeaderToken.getTokenConfig();
        const dataStatus = { classroom_id: selectedItemStatus?.id };
        axios
            .patch(`${BASE_URL}/admin/classrooms/update-status-classroom`, dataStatus, config)
            .then((response) => {
                handleFetchData();
                handleSuccesStatus(selectedItemStatus?.status);
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
                        content = 'Đóng bộ môn không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const handleClassSectionDelete = () => {
        const config = HeaderToken.getTokenConfig();
        const dataStatus = selectedItemDelete?.id;
        axios
            .delete(`${BASE_URL}/admin/classrooms/delete-classroom/${dataStatus}`, config)
            .then((response) => {
                handleFetchData();
                handleSuccesDelete();
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
                        content = 'Đóng bộ môn không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const handleClassSectionStorage = () => {
        const config = HeaderToken.getTokenConfig();
        const classroom_id = selectedItemStorageClassName?.id;

        axios
            .patch(`${BASE_URL}/classrooms/${classroom_id}/close-storage`, {}, config)
            .then((response) => {
                handleFetchData();
                Notification('success', 'Thông báo', 'Lưu trữ thành công lớp học phần');
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                const {
                    status,
                    data: { error_message: errorMessage },
                } = error.response;
                if (!isError) {
                    const title = 'Lỗi';
                    let content = '';
                    const {
                        status,
                        data: { error_message: errorMessage },
                    } = error.response;
                    if (status === 400 && errorMessage === 'Required more information') {
                        content = 'Thông tin bắt buộc';
                    } else if (status === 400 && errorMessage === 'Update not success') {
                        content = 'Cập nhật không thành công!!!';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    // const handleClassSectionDetail = () => {
    //     const config = HeaderToken.getTokenConfig();
    //     const dataDetail = selectedItemDetail;
    //     axios.get(`${BASE_URL}/classrooms/get-classroom-detail/${dataDetail}`, config).then((response) => {
    //         navigate(``);
    //     });
    // };
    // const getListTeacher = () => {
    //     const config = HeaderToken.getTokenConfig();
    //     axios.get(`${BASE_URL}/get-classroom-detail${selectedClass}`, config).then((response) => {
    //         const Api_data = response.data.response_data;
    //         console.log('data list: ', Api_data);
    //     });
    // };
    const fecthDataOption = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/admin/classrooms/get-teachers-subjects-regularclass`, config)
            .then((response) => {
                const Api_option_classsection = response.data.response_data;
                setSubjectRefresh(Api_option_classsection.subjects);
                setTeacherRefresh(Api_option_classsection.teachers);
                setClasses(Api_option_classsection.regular_class);
                setClassesEdit(Api_option_classsection.regular_class);
                // setSubjects(Api_option_classsection.subjects);
                // setTeachers(Api_option_classsection.teachers);
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
                    {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };

    const handleEdit = (item: {
        id?: number | undefined;
        class_name: string;
        school_year: number;
        semester: number;
    }) => {
        setIsModalOpenEdit(true);
        setSelectedItemEditClassName(item);
        setSelectedItemEditSemester(item);
        setSelectedItemEditSchoolYear(item);
    };
    const handleNameClassEditClassName = (e: { target: { value: any } }) => {
        setSelectedItemEditClassName({
            ...selectedItemEditClassName,
            class_name: e.target.value || null,
        });
    };
    const handleNameClassEditSemester = (e: { target: { value: any } }) => {
        setSelectedItemEditSemester({
            ...selectedItemEditSemester,
            semester: e.target.value || null,
        });
    };
    const handleNameClassEditSchoolYear = (e: { target: { value: any } }) => {
        const value = e.target.value;
        const regex = /^\d{0,4}$/; // Biểu thức chính quy cho số và tối đa 4 chữ số

        if (regex.test(value)) {
            setSelectedItemEditSchoolYear({
                ...selectedItemEditSchoolYear,
                school_year: value || null,
            });
        }
    };

    // const handleChangeEdit = (e: { target: { value: any } }) => {
    //     const inputValueEdit = e.target.value;
    //     setSelectedItemEdit({
    //         ...selectedItemEdit,
    //         class_name: inputValueEdit,
    //         regular_class_name: inputValueEdit,
    //     });
    // };
    const handleStatus = (item: { id: number }) => {
        setSelectedItemStatus(item);
        setStatusModalVisible(true);
    };
    const handleDelete = (item: { id: number }) => {
        setSelectedItemDelete(item);
        setDeleteModalVisible(true);
    };
    const handleDetail = (id: number) => {
        setSelectedItemDetail(id);
        navigate(`/admin/app-class-section/detail/${id}`);
        // handleClassSectionDetail();
    };
    const handleStorage = (item: { id: number }) => {
        setSelectedItemStorageClassName(item);
        setStorageModalVisible(true);
        console.log('id: ', item);
    };
    const showModal = () => {
        fecthDataOption();
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleCancelEdit = () => {
        setIsModalOpenEdit(false);
    };
    const handleNameClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameClass(e.target.value);
    };
    const handleSchoolYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d{0,4}$/; // Biểu thức chính quy cho số và tối đa 4 chữ số

        if (regex.test(value)) {
            SetSchoolYear(value);
        }
    };
    // const handleSelectRowDetail = (selectedRow: DataType) => {
    //     navigate(`/giang-vien/class/${data.id}`, { state: { data } });
    // };

    const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectValue = e.target.value;
        setSelectedClass(selectValue);
        const selectedClassData = classes.find((cls) => cls['id'] === parseInt(selectValue));
        const selectDeparmentId = selectedClassData ? selectedClassData['department_id'] : '';
        const filterSubjects = subjectRefresh.filter((sub) => sub['department_id'] === selectDeparmentId);
        const filteredTeachers = teacherRefresh.filter((tch) => tch['department_id'] === selectDeparmentId);
        // console.log('ssada', selectedClass);
        // console.log('filteredTeachers', filteredTeachers);
        console.log('id: ', filterSubjects);
        if (!filterSubjects.some((sub) => sub['id'] === selectedSubject)) {
            setSelectedSubject('');
        } else {
        }
        if (!filteredTeachers.some((tch) => tch['id'] === selectedNameTeacher)) {
            setSelectedNameTeacher('');
        }
        setSubjects(filterSubjects);
        setTeachers(filteredTeachers);
    };
    const handleNameTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNameTeacher(e.target.value);
    };
    const handleSelectSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubject(e.target.value);
    };
    const handleSelectSemester = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedSemester(selectedValue);
    };

    const handleSubmitCreateRoom = () => {
        if (nameClass.length === 0) {
            setError(true);
        } else if (!selectedNameTeacher) {
            setError(true);
        } else if (!selectedClass) {
            setError(true);
        } else if (!selectedSubject) {
            setError(true);
        } else {
            handleCreateRoom();
        }
    };
    const handleSubmitEditRoom = () => {
        handleClassSectionUpdate();
        setIsModalOpenEdit(false);
    };
    const handleSubmitDeleteClassSection = () => {
        handleClassSectionDelete();
        setDeleteModalVisible(false);
    };
    const handleSubmitStorageClassSection = () => {
        handleClassSectionStorage();
        setStorageModalVisible(false);
    };
    const handleSubmitStatusClassSection = () => {
        handleClassSectionStatus();
        setStatusModalVisible(false);
    };

    const handleSuccesCreate = () => {
        Notification('success', 'Thông báo', 'Thêm lớp học phần thành công');
    };
    const handleSuccesUpdate = () => {
        Notification(
            'success',
            'Thông báo',
            `Cập nhật ${selectedItemEditClassName?.class_name.toLocaleLowerCase()} thành công`,
        );
    };
    const handleSuccesDelete = () => {
        Notification('success', 'Thông báo', 'Xóa lớp học phần thành công');
    };
    const titleStatus = (status: any) => {
        return status === 1 ? 'mở' : 'đóng';
    };
    const handleSuccesStatus = (status: any) => {
        if (status === 1) {
            Notification('success', 'Thông báo', 'Đóng thành công lớp học phần');
        } else {
            Notification('success', 'Thông báo', 'Mở thành công lớp học phần');
        }
    };
    // onRow={(i) => ({
    //     onClick: (e) => navigate(`/admin/app-class-section/detail`),
    // })}
    return (
        <>
            <div className="container mt-5">
                <div className="flex justify-end mb-5">
                    <div>
                        <Button onClick={showModal} type="primary">
                            <MdBookmarkAdd />
                        </Button>
                        {/* Modal Create */}
                        {/* Modal Edit */}
                    </div>
                </div>

                <Table dataSource={dataClassSection} columns={columns} />

                <div className="">
                    <Modal
                        visible={isModalOpen}
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={null}
                        className="custom-modal-create-class "
                    >
                        <Spin size="large" spinning={loading}>
                            <Header className="bg-blue-300 flex items-center">
                                <div className="text-xl text-gray-200 font-sans">Tạo lớp học</div>
                            </Header>

                            <div className="px-5 py-10 grid grid-cols-2 mt-2 gap-x-4 gap-y-6">
                                <div>
                                    <label htmlFor=""> Tên lớp học phần</label>
                                    <Input
                                        value={nameClass}
                                        className="h-10 bg-slate-200"
                                        onChange={handleNameClassChange}
                                        required
                                    ></Input>
                                    {error && nameClass.length <= 0 ? (
                                        <label className="text-red-500 font-normal">
                                            Vui lòng nhập tên lớp học phần
                                        </label>
                                    ) : (
                                        ''
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="">Năm học</label>
                                    <Input
                                        className="h-10 bg-slate-200"
                                        value={schoolYear}
                                        onChange={handleSchoolYearChange}
                                        required
                                        pattern="^\d{4}$"
                                    />
                                    {error && schoolYear.length <= 0 ? (
                                        <label className="text-red-500 font-normal">Vui lòng nhập tên năm học</label>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="">Học kỳ</label>
                                    <select
                                        className="bg-slate-200 h-10 rounded-md focus:outline-none focus:border-blue-600 w-full px-2 "
                                        style={{ resize: 'none' }}
                                        value={selectedSemester}
                                        onChange={handleSelectSemester}
                                    >
                                        <option value="" disabled selected hidden>
                                            Chọn học kỳ
                                        </option>
                                        {option.map((item) => (
                                            <option key={item.key} value={item.key}>
                                                {item.key}
                                            </option>
                                        ))}
                                    </select>
                                    {error && !selectedSemester ? (
                                        <div className="text-red-500 font-normal">Vui lòng chọn học kỳ.</div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="Lớp">Lớp</label>
                                    <select
                                        className="bg-slate-200 h-10 rounded-md focus:outline-none focus:border-blue-600 w-full px-2"
                                        style={{ resize: 'none' }}
                                        value={selectedClass}
                                        onChange={handleClassSelect}
                                    >
                                        <option value="" disabled selected hidden>
                                            Chọn Lớp
                                        </option>
                                        {classes.map((cls) => (
                                            <option key={cls['id']} value={cls['id']}>
                                                {cls['class_name']}
                                            </option>
                                        ))}
                                    </select>
                                    {error && !selectedClass ? (
                                        <div className="text-red-500 font-normal">Vui lòng lớp.</div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                {selectedClass && (
                                    <div className="grid gap-y-4">
                                        <div>
                                            <label>Giảng Viên</label>
                                            <select
                                                className="bg-slate-200 h-10 rounded-md focus:outline-none focus:border-blue-600 w-full px-2"
                                                value={selectedNameTeacher}
                                                onChange={handleNameTeacherChange}
                                                required
                                            >
                                                {' '}
                                                <option value="" disabled selected hidden>
                                                    Chọn Giảng Viên
                                                </option>
                                                {teacher.map((tch) => (
                                                    <option key={tch['id']} value={tch['id']}>
                                                        {` ${tch['last_name']} ${tch['first_name']} `}
                                                    </option>
                                                ))}
                                            </select>
                                            {error && !selectedNameTeacher ? (
                                                <label className="text-red-500 font-normal">
                                                    Vui lòng nhập tên Giảng Viên
                                                </label>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="">Môn</label>
                                            <select
                                                value={selectedSubject}
                                                className="bg-slate-200 h-10 rounded-md focus:outline-none focus:border-blue-600 w-full px-2"
                                                onChange={handleSelectSubject}
                                            >
                                                <option value="" disabled selected hidden>
                                                    Chọn Môn
                                                </option>
                                                {subjects.map((sub) => (
                                                    <option value={sub['id']} key={sub['id']}>
                                                        {sub['subject_name']}
                                                    </option>
                                                ))}
                                            </select>
                                            {error && !selectedSubject ? (
                                                <div className="text-red-500 font-normal">Vui lòng lớp.</div>
                                            ) : (
                                                ''
                                            )}
                                        </div>{' '}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-x-4 justify-center ">
                                <div>
                                    <button
                                        className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                                        onClick={handleSubmitCreateRoom}
                                    >
                                        Tạo
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={handleCancel}
                                        className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </Spin>
                    </Modal>
                </div>

                {/* Modal Sửa Lớp Học */}
                <div className="">
                    <Modal
                        visible={isOpenModalEdit}
                        open={isOpenModalEdit}
                        onCancel={handleCancelEdit}
                        footer={null}
                        className="custom-modal-create-class "
                    >
                        <Spin size="large" spinning={loading}>
                            <Header className="bg-blue-300 flex items-center">
                                <div className="text-xl text-gray-200 font-semibold">Sửa lớp học</div>
                            </Header>

                            <div className="px-5 py-10 grid grid-cols-2 mt-2 gap-x-4 gap-y-6">
                                <div>
                                    <label htmlFor="">Tên lớp học phần</label>
                                    <Input
                                        className="h-10 bg-slate-200"
                                        value={selectedItemEditClassName?.class_name}
                                        onChange={(e) =>
                                            handleNameClassEditClassName({ target: { value: e.target.value } })
                                        }
                                        required
                                    ></Input>
                                    {error && nameClass.length <= 0 ? (
                                        <label className="text-red-500 font-normal">
                                            Vui lòng nhập tên lớp học phần
                                        </label>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="">Năm học</label>
                                    <Input
                                        className="h-10 bg-slate-200"
                                        value={selectedItemEditSchoolYear?.school_year}
                                        onChange={(e) =>
                                            handleNameClassEditSchoolYear({ target: { value: e.target.value } })
                                        }
                                        required
                                        pattern="^\d{4}$"
                                    />
                                    {error && schoolYear.length <= 0 ? (
                                        <label className="text-red-500 font-normal">Vui lòng nhập tên năm học</label>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="">Học kỳ</label>
                                    <select
                                        onChange={handleNameClassEditSemester}
                                        className="bg-slate-200 h-10 rounded-md focus:outline-none focus:border-blue-600 w-full px-2 "
                                    >
                                        <option value={selectedItemEditSemester?.id} disabled selected hidden>
                                            {selectedItemEditSemester?.semester}
                                        </option>
                                        {option.map((item) => (
                                            <option key={item.key} value={item.key}>
                                                {item.key}
                                            </option>
                                        ))}
                                    </select>
                                    {error && !selectedSemester ? (
                                        <div className="text-red-500 font-normal">Vui lòng chọn học kỳ.</div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                {/* <div>
                                            <label htmlFor="Lớp">Lớp</label>
                                            <select
                                                className="bg-slate-200 h-10 rounded-md focus:outline-none focus:border-blue-600 w-full px-2"
                                                style={{ resize: 'none' }}
                                                value={selectedClass}
                                                onChange={handleClassSelect}
                                            >
                                                <option value="" disabled selected hidden>
                                                    Chọn Lớp
                                                </option>
                                                {classesEdit.map((cls) => (
                                                    <option key={cls['id']} value={cls['id']}>
                                                        {cls['class_name']}
                                                    </option>
                                                ))}
                                            </select>
                                            {error && !selectedClass ? (
                                                <div className="text-red-500 font-normal">Vui lòng lớp.</div>
                                            ) : (
                                                ''
                                            )}
                                        </div> */}
                                {/* {selectedClass && (
                                            <div className="grid gap-y-4">
                                                <div>
                                                    <label>Giảng Viên</label>
                                                    <select
                                                        className="bg-slate-200 h-10 rounded-md focus:outline-none focus:border-blue-600 w-full px-2"
                                                        value={selectedNameTeacher}
                                                        onChange={handleNameTeacherChange}
                                                        required
                                                    >
                                                        {' '}
                                                        <option value="" disabled selected hidden>
                                                            Chọn Giảng Viên
                                                        </option>
                                                        {teacher.map((tch) => (
                                                            <option key={tch['id']} value={tch['id']}>
                                                                {` ${tch['last_name']} ${tch['first_name']} `}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {error && !selectedNameTeacher ? (
                                                        <label className="text-red-500 font-normal">
                                                            Vui lòng nhập tên Giảng Viên
                                                        </label>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="">Môn</label>
                                                    <select
                                                        value={selectedSubject}
                                                        className="bg-slate-200 h-10 rounded-md focus:outline-none focus:border-blue-600 w-full px-2"
                                                        onChange={handleSelectSubject}
                                                    >
                                                        <option value="" disabled selected hidden>
                                                            Chọn Môn
                                                        </option>
                                                        {subjects.map((sub) => (
                                                            <option value={sub['id']} key={sub['id']}>
                                                                {sub['subject_name']}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {error && !selectedSubject ? (
                                                        <div className="text-red-500 font-normal">Vui lòng lớp.</div>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </div>
                                        )} */}
                            </div>
                            <div className="flex gap-x-4 justify-center ">
                                <div>
                                    <button
                                        className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                                        onClick={handleSubmitEditRoom}
                                    >
                                        Sửa
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={handleCancel}
                                        className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </Spin>
                    </Modal>
                </div>
            </div>
            <>
                <div>
                    <Modal
                        className="custom-delete "
                        title="Xác nhận  "
                        visible={statusModalVisible}
                        onCancel={() => setStatusModalVisible(false)}
                        footer={null}
                    >
                        <div>
                            <p>Bạn có chắc chắn muốn hành động việc này không ?</p>
                        </div>
                        <div className="flex justify-end h-full mt-20">
                            <Button onClick={handleSubmitStatusClassSection} type="primary" className="mr-5">
                                Xác nhận
                            </Button>
                            <Button onClick={() => setStatusModalVisible(false)} type="default" className="mr-5">
                                Hủy
                            </Button>
                        </div>
                    </Modal>
                </div>
            </>
            <>
                <div>
                    <Modal
                        className="custom-delete"
                        title="Xác nhận xóa"
                        visible={deleteModalVisible}
                        onCancel={() => setDeleteModalVisible(false)}
                        footer={null}
                    >
                        <div>
                            <p>Bạn có chắc chắn muốn xóa lớp không?</p>
                        </div>
                        <div className="flex justify-end h-full mt-20">
                            <Button onClick={handleSubmitDeleteClassSection} type="primary" className="mr-5">
                                Xóa
                            </Button>
                            <Button onClick={() => setDeleteModalVisible(false)} type="default" className="mr-5">
                                Hủy
                            </Button>
                        </div>
                    </Modal>
                </div>
            </>
            <>
                <div>
                    <Modal
                        className="custom-delete"
                        title="Xác nhận lưu trữ"
                        visible={storageModalVisible}
                        onCancel={() => setStorageModalVisible(false)}
                        footer={null}
                    >
                        <div>
                            <p>Bạn có bạn có muốn lưu trữ ?</p>
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

export default AppClassSection;

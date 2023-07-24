import React, { Key, useEffect, useState } from 'react';
import {
    MdAccountCircle,
    MdArrowBack,
    MdDelete,
    MdDeleteForever,
    MdOutlinePersonAdd,
    MdPersonAdd,
} from 'react-icons/md';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Table, { ColumnsType } from 'antd/es/table';
import { Button, Checkbox, Input, Layout, Modal, Select, Tooltip } from 'antd';
import HeaderToken from '../../../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../../../common/consts/system_const';
import CheckBoxAllDetail from '../../../../components/CheckBoxAllDetail';
import { TableRowSelection } from 'antd/es/table/interface';
import { TableProps } from 'react-table';
import Notification from '../../../../components/Notification';
import UnauthorizedError from '../../../../common/exception/unauthorized_error';
import ErrorCommon from '../../../../common/Screens/ErrorCommon';
const { Header, Footer, Content } = Layout;
interface DataType {
    id: number;
    first_name: string;
    last_name: string;
    department_name: string;
    class_name: string;
}

const BASE_URL = `${SystemConst.DOMAIN}`;
const Detail = () => {
    const [dataDetailTeacher, setDataDetailTeacher] = useState<DataType[]>([]);
    const [dataDetailStudent, setDataDetailStudent] = useState<DataType[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<DataType[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<DataType[]>([]);
    const [isOpenModalAddTeacher, setIsOpenModalAddTeacher] = useState(false);
    const [isOpenModalAddStudent, setIsOpenModalAddStudent] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [selectClasses, setSelectClasses] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<any[]>([]);
    const [selectedIdsStudent, setSelectedIdsStudent] = useState<any[]>([]);
    const [selectedIdsTeacher, setSelectedIdsTeacher] = useState<any[]>([]);

    const handleBack = () => {
        navigate(-1);
    };
    const { id } = useParams();

    const columnAddStudent: ColumnsType<DataType> = [
        {
            title: 'Tên Sinh Viên',
            dataIndex: 'name',
            render: (text: any, record: any) => (
                <span>
                    {record.last_name} {record.first_name}
                </span>
            ),
            filteredValue: [searchText],
            onFilter: (value, record) => {
                const searchValue = value.toString().replace(/\s+/g, ' ').trim();
                const lowercaseValue = searchValue.toLowerCase();
                const uppercaseValue = searchValue.toUpperCase();
                const fullName = `${record.last_name} ${record.first_name}`;
                return (
                    fullName.toLowerCase().includes(lowercaseValue) || fullName.toUpperCase().includes(uppercaseValue)
                );
            },
        },
        {
            title: 'Lớp',
            dataIndex: 'class_name',
        },
    ];
    const columnAddTeacher: ColumnsType<DataType> = [
        {
            title: 'Giảng viên',
            dataIndex: 'name',
            width: '40%',
            render: (text: any, record: any) => (
                <span>
                    {record.last_name} {record.first_name}
                </span>
            ),
            filteredValue: [searchText],
            onFilter: (value, record) => {
                const searchValue = value.toString().replace(/\s+/g, ' ').trim();
                const lowercaseValue = searchValue.toLowerCase();
                const uppercaseValue = searchValue.toUpperCase();
                const fullName = `${record.last_name} ${record.first_name}`;
                return (
                    fullName.toLowerCase().includes(lowercaseValue) || fullName.toUpperCase().includes(uppercaseValue)
                );
            },
        },
        {
            title: 'Bộ môn',
            dataIndex: 'department_name',
            width: '50%',
        },
        {
            title: '',
            dataIndex: 'action',
            width: '10%',
        },
    ];
    const columnTeacher: ColumnsType<DataType> = [
        {
            title: 'Giảng viên',
            dataIndex: 'name',
            width: '50%',
            render: (text: any, record: any) => (
                <span>
                    {record.last_name} {record.first_name}
                </span>
            ),
        },
        {
            title: 'Bộ môn',
            dataIndex: 'department_name',
            width: '50%',
        },
    ];
    const columnStudent: ColumnsType<DataType> = [
        {
            title: 'Sinh viên',
            dataIndex: 'name',
            width: '50%',
            render: (text: any, record: any) => (
                <span>
                    {record.last_name} {record.first_name}
                </span>
            ),
        },
        {
            title: 'Lớp',
            dataIndex: 'class_name',
            width: '50%',
        },
    ];

    useEffect(() => {
        handleFetchDataTeacher();
        handleFetchDataStudent();
    }, []);
    const handleFetchDataTeacher = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/classrooms/get-classroom-detail/${id}`, config)
            .then((response) => {
                const data = response.data.response_data.teachers;
                const newData: DataType[] = data.map(
                    (item: { id: any; first_name: any; last_name: any; department_name: any }) => ({
                        id: item.id,
                        first_name: item.first_name,
                        last_name: item.last_name,
                        department_name: item.department_name,
                    }),
                );
                setDataDetailTeacher(newData);
            })
            .catch((error) => {});
    };
    const handleFetchDataStudent = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/classrooms/get-classroom-detail/${id}`, config)
            .then((response) => {
                const data = response.data.response_data.students;
                console.log(data);
                const newData: DataType[] = data.map(
                    (item: { id: any; first_name: any; last_name: any; class_name: any }) => ({
                        id: item.id,
                        first_name: item.first_name,
                        last_name: item.last_name,
                        class_name: item.class_name,
                    }),
                );
                setDataDetailStudent(newData);
            })
            .catch((error) => {});
    };
    const fetchOptionStudent = (regular_class_id: undefined) => {
        const config = HeaderToken.getTokenConfig();
        const classroom_id = id;
        axios
            .get(`${BASE_URL}/admin/students/get-students-not-in-classroom/${classroom_id}/${regular_class_id}`, config)
            .then((response) => {
                const data = response.data.response_data;
                const newData: DataType[] = data.map(
                    (item: { id: any; first_name: any; last_name: any; class_name: any }) => ({
                        id: item.id,
                        first_name: item.first_name,
                        last_name: item.last_name,
                        class_name: item.class_name,
                    }),
                );
                setSelectedStudents(newData);
            });
    };

    const fecthOptionClass = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/admin/classrooms/get-teachers-subjects-regularclass`, config)
            .then((response) => {
                const data_option_class = response.data.response_data.regular_class;
                setSelectClasses(data_option_class);

                console.log('data_option:', data_option_class);
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
    const fetchOptionTeacher = () => {
        const config = HeaderToken.getTokenConfig();
        const classroom_id = id;
        axios
            .get(`${BASE_URL}/admin/teachers/get-teachers-not-in-classroom/${classroom_id}`, config)
            .then((response) => {
                const data = response.data.response_data;
                console.log('Teacher', data);
                const newData: DataType[] = data.map(
                    (item: { id: any; first_name: any; last_name: any; department_name: any }) => ({
                        id: item.id,
                        first_name: item.first_name,
                        last_name: item.last_name,
                        department_name: item.department_name,
                    }),
                );
                setSelectedTeacher(newData);
            });
    };
    const handleAddStudentInClass = () => {
        const payload = {
            classroom_id: id,
            student_ids: selectedIds, // Truyền danh sách id đã chọn vào student_ids
        };
        const config = HeaderToken.getTokenConfig();
        axios
            .post(`${BASE_URL}/admin/students/add-students-to-classroom`, payload, config)
            .then((response) => {
                setSelectedIds([]);
                handleFetchDataStudent();
            })
            .catch((error) => {});
    };
    const handleAddTeacherInClass = () => {
        const payload = {
            classroom_id: id,
            teacher_ids: selectedIds,
        };
        const config = HeaderToken.getTokenConfig();
        axios
            .post(`${BASE_URL}/admin/teachers/add-teachers-to-classroom`, payload, config)
            .then(() => {
                setSelectedIds([]);
                handleFetchDataTeacher();
            })
            .catch((error) => {});
    };
    const handleDeleteTeacherInClass = () => {
        const config = HeaderToken.getTokenConfig();
        const payload = {
            teacher_ids: selectedIdsTeacher,
            classroom_id: id,
        };

        axios
            .patch(`${BASE_URL}/admin/teachers/remove-teachers-from-classroom`, payload, config)
            .then((response) => {
                handleFetchDataTeacher();
                Notification('success', 'Thông báo', 'Xóa thành công giảng viên');
            })
            .catch((error) => {});
    };
    const handleDeleteStudentInClass = () => {
        const config = HeaderToken.getTokenConfig();
        const payload = {
            student_ids: selectedIdsStudent,
            classroom_id: id,
        };

        axios
            .patch(`${BASE_URL}/admin/students/remove-students-from-classroom`, payload, config)
            .then((response) => {
                handleFetchDataStudent();
                Notification('success', 'Thông báo', 'Xóa thành công sinh viên');
            })
            .catch((error) => {});
    };

    const handleSubmitAddTeacher = () => {
        if (selectedIds.length === 0) {
            Notification('warning', 'Thông báo', 'Cần chọn dữ liệu thêm !!!');
            return;
        } else {
            handleAddTeacherInClass();
            handleAddTeacherSuccess();
            setIsOpenModalAddTeacher(false);
        }
    };
    const handleSubmitAddStudent = () => {
        if (selectedIds.length === 0) {
            // Hiển thị thông báo lỗi hoặc thực hiện hành động phù hợp
            Notification('warning', 'Thông báo', 'Cần chọn dữ liệu thêm !!!');
            setError(true);
            return;
        } else {
            handleAddStudentInClass();
            handleAddStudentSuccess();
            setIsOpenModalAddStudent(false);
        }
    };
    const handleSubmitDeleteTeacher = () => {
        if (selectedIdsTeacher.length === 0) {
            setDeleteModalVisibleTeacher(false);
            Notification('warning', 'Thông báo', 'Vui lòng chọn dữ liệu cần xóa !!!');
        } else {
            handleDeleteTeacherInClass();
        }
        setDeleteModalVisibleTeacher(false);
    };
    const handleSubmitDeleteStudent = () => {
        if (selectedIdsStudent.length === 0) {
            setDeleteModalVisibleStudent(false);
            Notification('warning', 'Thông báo', 'Vui lòng chọn dữ liệu cần xóa !!!');
        } else {
            handleDeleteStudentInClass();
        }
        setDeleteModalVisibleStudent(false);
    };
    const handleChangeOptionShowStudent = (regular_class_id: undefined) => {
        fetchOptionStudent(regular_class_id);
    };
    const handleOpenModalAddTeacher = () => {
        setIsOpenModalAddTeacher(true);
        fetchOptionTeacher();
    };
    const handleCancelAddTeacher = () => {
        handleFetchDataTeacher();
        setIsOpenModalAddTeacher(false);
        fetchOptionTeacher();
    };
    const handleOpenModalAddStudent = () => {
        handleFetchDataStudent();
        setIsOpenModalAddStudent(true);
        fecthOptionClass();
    };
    const handleCancelAddStudent = () => {
        setSelectClasses([]);
        setIsOpenModalAddStudent(false);
    };
    const [deleteModalVisibleTeacher, setDeleteModalVisibleTeacher] = useState(false);
    const [deleteModalVisibleStudent, setDeleteModalVisibleStudent] = useState(false);
    const handleDeleteModalTeacher = () => {
        setDeleteModalVisibleTeacher(true);
    };
    const handleDeleteModalVisibleStudent = () => {
        setDeleteModalVisibleStudent(true);
    };
    const handleAddStudentSuccess = () => {
        Notification('success', 'Thông báo', 'Thêm sinh viên thành công!!!');
    };
    const handleAddTeacherSuccess = () => {
        Notification('success', 'Thông báo', 'Thêm giảng viên thành công!!!');
    };

    // Hàm rowSelection xử lý select từng checkBox hoặc nhiều checkBox hoặc allSelect
    const rowSelection = {
        onSelect: (record: { id: any }, selected: any) => {
            const updatedSelectedIds = [...selectedIds];
            if (selected) {
                updatedSelectedIds.push(record.id);
            } else {
                const index = updatedSelectedIds.indexOf(record.id);
                if (index > -1) {
                    updatedSelectedIds.splice(index, 1);
                }
            }
            setSelectedIds(updatedSelectedIds);
            console.log('select', updatedSelectedIds);
        },
        onSelectAll: (selected: any, selectedRows: any, changeRows: any[]) => {
            let updatedSelectedIds = [...selectedIds];
            if (selected) {
                const newIds = changeRows.map((row: { id: any }) => row.id);
                updatedSelectedIds.push(...newIds);
            } else {
                const removeIds = changeRows.map((row: { id: any }) => row.id);
                updatedSelectedIds = updatedSelectedIds.filter((id) => !removeIds.includes(id));
            }
            setSelectedIds(updatedSelectedIds);
            console.log('selectALl', updatedSelectedIds);
        },
    };
    const rowSelectionStudent = {
        onSelect: (record: { id: any }, selected: any) => {
            const updatedSelectedIds = [...selectedIdsStudent];
            if (selected) {
                updatedSelectedIds.push(record.id);
            } else {
                const index = updatedSelectedIds.indexOf(record.id);
                if (index > -1) {
                    updatedSelectedIds.splice(index, 1);
                }
            }
            setSelectedIdsStudent(updatedSelectedIds);
            console.log('select', updatedSelectedIds);
        },
        onSelectAll: (selected: any, selectedRows: any, changeRows: any[]) => {
            let updatedSelectedIds = [...selectedIds];
            if (selected) {
                const newIds = changeRows.map((row: { id: any }) => row.id);
                updatedSelectedIds.push(...newIds);
            } else {
                const removeIds = changeRows.map((row: { id: any }) => row.id);
                updatedSelectedIds = updatedSelectedIds.filter((id) => !removeIds.includes(id));
            }
            setSelectedIdsStudent(updatedSelectedIds);
            console.log('selectALl', updatedSelectedIds);
        },
    };
    const rowSelectionTeacher = {
        onSelect: (record: { id: any }, selected: any) => {
            const updatedSelectedIds = [...selectedIdsTeacher];
            if (selected) {
                updatedSelectedIds.push(record.id);
            } else {
                const index = updatedSelectedIds.indexOf(record.id);
                if (index > -1) {
                    updatedSelectedIds.splice(index, 1);
                }
            }
            setSelectedIdsTeacher(updatedSelectedIds);
            console.log('select', updatedSelectedIds);
        },
        onSelectAll: (selected: any, selectedRows: any, changeRows: any[]) => {
            let updatedSelectedIds = [...selectedIds];
            if (selected) {
                const newIds = changeRows.map((row: { id: any }) => row.id);
                updatedSelectedIds.push(...newIds);
            } else {
                const removeIds = changeRows.map((row: { id: any }) => row.id);
                updatedSelectedIds = updatedSelectedIds.filter((id) => !removeIds.includes(id));
            }
            setSelectedIdsTeacher(updatedSelectedIds);
            console.log('selectALl', updatedSelectedIds);
        },
    };

    return (
        <>
            <div>
                <button className="flex items-center gap-x-2" onClick={handleBack}>
                    <div className="hover:bg-slate-300 rounded-full p-1">
                        <MdArrowBack size={20} />
                    </div>
                    <p className="text-base font-semibold">Lớp học phần</p>
                </button>
            </div>
            <div className="overflow-hidden px-20 rounded-sm">
                <div className="">
                    <div>
                        <div className="flex justify-between py-1">
                            <Button
                                type="primary"
                                danger
                                onClick={handleDeleteModalTeacher}
                                className="hover:text-blue-500 duration-150 transition-all"
                            >
                                <MdDeleteForever size={20} />
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleOpenModalAddTeacher}
                                className="hover:text-blue-500 duration-150 transition-all"
                            >
                                <MdPersonAdd size={16} />
                            </Button>
                        </div>
                        <div>
                            <Table
                                scroll={{ y: 200 }}
                                size="small"
                                dataSource={dataDetailTeacher}
                                columns={columnTeacher}
                                pagination={false}
                                locale={{
                                    emptyText: 'Không có giáo viên',
                                }}
                                rowKey={'id'}
                                rowSelection={rowSelectionTeacher}
                            ></Table>
                        </div>
                    </div>
                    <div></div>
                </div>
                <div className="mt-2">
                    <div className="flex justify-between py-1">
                        <Button
                            type="primary"
                            danger
                            onClick={handleDeleteModalVisibleStudent}
                            className="hover:text-blue-500 duration-150 transition-all"
                        >
                            <MdDeleteForever size={20} />
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleOpenModalAddStudent}
                            className="hover:text-blue-500 duration-150 transition-all"
                        >
                            <MdPersonAdd size={16} />
                        </Button>
                    </div>
                    <div>
                        <Table
                            scroll={{ y: 250 }}
                            size="small"
                            columns={columnStudent}
                            dataSource={dataDetailStudent}
                            pagination={false}
                            locale={{
                                emptyText: 'Không có sinh viên ',
                            }}
                            rowKey={'id'}
                            rowSelection={rowSelectionStudent}
                        ></Table>
                    </div>
                </div>
            </div>
            {/* Modal thêm giáo viên */}
            <>
                <Modal
                    open={isOpenModalAddTeacher}
                    visible={isOpenModalAddTeacher}
                    onCancel={() => handleCancelAddTeacher()}
                    footer={null}
                    className="custom-modal-create-class-add-teacher-student"
                >
                    <Header className="bg-blue-300 flex items-center">
                        <div className="text-xl text-gray-200 font-semibold">Thêm giảng viên</div>
                    </Header>
                    <div className="flex justify-between p-5">
                        <Input.Search
                            className="w-64"
                            placeholder="Tìm kiếm..."
                            onSearch={(value) => {
                                setSearchText(value);
                            }}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                            }}
                            type="text"
                        />

                        {error && !selectClasses ? (
                            <div className="text-red-500 font-normal">Vui lòng chọn lớp.</div>
                        ) : (
                            ''
                        )}
                    </div>
                    <div className="px-5">
                        <Table
                            rowKey="id"
                            className={`rounded-md `}
                            locale={{
                                emptyText: 'Không có giảng viên',
                            }}
                            columns={columnAddTeacher}
                            dataSource={selectedTeacher}
                            pagination={false}
                            rowSelection={rowSelection}
                        ></Table>
                    </div>
                    <div className="flex gap-x-4 justify-center mt-10">
                        <div>
                            <button
                                onClick={handleSubmitAddTeacher}
                                className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Thêm
                            </button>
                        </div>
                        <div>
                            <button
                                onCanPlay={handleCancelAddTeacher}
                                className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </Modal>
            </>

            {/* Modal thêm sinh viên */}
            <>
                <Modal
                    open={isOpenModalAddStudent}
                    visible={isOpenModalAddStudent}
                    onCancel={() => handleCancelAddStudent()}
                    footer={null}
                    className="custom-modal-create-class-add-teacher-student"
                >
                    <Header className="bg-blue-300 flex items-center">
                        <div className="text-xl text-gray-200 font-semibold">Thêm sinh viên</div>
                    </Header>
                    <div className="overflow-auto lg:h-[24rem] xl:h-[25rem] 2xl:h-[26rem] 3xl:h-[30rem] px-5 p-5">
                        <div className="flex justify-between mb-2 ">
                            <Input.Search
                                className="w-64"
                                placeholder="Tìm kiếm..."
                                onSearch={(value) => {
                                    setSearchText(value);
                                }}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                }}
                                type="text"
                            />
                            <Select
                                placeholder="Vui lòng chọn lớp"
                                onChange={(regular_class_id) => {
                                    handleChangeOptionShowStudent(regular_class_id);
                                }}
                            >
                                {selectClasses.map((item) => (
                                    <option key={item['id']} value={item['id']}>
                                        {item['class_name']}
                                    </option>
                                ))}
                            </Select>
                            {error && !selectClasses ? (
                                <div className="text-red-500 font-normal">Vui lòng chọn lớp.</div>
                            ) : (
                                ''
                            )}
                        </div>

                        <Table
                            rowKey="id"
                            className={`rounded-md `}
                            locale={{
                                emptyText: 'Không có sinh viên',
                            }}
                            columns={columnAddStudent}
                            dataSource={selectedStudents}
                            pagination={false}
                            rowSelection={rowSelection}
                        />
                    </div>
                    <div className="flex gap-x-4 justify-center mt-10">
                        <div>
                            <button
                                onClick={handleSubmitAddStudent}
                                className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Thêm
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={handleCancelAddStudent}
                                className="text-lg bg-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </Modal>
            </>
            <>
                <Modal
                    className="custom-delete"
                    title="Xác nhận xóa"
                    visible={deleteModalVisibleTeacher}
                    onCancel={() => setDeleteModalVisibleTeacher(false)}
                    footer={null}
                >
                    <div>
                        <p>Bạn có chắc chắn muốn xóa giảng viên không?</p>
                    </div>
                    <div className="flex justify-end h-full mt-20">
                        <Button type="primary" className="mr-5" onClick={handleSubmitDeleteTeacher}>
                            Xóa
                        </Button>
                        <Button onClick={() => setDeleteModalVisibleTeacher(false)} type="default" className="mr-5">
                            Hủy
                        </Button>
                    </div>
                </Modal>
            </>
            <>
                <Modal
                    className="custom-delete"
                    title="Xác nhận xóa"
                    visible={deleteModalVisibleStudent}
                    onCancel={() => setDeleteModalVisibleStudent(false)}
                    footer={null}
                >
                    <div>
                        <p>Bạn có chắc chắn muốn xóa sinh viên không?</p>
                    </div>
                    <div className="flex justify-end h-full mt-20">
                        <Button type="primary" className="mr-5" onClick={handleSubmitDeleteStudent}>
                            Xóa
                        </Button>
                        <Button onClick={() => setDeleteModalVisibleStudent(false)} type="default" className="mr-5">
                            Hủy
                        </Button>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default Detail;

//Đây là hàm select và selectAll Check
//     {
//     type: 'checkbox',
//     selectedRowKeys: selectedIds,
//     onSelect: (record, selected) => {
//         const updatedSelectedIds = [...selectedIds];
//         if (selected) {
//             updatedSelectedIds.push(record.id);
//         } else {
//             const index = updatedSelectedIds.indexOf(record.id);
//             if (index > -1) {
//                 updatedSelectedIds.splice(index, 1);
//             }
//         }
//         setSelectedIds(updatedSelectedIds);
//         console.log('select', updatedSelectedIds);
//     },
//     onSelectAll: (selected, selectedRows, changeRows) => {
//         let updatedSelectedIds = [...selectedIds];
//         if (selected) {
//             const newIds = changeRows.map((row) => row.id);
//             updatedSelectedIds.push(...newIds);
//         } else {
//             const removeIds = changeRows.map((row) => row.id);
//             updatedSelectedIds = updatedSelectedIds.filter((id) => !removeIds.includes(id));
//         }
//         setSelectedIds(updatedSelectedIds);
//         console.log('selectALl', updatedSelectedIds);
//     },
// }

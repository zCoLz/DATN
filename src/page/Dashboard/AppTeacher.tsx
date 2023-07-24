import { Button, DatePickerProps, Input, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { MdPersonAdd } from 'react-icons/md';
import SelectOption from '../../components/SelectOption';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import Notification from '../../components/Notification';
import DatePicker from 'react-date-picker';
interface DataType {
    code: string;
    surname: string;
    name: string;
    subject: string;
    // status: boolean;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/admin`;
const AppTeacher: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Mã giảng viên',
            dataIndex: 'code',
        },
        {
            title: 'Họ giảng viên',
            dataIndex: 'surname',
        },
        {
            title: 'Tên giảng viên',
            dataIndex: 'name',
        },
        {
            title: 'Bộ môn',
            dataIndex: 'subject',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'status',
        // },
    ];
    const [dataTeacher, setDataTeacher] = useState<DataType[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            handleFecthData();
        }
    }, []);
    const handleFecthData = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/teachers`, config)
            .then((response) => {
                const Api_teacher = response.data.response_data;
                console.log('data: ', Api_teacher);
                const newData: DataType[] = Api_teacher.map(
                    (item: {
                        id: number;
                        teacher_code: any;
                        last_name: any;
                        first_name: any;
                        Department: any;
                        department_name: any;
                    }) => ({
                        id: item.id,
                        code: item.teacher_code,
                        surname: item.last_name,
                        name: item.first_name,
                        subject: item.Department.department_name,
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
                setDataTeacher(newData);
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
    const selectOptionAPITeacher = () => {
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
    const handleCreateTeacher = () => {
        const dataTeacher = {
            CCCD: isValueCCCD,
            first_name: isValueName,
            last_name: isValueSurname,
            date_of_birth: isValueDateOfBirth,
            phone_number: isValuePhone,
            address: isValueAddress,
            department_id: selectOptionTeacher,
            teacher_code: isValueTeacherCode,
            gender: selectedGender,
        };
        console.log('data: ', dataTeacher);
        const config = HeaderToken.getTokenConfig();
        axios
            .post(`${BASE_URL}/teachers/create-teacher`, dataTeacher, config)
            .then(() => {
                selectOptionAPITeacher();
                setIsValueName('');
                setIsValueCCCD('');
                setIsValueAddress('');
                setIsValueDateOfBirth('');
                setIsValuePhone('');
                setIsValueSurname('');
                setIsValueTeacherCode('');
                setSelectedGender('');
                setSelectOptionTeacher(null);
                setOpenModal(false);
                handleSuccessCreate();
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
                        content = 'Đa';
                    } else if (status === 400 && errorMessage === 'Create not success') {
                        content = 'Tạo giảng viên không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const [selectOptionTeacher, setSelectOptionTeacher] = useState<number | null>(null);
    const [isOptions, setIsOptions] = useState<any[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [isValueTeacherCode, setIsValueTeacherCode] = useState('');
    const [isValueSurname, setIsValueSurname] = useState('');
    const [isValueName, setIsValueName] = useState('');
    // const [isValueDateOfBirth, setIsValueDateOfBirth] = useState<string | null>(null);
    const [isValueDateOfBirth, setIsValueDateOfBirth] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [isValuePhone, setIsValuePhone] = useState('');
    const [isValueCCCD, setIsValueCCCD] = useState('');
    const [isValueAddress, setIsValueAddress] = useState('');
    const [selectedOptionClass, setSelectedOptionClass] = useState<number | null>(null);
    const [error, setError] = useState(false);
    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpenModal(false);
    };

    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    const handleEdit = (row: DataType) => {
        setEditedData(row);
        setOpenModalEdit(true);
    };
    const handleDelete = (row: DataType) => {
        setSelectedDeleteData(row);
        setDeleteModalVisible(true);
    };
    const handleSubmitCreateTeacher = () => {
        if (isValueAddress.length === 0) {
            setError(true);
        } else if (isValueCCCD.length === 0) {
            setError(true);
        } else if (isValueDateOfBirth === null) {
            setError(true);
        } else if (isValueName.length === 0) {
            setError(true);
        } else if (isValuePhone.length === 0) {
            setError(true);
        } else if (isValueName.length === 0) {
            setError(true);
        } else if (isValueSurname.length === 0) {
            setError(true);
        } else if (!selectedGender) {
            setError(true);
        } else if (!selectOptionTeacher) {
            setError(true);
        } else {
            handleCreateTeacher();
            selectOptionAPITeacher();
            setOpenModal(false);
        }
    };
    const handleSubmitEditTeacher = () => {
        setOpenModalEdit(false);
    };
    const handleSubmitDeleteTeacher = () => {
        setDeleteModalVisible(false);
    };

    const handleOptionChangeClass = (value: number | null) => {
        setSelectedOptionClass(value);
    };
    const handleOptionChangeTeacher = (value: number | null) => {
        setSelectOptionTeacher(value);
    };

    //Hàm xử lý Change Input chỉ được nhập tối đa 10 số và có thể nhập số 0 ở đầu
    // const handleChangeCodeTeacher = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const inputValue = e.target.value;
    //     const formattedValue = inputValue
    //         .replace(/^0+(?=\d{1,10})/, '')
    //         .replace(/\D/g, '')
    //         .slice(0, 10);
    //     setIsValueTeacherCode(formattedValue);
    // };
    const handleChangeCodeTeacher = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formattedValue = inputValue.replace(/\D/g, '').slice(0, 10);
        setIsValueTeacherCode(formattedValue);
    };
    const handleChangeCCCD = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formattedValue = inputValue.replace(/\D/g, '').slice(0, 12);
        setIsValueCCCD(formattedValue);
    };

    //Hàm xử lý Change Input nhập Họ sinh viên
    const handleChangeSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setIsValueSurname(inputValue);
    };
    // //Hàm xử lý Change Input nhập Tên sinh viên
    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setIsValueName(inputValue);
    };
    // Hàm xử lý Change Input nhập ngày sinh
    const handleChangeDateOfBirth = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsValueDateOfBirth(e.target.value);
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGender(e.target.value);
    };
    //Hàm xử lý Change Input chỉ được nhập tối đa 11 số và có thể số 0 ở đầu
    const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formattedValue = inputValue.replace(/[^\d]/g, '').slice(0, 11);
        setIsValuePhone(formattedValue);
    };
    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setIsValueAddress(inputValue);
    };
    const handleSuccessCreate = () => {
        Notification('success', 'Thông báo', 'Thêm bộ môn thành công');
    };
    const handleSuccessUpdate = () => {
        Notification('success', 'Thông báo', 'Cập nhật bộ môn thành công');
    };
    const handleSuccessDelete = () => {
        Notification('success', 'Thông báo', 'Xóa thành công bộ môn');
    };
    return (
        <>
            <div className="container mt-5">
                <div className="text-end mb-5">
                    <div>
                        <Button type="primary" onClick={handleShowModal}>
                            <MdPersonAdd />
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataTeacher}
                    pagination={{
                        defaultPageSize: 6,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '6', '8', '12', '16'],
                    }}
                    size="large"
                />
            </div>
            {/* Modal Thêm giảng viên */}
            <Modal className="custom-modal-teacher_create-edit " open={openModal} onCancel={handleCancel} footer={null}>
                <div className="p-5">
                    <span className="text-base font-medium">Thêm giảng viên</span>
                    <div className="grid grid-cols-2 gap-2 mt-5">
                        <div>
                            <label htmlFor="">Mã giảng viên</label>
                            <Input
                                onChange={handleChangeCodeTeacher}
                                value={isValueTeacherCode}
                                className="bg-slate-200"
                            />
                            {error && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                        </div>
                        <div>
                            <label htmlFor="">Họ giảng viên</label>
                            <Input onChange={handleChangeSurname} value={isValueSurname} className="bg-slate-200" />
                            {error && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                        </div>
                        <div>
                            <label htmlFor="">Tên giảng viên</label>
                            <Input onChange={handleChangeName} value={isValueName} className="bg-slate-200" />
                            {error && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                        </div>
                        <div>
                            <label htmlFor="">Giới Tính</label>
                            <div className="flex flex-col">
                                <select
                                    className="bg-slate-200 h-8 rounded-md focus:outline-none focus:border-blue-600"
                                    id="gender"
                                    value={selectedGender}
                                    onChange={handleGenderChange}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="true">Nam</option>
                                    <option value="false">Nữ</option>
                                </select>
                                {error && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col">
                                <label htmlFor="">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="Nhập ngày sinh"
                                    className="bg-slate-200 h-8 rounded-md focus:outline-none focus:border-blue-600 px-2"
                                    value={isValueDateOfBirth}
                                    onChange={handleChangeDateOfBirth}
                                />
                            </div>
                            {error && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                        </div>
                        <div>
                            <label htmlFor="">Số điện thoại</label>
                            <Input onChange={handleChangePhone} value={isValuePhone} className="bg-slate-200" />
                            {error && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                        </div>
                        <div>
                            <label htmlFor="">CCCD</label>
                            <Input onChange={handleChangeCCCD} value={isValueCCCD} className="bg-slate-200" />
                            {error && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                        </div>
                        <div>
                            <label htmlFor="">Bộ Môn</label>
                            <div className="flex flex-col">
                                <select
                                    onChange={(e) => {
                                        handleOptionChangeTeacher(Number(e.target.value));
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
                                {error && <p className="text-red-500">Vui lòng nhập chọn bộ môn</p>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="">Địa chỉ</label>
                        <Input onChange={handleChangeAddress} value={isValueAddress} className="bg-slate-200" />
                        {error && <p className="text-red-500">Vui lòng nhập dữ liệu</p>}
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSubmitCreateTeacher} type="primary" className="mt-5">
                            Lưu
                        </Button>
                    </div>
                </div>
            </Modal>
            {/* Modal sửa giảng viên  */}
            <>
                <Modal
                    className="custom-modal-teacher_create-edit "
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-base font-medium">Sửa giảng viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-5">
                            <div>
                                <label htmlFor="">MSSV</label>
                                <Input
                                    onChange={handleChangeCodeTeacher}
                                    value={isValueTeacherCode}
                                    className="bg-slate-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Họ sinh viên</label>
                                <Input onChange={handleChangeSurname} value={isValueSurname} className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Tên sinh viên</label>
                                <Input onChange={handleChangeName} value={isValueName} className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Lớp sinh viên</label>
                                <div className="flex flex-col">
                                    <SelectOption
                                        value={selectedOptionClass}
                                        onChange={handleOptionChangeClass}
                                        apiUrl=""
                                    ></SelectOption>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="">Ngày sinh</label>
                                {/* <Input
                                    onChange={handleChangeDateOfBirth}
                                    value={isValueDateOfBirth}
                                    className="bg-slate-200"
                                /> */}
                                <input className="bg-slate-200 w-full" value={isValueDateOfBirth} type="date" id="" />
                            </div>
                            <div>
                                <label htmlFor="">Số điện thoại</label>
                                <Input onChange={handleChangePhone} value={isValuePhone} className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">CCCD</label>
                                <Input value={isValueCCCD} className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Bộ Môn</label>
                                <div className="flex flex-col">
                                    <SelectOption
                                        value={selectOptionTeacher}
                                        onChange={handleOptionChangeTeacher}
                                        apiUrl=""
                                    ></SelectOption>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="">Địa chỉ</label>
                            <Input onChange={handleChangeAddress} value={isValueAddress} className="bg-slate-200" />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSubmitEditTeacher} type="primary" className="mt-5">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal xóa giảng viên */}
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
                        <Button onClick={handleSubmitDeleteTeacher} type="primary" className="mr-5">
                            Xóa
                        </Button>
                        <Button onClick={() => setDeleteModalVisible(false)} type="default" className="mr-5">
                            Hủy
                        </Button>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default AppTeacher;

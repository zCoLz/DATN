import React, { useEffect, useState } from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import { MdOutlineDriveFileMove, MdPersonAdd } from 'react-icons/md';
import { Button, Input, Modal } from 'antd';
import './scss/styleDashboard.scss';
import SelectOption from '../../components/SelectOption';
import { parse, format } from 'date-fns';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
interface DataType {
    code: string;
    surname: string;
    name: string;
    class: string;
    dateofbirth: string;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/admin`;
const AppStudent = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'MSSV',
            dataIndex: 'code',
        },
        {
            title: 'Họ sinh viên',
            dataIndex: 'surname',
        },
        {
            title: 'Tên sinh viên',
            dataIndex: 'name',
        },
        {
            title: 'Lớp',
            dataIndex: 'class',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            fetchDataStudent();
        }
    }, []);
    const [dataStudent, setDataStudent] = useState<DataType[]>([]);
    const fetchDataStudent = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/students`, config)
            .then((response) => {
                const Api_students = response.data.response_data;
                console.log(Api_students);
                const newData: DataType[] = Api_students.map(
                    (item: { id: any; student_code: any; last_name: any; first_name: any; class_name: any }) => ({
                        id: item.id,
                        code: item.student_code,
                        surname: item.last_name,
                        name: item.first_name,
                        class: item.class_name,
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
                                        // onClick={() => handleDelete(data[0])}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </>
                        ),
                    }),
                );
                setDataStudent(newData);
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

    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteData, setSelectedDeleteData] = useState<DataType | null>(null);
    const [selectedOptionClass, setSelectedOptionClass] = useState<number | null>(null);
    const [selectedOptionSubject, setSelectedOptionSubject] = useState<number | null>(null);
    const [isValueMSSV, setIsValueMSSV] = useState('');
    const [isValueSurname, setIsValueSurname] = useState('');
    const [isValueName, setIsValueName] = useState('');
    const [isValueDateOfBirth, setIsValueDateOfBirth] = useState<Date | null>(null);
    const [isValuePhone, setIsValuePhone] = useState('');
    const [isValueCCCD, setIsValueCCCD] = useState('');
    const [isValueAddress, setIsValueAddress] = useState('');

    const [editedData, setEditedData] = useState<DataType | null>(null); // Lưu trữ dữ liệu được chỉnh sửa
    const handleEdit = (row: DataType) => {
        setEditedData(row);
        setOpenModalEdit(true);
    };
    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    const handleDelete = (row: DataType) => {
        setSelectedDeleteData(row);
        setDeleteModalVisible(true);
    };
    const handleOptionChangeClass = (value: number | null) => {
        setSelectedOptionClass(value);
    };
    const handleOptionChangeSubject = (value: number | null) => {
        setSelectedOptionSubject(value);
    };
    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpenModal(false);
    };

    const handleCreateStudent = () => {
        const roomData = {
            isValueMSSV,
            isValueSurname,
            isValueName,
            isValuePhone,
            isValueCCCD,
            isValueDateOfBirth,
            isValueAddress,
            selectedOptionClass,
            selectedOptionSubject,
        };
        console.log('RoomData: ', roomData);
        const config = HeaderToken.getTokenConfig();
        axios.post(BASE_URL, config).then((response) => {
            setIsValueMSSV('');
            setIsValueCCCD('');
            setIsValueName('');
            setIsValueSurname('');
            setIsValuePhone('');
            setIsValueAddress('');
            setIsValueDateOfBirth(null);
        });
    };
    const handleSubmitCreateModalStudent = () => {
        setOpenModal(false);
    };
    const handleSubmitEditModalStudent = () => {
        setOpenModalEdit(false);
    };
    const handleSubmitDeleteModalStudent = () => {
        setDeleteModalVisible(false);
    };

    //Hàm xử lý Change Input chỉ được nhập tối đa 10 số và có thể nhập số 0 ở đầu
    const handleChangeCodeStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formattedValue = inputValue
            .replace(/^(?=\d{1,10})/, '')
            .replace(/\D/g, '')
            .slice(0, 10);
        setIsValueMSSV(formattedValue);
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
        const inputValue = e.target.value;
        //Kiểm tra định dạng nhập vào (dd/mm/yyyy)
        const dateFormat = 'dd/MM/yyyy';
        //Parse chuỗi nhập vào thành đối tượng ngày tháng
        const pasredDate = parse(inputValue, dateFormat, new Date());
        //Kiểm tra xem pasredDate có hợp lệ không
        if (!isNaN(pasredDate.getTime())) {
            setIsValueDateOfBirth(pasredDate);
        }
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

    return (
        <>
            <div className="container mt-5">
                <div className="text-end mb-5">
                    <div className="flex justify-end gap-x-2">
                        <Button type="primary">
                            <MdOutlineDriveFileMove />
                        </Button>
                        <Button type="primary" onClick={handleShowModal}>
                            <MdPersonAdd />
                        </Button>
                    </div>
                </div>
                <Table
                    pagination={{
                        defaultPageSize: 6,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '6', '8', '12', '16'],
                    }}
                    columns={columns}
                    dataSource={dataStudent}
                    size="large"
                />
            </div>
            <div className="">
                <Modal className="custom-modal" open={openModal} onCancel={handleCancel} footer={null}>
                    <div className="p-5">
                        <span>Thêm sinh viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">MSSV</label>
                                <Input
                                    onChange={handleChangeCodeStudent}
                                    value={isValueMSSV}
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
                                <Input
                                    onChange={handleChangeDateOfBirth}
                                    value={isValueDateOfBirth ? format(isValueDateOfBirth, 'dd/MM/YYYY') : ''}
                                    className="bg-slate-200"
                                />
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
                                        value={selectedOptionSubject}
                                        onChange={handleOptionChangeSubject}
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
                            <Button onClick={handleSubmitCreateModalStudent} type="primary" className="mt-5">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
                {/* Modal Sửa sinh viên */}
                <Modal className="custom-modal" open={openModalEdit} onCancel={handleCancelEdit} footer={null}>
                    <div className="p-5">
                        <span>Sửa sinh viên</span>
                        <div className="grid grid-cols-2 gap-2 mt-10">
                            <div>
                                <label htmlFor="">MSSV</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Họ sinh viên</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Tên sinh viên</label>
                                <Input className="bg-slate-200" />
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
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Số điện thoại</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">CCCD</label>
                                <Input className="bg-slate-200" />
                            </div>
                            <div>
                                <label htmlFor="">Bộ Môn</label>
                                <div className="flex flex-col">
                                    <SelectOption
                                        value={selectedOptionClass}
                                        onChange={handleOptionChangeSubject}
                                        apiUrl=""
                                    ></SelectOption>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="">Địa chỉ</label>
                            <Input className="bg-slate-200" />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSubmitEditModalStudent} type="primary" className="mt-5">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
                <></>
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
                            <Button onClick={handleSubmitDeleteModalStudent} type="primary" className="mr-5">
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

export default AppStudent;

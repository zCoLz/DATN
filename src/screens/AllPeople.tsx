import React, { useEffect, useState } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import PeopleList from '../components/PeopleList';
import SystemConst from '../common/consts/system_const';
import HeaderToken from '../common/utils/headerToken';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Divider } from 'antd';
const dataPeople = [
    {
        id: 1,
        icon: <MdAccountCircle size={40} />,
        name: 'Giáo Viên 1',
        role: 'teacher',
    },
    {
        id: 2,
        icon: <MdAccountCircle size={40} />,
        name: 'Giáo Viên 2',
        role: 'teacher',
    },
    {
        id: 3,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn A',
        role: 'student',
    },
    {
        id: 4,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn B',
        role: 'student',
    },

    {
        id: 5,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn C',
        role: 'student',
    },
    {
        id: 6,
        icon: <MdAccountCircle size={40} />,
        name: 'Nguyễn Văn D',
        role: 'student',
    },
];
const BASE_URL = `${SystemConst.DOMAIN}`;
const AllPeople = () => {
    const [getStudent, setGetStudent] = useState([]);
    const [getTeacher, setGetTeacher] = useState([]);
    const { classroom_id } = useParams();
    useEffect(() => {
        handleFetchData();
    }, []);
    const handleFetchData = () => {
        const config = HeaderToken.getTokenConfig();
        axios
            .get(`${BASE_URL}/classrooms/get-classroom-detail/${classroom_id}`, config)
            .then((response) => {
                const data_Student = response.data.response_data.students;
                const data_Teacher = response.data.response_data.teachers;
                setGetStudent(data_Student);
                setGetTeacher(data_Teacher);
                console.log(data_Teacher);
                console.log(data_Student);
            })
            .catch((error) => {});
    };
    return (
        <div className="w-[40rem]">
            <div className="p-5">
                <table className="text-3xl text-blue-400">
                    Giáo Viên
                    <Divider className="w-[40rem] border-cyan-400 border-[1px]" />
                    <tbody className="text-xl  flex flex-col gap-y-3 text-black">
                        {getTeacher.map((teacher) => (
                            <tr key={teacher['id']}>
                                <td>
                                    {teacher['last_name']} {teacher['first_name']}
                                    <hr className="w-[40rem] mt-2 border-slate-300" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-5 ">
                <div className="text-3xl">
                    <table className="text-3xl text-blue-400 ">
                        Sinh viên
                        <Divider className="w-[40rem]  border-cyan-400 border-[1px]" />
                        <tbody className="text-xl flex flex-col gap-y-1 text-black">
                            {getStudent.map((student) => (
                                <tr key={student['id']}>
                                    <td>
                                        <div className="flex justify-between items-center">
                                            <span>
                                                {' '}
                                                {student['last_name']} {student['first_name']}
                                            </span>{' '}
                                            <span className="text-base"> {student['class_name']}</span>
                                        </div>
                                        <hr className="w-[40rem] mt-6 border-slate-300" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default AllPeople;

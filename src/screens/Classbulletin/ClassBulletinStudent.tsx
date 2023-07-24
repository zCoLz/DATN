import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import background from '../../img/bg.png';
import AddCard from '../AddCardNoti/AddCard';
import { Link, useParams } from 'react-router-dom';
import { MdContentCopy } from 'react-icons/md';
import AddCardStudent from '../AddCardNoti/AddCardStudent';
interface StudentDeadline {
    id: number;
    title: string;
    finish_date: string;
    // Các thuộc tính khác của đối tượng
  }
const ClassBulletinStudent: React.FC<{ onFetchData: any, data: any }> = ({ onFetchData, data }) => {
    const handleCopyClick = () => {
        // Logic để sao chép nội dung
        const textToCopy = data.class_code;
        navigator.clipboard.writeText(textToCopy);
    };
    const { classroom_id } = useParams();
    const [studentDeadLine, setStudentDeadLine] = useState<StudentDeadline[]>([]);
    useEffect(()=> {
        handleCheckStudentExam();
        console.log(studentDeadLine);
        
    }, []);
    const handleCheckStudentExam = () => {
        if (data.exam_deadline && data.exam_deadline.length > 0) {
            data.exam_deadline.forEach((itemS: any) => {
              const studentDeadLineItem = data.list_post.find((item: any) => item.id === itemS.id);
              if (studentDeadLineItem) {
                // Nếu tìm thấy phần tử tương ứng, thêm vào mảng state studentDeadLine
                setStudentDeadLine((prev) => [...prev, studentDeadLineItem]);
              }
            });
          }
          
    }
    const handlePassPage = (post_id: any) => {
        // navigate(`/giang-vien/class/${item['id']}`);
        window.location.replace(`/sinh-vien/class/${classroom_id}/${post_id}/detail-student`);
    };
    return (
        <div className="py-5">
            <div className="">
                <div className="w-full relative">
                    <div>
                        <img className="w-full h-auto rounded-lg" src={background} alt="Ảnh Background" />
                    </div>
                    <div className="absolute bottom-3 left-4">
                        <h1 className="text-2xl font-semibold text-white overflow-hidden truncate ... max-w-[25rem] w-full">
                            {data.class_name}
                        </h1>
                        <span className="text-base text-white font-medium overflow-hidden truncate ...">
                            {data.title}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-4 mt-8 gap-4">
                    <div className="col-span-1 ">
                        {data.class_code && (
                            <div className="bg-slate-200 rounded-md h-24 w-52 m-15  px-6 py-2 mb-4">
                                <div className="text-lg font-semibold">Mã lớp</div>
                                <div className="mt-3 text-2xl font-semibold hover:text-blue-300">
                                    <p style={{ position: 'relative' }}>
                                        <button
                                            onClick={handleCopyClick}
                                            style={{
                                                position: 'absolute',
                                                right: '0',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <MdContentCopy size={16} />
                                        </button>
                                    </p>
                                </div>{' '}
                            </div>
                        )}
                        <div className="  bg-slate-200 rounded-lg h-auto w-52 m-15 p-3 mt-0">
                            <div className="font-bold text-lg ">Sắp đến hạn</div>
                            <div className="text-sm">
                            {studentDeadLine&& studentDeadLine.map((item: any) => 
                                (
                                <button className= "border mt-2 mb-2 p-2" onClick={()=> handlePassPage(item.id)}> {item.title} </button>)
                            )}
                            </div>
                            <Link className="flex justify-end" to="/AllExercises">
                                Xem bài tập
                            </Link>
                        </div>
                    </div>
                    <div className=" col-span-3 ">
                        <AddCardStudent onFetchData= {onFetchData} data={data.list_post}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassBulletinStudent;
{
    /* <Row className='h-auto '>
                        <Col span={12}>
                            <span className='p-1'>
                                hello
                            </span>
                        </Col>
                        <Col span={12} >
                            <img className='h-[16rem] float-right' src={imgBook} alt="" />
                        </Col>
                    </Row> */
}

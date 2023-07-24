import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import HeaderToken from '../../common/utils/headerToken';
import SystemConst from '../../common/consts/system_const';
import { MdOutlineFilePresent, MdOutlineImage } from 'react-icons/md';
import ErrorAlert from '../../common/Screens/ErrorAlert';
import Notification from '../../components/Notification';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import { Button, Input, Modal } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
const { TextArea } = Input;
interface Student {
    id: number;
    submission: number;
    total_score: number;
    finish_date: string;
    first_name: string;
    last_name: string;
    file: File[];
}
interface Data {
    id: number;
    delivered: number;
    student_exams: Student[];
    submitted: number;
    title: string;
    post_category_id: number;
    files: File[];
}
interface File {
    file_id: number;
    file_name: string;
    file_type: string;
}
interface Question {
    id: number;
    content: string;
    question_category_id: number;
    score: number;
    student_answer_options: Answer[];
}
interface Answer {
    id: number;
    essay_answer: string;
    score: number;
    status: number;
}
const BASE_URL = `${SystemConst.DOMAIN}`;
const DetailTestStudent = ({
    onfetchData,
    params,
    id,
    post_category_id,
    isStudentExam,
}: {
    onfetchData: any;
    params: any;
    id: number | undefined;
    post_category_id: any;
    isStudentExam: any;
}) => {
    const [isStudent, setIsStudent] = useState<Student>();
    const [fileId, setFileId] = useState(0);
    const [isStudentExamFile, setIsStudentExamFile] = useState<Data>();
    const [isModalDownloadFile, setIsModalDownloadFile] = useState(false);
    const [points, setPoints] = useState<number>(0);
    const [pointsValue, setPointsValue] = useState<number | undefined>(0);
    const [pointsEssay, setPointsEssay] = useState<{ [key: number]: number }>({});
    const [percent, setPercent] = useState(0);
    const [progressbar, setProgressbar] = useState('none');
    useEffect(() => {
        const temp = params?.student_exams.find((x: any) => x.id === id);
        setIsStudent(temp);
        setIsStudentExamFile(isStudentExam);
        setPointsValue(isStudent?.total_score);
        if ((isStudent?.submission === 1 || isStudent?.submission === 2) && post_category_id === 4) {
            handleListQuestion();
        }
    }, [id, isStudent?.total_score, isStudent?.submission, onfetchData]);
    const handleDownPost = async (id: number, fileId: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.replace('/');
        } else {
            // setLoading(true);
            const post_id = id;
            const file_id = fileId;

            const axiosInstance = axios.create({});
            axiosInstance.interceptors.request.use((config) => {
                // Thay YOUR_AUTH_TOKEN bằng giá trị token thực tế của bạn
                config.headers.authorization = `Bearer ${token}`;
                return config;
            });
            axiosInstance
                .get(`${BASE_URL}/files/${post_id}/${file_id}/download`, {
                    responseType: 'arraybuffer',
                    onDownloadProgress: (progressEvent) => {
                        const loaded = progressEvent.loaded;
                        const total = progressEvent.total || 0;
                        const percentComplete = Math.round((loaded * 100) / total);
                        // Cập nhật giá trị phần trăm
                        setPercent(percentComplete);
                        // Xử lý logic khác dựa trên tiến trình tải xuống
                        // Ví dụ: Hiển thị thông báo khi tải xuống hoàn tất
                        if (percentComplete === 100) {
                            console.log('Tải xuống hoàn tất!');
                            setProgressbar('none');
                        }
                    },
                })
                .then((response) => {
                    const disposition = response.headers['content-disposition'];
                    const decord = disposition.split('filename=')[1].replace(/"/g, '');
                    const filename = decodeURIComponent(decord);
                    const file = new Blob([response.data]);
                    const url = URL.createObjectURL(file);
                    const link = document.createElement('a');
                    const { data } = response;
                    const newPercent = data.percent; // Giá trị tiến trình tải xuống từ API
                    setPercent(newPercent);
                    link.href = url;
                    link.setAttribute('download', filename); // Đặt tên và đuôi file tại đây
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setIsModalDownloadFile(false);
                    Notification('success', 'Thông báo', 'Bạn đã tải 1 file thành công');
                })
                .catch((error) => {
                    if (error) {
                        const isError = UnauthorizedError.checkError(error);

                        if (!isError) {
                            let content = '';
                            const {
                                status,
                                data: { error_message: errorMessage },
                            } = error.response;
                            if (status === 404 && errorMessage === 'Classroom no exist') {
                                content = 'Lớp không tồn tại';
                            } else if (status === 403 && errorMessage === 'No permission') {
                                content = 'Bạn không có quyền truy cập vào lớp này';
                            } else {
                                content = 'Lỗi máy chủ';
                            }
                            const title = 'Lỗi';
                            const path = '/sinh-vien';

                            ErrorAlert(title, content, path);
                        }
                    } else {
                        const title = 'Lỗi';
                        const content = 'Máy chủ không hoạt động';
                        localStorage.clear();
                        const path = '/';
                        ErrorAlert(title, content, path);
                    }
                    // Xử lý lỗi nếu có
                    console.error(error);
                })
                .finally(() => {
                    // setLoading(false);
                });
        }
    };
    const handleChange = () => {
        return (
            <>
                <div > {isStudent?.submission === 1  || isStudent?.submission === 2?  <div className='flex justify-between'> <div>Ngày nộp:</div><div>{handleFormatDate(isStudent?.finish_date)}</div></div> :''}</div>
                <div className="flex justify-center gap-x-5 w-[20rem]">
                    <div className="w-[70%]">
                        {isStudent?.submission === 1
                            ? 'Chưa chấm điểm'
                            : isStudent?.submission === 2
                            ? 'Đã chấm điểm'
                            : 'Chưa nộp'}
                    </div>
                    <div className="w-[30%] flex justify-between">
                        <div> {pointsValue}/100</div>
                    </div>
                </div>
            </>
        );
    };
    const handlePopupDownloadFile = (file_id: any) => {
        setIsModalDownloadFile(true);
        setFileId(file_id);
    };
    const handleVisibleDownloadFile = () => {
        setIsModalDownloadFile(false);
    };
    const onChangeValuePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = Number(e.target.value); // Chuyển đổi giá trị thành số
        if (value < 0) {
            value = 0;
        } else if (value > 100) {
            value = 100;
        }
        setPoints(value);
    };
    // const onChangeValuePointEssay = (e: React.ChangeEvent<HTMLInputElement>, item: any) => {
    //     let value = Number(e.target.value);
    //     if (value < 0) {
    //         value = 0;
    //     } else if (value > item.score) {
    //         value = item.score;
    //     }
    //     setPointsEssay(value);
    // };
    const handleQuestionPointChange = (question_id: number, score: number) => {
        setPointsEssay((prevPointsEssay) => ({
            ...prevPointsEssay,
            [question_id]: score,
        }));
    };
    // const questionsWithoutId = {
    //     score: pointsEssay[id],
    //     question_id: dataAnswerstudent_answer_options[0].id,
    // };
    const config = HeaderToken.getTokenConfig();
    const handleSubmitPoint = () => {
        let data;
        if (post_category_id === 4) {
            const questionsWithoutId = Object.entries(pointsEssay).map(([question_id, score]) => ({
                question_id: parseInt(question_id),
                score,
            }));
            if (questionsWithoutId.length === 0) {
                return Notification('error', 'Thông báo', 'Chưa sửa điểm');
            }
            console.log(questionsWithoutId);
            data = {
                student_exam_id: isStudent?.id,
                post_id: isStudentExamFile?.id,
                list_questions_and_score: questionsWithoutId,
            };
        } else {
            data = {
                score: points,
                post_id: isStudentExamFile?.id,
                student_exam_id: isStudent?.id,
            };
        }

        axios.put(`${BASE_URL}/teachers/score-for-student`, data, config).then((response) => {
            setPoints(0);
            {
                isStudent?.submission === 1
                    ? Notification('success', 'Thông báo', 'Lưu thành công ')
                    : Notification('success', 'Thông báo', 'Sửa thành công ');
            }
            onfetchData();
        });
    };

    const student_exam_id = isStudent?.id;
    const [dataAnswer, setDataAnswer] = useState<Question[]>([]);
    const [dataQuestion, setDataQuestion] = useState<Question>();
    const { post_id } = useParams();
    const handleListQuestion = () => {
        axios
            .get(`${BASE_URL}/teachers/${student_exam_id}/${post_id}/get-list-essay-question`, config)
            .then((response) => {
                const DataList = response.data.response_data;
                setDataQuestion(DataList.question_id);
                setDataAnswer(DataList);
                console.log('Đây nè', response.data);
            });
    };
    const handleCheckStatusEssay = (item: Question) => {
        if (item.student_answer_options[0]?.status === 2) {
            return 'Đã chấm';
        } else if (item.student_answer_options[0]?.status === 1) {
            return 'Chưa chấm';
        }
        return 'Không làm';
    };    
    const handleFormatDate = (formatDate: any) => {
        return dayjs(formatDate).format('DD/MM/YYYY HH:mm');
    };
    return (
        <>
            <div className=" flex justify-between flex-row">
                <div className="text-lg font-medium flex flex-row w-[20rem]">
                    <span className="w-[90%]">
                        {isStudent?.last_name} {isStudent?.first_name}{' '}
                    </span>
                    {isStudent?.submission === 0 ? (
                        ''
                    ) : (
                        <div>
                            {post_category_id === 4 ? (
                                ''
                            ) : (
                                <Input
                                    value={points}
                                    onChange={onChangeValuePoint}
                                    className="w-[100%]"
                                    min={0}
                                    max={100}
                                    type="number"
                                    placeholder="Điểm"
                                ></Input>
                            )}
                        </div>
                    )}
                </div>
                <div className="text-xl font-medium">{handleChange()}</div>
            </div>
            {(isStudent?.submission === 1 || isStudent?.submission === 2) && post_category_id === 3 && (
                <div className="flex flex-col gap-y-2 p-5 w-80  ">
                    {isStudent?.file.map((file: any) => {
                        return (
                            <button
                                onClick={() => handlePopupDownloadFile(file.file_id)}
                                className="border-[1px] rounded-sm border-gray-400 p-2 flex items-center"
                            >
                                {['image/jpg', 'image/jpeg', 'image/png'].includes(file.file_type) ? (
                                    <div className="w-10 h-10">
                                        <MdOutlineImage size={30} />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10">
                                        <MdOutlineFilePresent size={30} />
                                    </div>
                                )}
                                <div className="text-ellipsis overflow-hidden ...  max-w-xs w-[15rem]">
                                    {file.file_name}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
            {post_category_id === 4 ? (
                <div>
                    {isStudent?.submission !== 0 && (
                        <div className="border-2 border-slate-300 rounded-lg mt-2 p-5 max-h-60 overflow-auto">
                            {dataAnswer.map((item: any) => (
                                <div className="">
                                    <div className=" flex justify-between items-center">
                                        <div className="text-lg font-medium w-[70%]">Câu hỏi: {item.content}</div>

                                        <div className="flex gap-x-2 items-center">
                                            <div className="text-base">Điểm câu này tối đa là {item.score}</div>
                                            <div>
                                                <Input
                                                    // onChange={(e) => onChangeValuePointEssay(e, item)}
                                                    onChange={(e) =>
                                                        handleQuestionPointChange(item.id, Number(e.target.value))
                                                    }
                                                    disabled={item.student_answer_options.length === 0 ? true : false}
                                                    value={
                                                        pointsEssay[item.id]?.toString() ||
                                                        item.student_answer_options[0]?.score
                                                    }
                                                    type="number"
                                                    min={0}
                                                    max={item.score}
                                                ></Input>
                                            </div>
                                            <div>{handleCheckStatusEssay(item)}</div>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <TextArea
                                            value={item?.student_answer_options[0]?.essay_answer}
                                            className="text-lg"
                                            style={{ height: 'auto', overflow: 'hidden', resize: 'none' }}
                                            disabled
                                            showCount
                                            placeholder="Nhập câu trả lời"
                                        ></TextArea>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                ''
            )}

            {isStudent?.submission === 0 ? (
                ''
            ) : (
                <div className="text-end p-4">
                    <Button onClick={handleSubmitPoint} type="primary">
                        {isStudent?.submission === 2 ? 'Sửa' : 'Lưu'}
                    </Button>
                </div>
            )}
            {isStudentExamFile?.id ? (
                <Modal
                    visible={isModalDownloadFile}
                    open={isModalDownloadFile}
                    title="Thông báo"
                    onCancel={handleVisibleDownloadFile}
                    className="custom-modal-download-file"
                    footer={null}
                >
                    <div>
                        <p>Bạn có muốn tải file này ?</p>
                    </div>
                    <div className="flex justify-end h-full mt-20">
                        <Button
                            type="primary"
                            onClick={() => handleDownPost(isStudentExamFile?.id, fileId)}
                            className="mr-5"
                        >
                            Tải File
                        </Button>

                        <Button onClick={handleVisibleDownloadFile} type="default" className="mr-5">
                            Hủy
                        </Button>
                    </div>
                </Modal>
            ) : (
                ''
            )}
        </>
    );
};

export default DetailTestStudent;

import React, { useEffect, useState } from 'react';
import {
    MdAccountCircle,
    MdBook,
    MdLink,
    MdMoreVert,
    MdNoteAlt,
    MdOutlineAssignment,
    MdOutlineBook,
    MdOutlineFilePresent,
    MdOutlineFileUpload,
    MdOutlineGroup,
    MdOutlineImage,
    MdPermIdentity,
    MdSend,
} from 'react-icons/md';
import TextFeild from '../../../components/TextFeild';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import HeaderToken from '../../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../../common/consts/system_const';
import Notification from '../../../components/Notification';
import UnauthorizedError from '../../../common/exception/unauthorized_error';
import ErrorAlert from '../../../common/Screens/ErrorAlert';
import { Avatar ,Button, Modal, Popconfirm, Upload } from 'antd';
import './scss/style.scss';
import utc from 'dayjs/plugin/utc';
import CustomButtonDelete from '../../../components/CustomButtonDelete';
import ErrorCommon from '../../../common/Screens/ErrorCommon';
dayjs.extend(utc);
interface Comment {
    id: number;
    content: string;
    last_name: string;
    first_name: string;
    comment_date: string;
    account_id: number;
    avatar: string;
}
interface File {
    file_id: number;
    file_name: string;
    file_type: string;
}
interface Detail {
    id: number;
    content: string;
    post_category_id: number;
    files: File[];
    comments: Comment[];
    create_date: string;
    finish_date: string;
    start_date: string;
    title: string;
    last_name: string;
    first_name: string;
    student_exams: StudentExam[];
}
interface StudentExam {
    submission: number;
    id: number;
    file: File[];
    total_score: number;
}
const BASE_URL = `${SystemConst.DOMAIN}`;
const DetailExcercise = () => {
    const [valueStudentExam, setValueStudentExam] = useState<StudentExam>();
    const [valueStudentExamTemp, setValueStudentExamTemp] = useState<StudentExam>();
    const [textValue, setTextValue] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [isData, setIsData] = useState<Detail>();
    const [percent, setPercent] = useState(0);
    const [progressbar, setProgressbar] = useState('none');
    const [isModalDownloadFile, setIsModalDownloadFile] = useState(false);
    const [fileId, setFileId] = useState(0);
    const handleTextField = (value: string) => {
        setTextValue(value);
    };

    const handleRemoveComment = (id: any) => {
        // Xử lý logic xóa mục với id tương ứng
        console.log(`Deleting comment with id: ${id}`);
    };

    const handleToggleDelete = (id: any) => {
        console.log('id: ', id);
    };
    const handleButtonClick = () => {
        if (textValue) {
            const newComment = {
                post_id: isData?.id,
                content: textValue,
            };

            const config = HeaderToken.getTokenConfig();
            axios.post(`${BASE_URL}/comments/create-comment`, newComment, config).then((response) => {
                const dataComment = response.data.response_data;
                console.log(response);

                setComments([...comments, dataComment]);
            });
            setTextValue('');
        }
    };
    const handleOpenForm = () => {
        setShowForm(true);
    };
    const handleCancelForm = () => {
        setShowForm(false);
    };
    const navigate = useNavigate();
    useEffect(() => {
        handleFetchData();
    }, []);
    const { post_id, classroom_id, post_category_id } = useParams();
    const handleFetchData = () => {
        const config = HeaderToken.getTokenConfig();
        axios.get(`${BASE_URL}/posts/${post_id}/post-detail`, config).then((response) => {
            const dataFetch = response.data.response_data;
            setIsData(dataFetch);
            console.log(dataFetch);
            setComments(dataFetch.comments);
            setValueStudentExam(dataFetch.student_exams[0]);
            setValueStudentExamTemp(dataFetch.student_exams[0]);

            console.log(dataFetch);
        });
    };
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
                .get(`${SystemConst.DOMAIN}/files/${post_id}/${file_id}/download`, {
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
    const handleTest = () => {
        const formatStartDate = dayjs(isData?.start_date).format('DD/MM/YYYY HH:mm:ss');
        const formatFinishDate = dayjs(isData?.finish_date).format('DD/MM/YYYY HH:mm:ss');
        const currentDay = dayjs().format('DD/MM/YYYY HH:mm:ss');
        if (currentDay < formatStartDate) {
            Notification(
                'info',
                'Thông báo',
                `Chưa tới giờ bắt đầu làm bài!!! Giờ bắt đầu ${formatStartDate} giờ kết thúc ${formatFinishDate}`,
            );
        } else if (currentDay > formatFinishDate) {
            Notification('info', 'Thông báo', `Đã quá thời hạn làm bài `);
        } else {
            navigate(`/sinh-vien/class/${classroom_id}/${post_id}/detail-student/test`);
        }
        console.log(currentDay, formatFinishDate);
    };

    const [send, setSend] = useState(false);
    const handleSubmitFile = () => {
        const config = HeaderToken.getTokenConfig();
        const formData = new FormData();
        if (post_id && valueStudentExam?.id) {
            formData.append('post_id', post_id?.toString());
            formData.append('student_exam_id', valueStudentExam.id.toString());

            if (valueStudentExam.submission === 0 && valueStudentExamTemp) {
                if (
                    selectedFile.length !== 0 ||
                    removeFile.length > valueStudentExamTemp.file.length ||
                    (valueStudentExamTemp.file && removeFile.length !== valueStudentExamTemp.file.length)
                ) {
                    console.log(valueStudentExamTemp.file && removeFile.length !== valueStudentExamTemp.file.length);
                    selectedFile.forEach((files) => {
                        formData.append(`files`, files);
                    });
                    formData.append('list_files_remove', JSON.stringify(removeFile));
                } else {
                    return Notification('warning', 'Thông báo', 'Vui lòng chọn file');
                }
            }
        }
        setSelectedFile([]);

        axios
            .post(`${BASE_URL}/students/submission/`, formData, config)
            .then((response) => {
                setSend(false);
                handleFetchData();
                console.log(response);
                setRemoveFile([]);
            })
            .catch((error) => {
                setSend(false);
                console.log(error);
            });
    };
    console.log(valueStudentExam);

    const handlePopupDownloadFile = (file_id: any) => {
        setIsModalDownloadFile(true);
        setFileId(file_id);
    };
    const handleVisibleDownloadFile = () => {
        setIsModalDownloadFile(false);
    };
    const formatDate = dayjs(isData?.create_date).format('DD/MM/YYYY HH:mm');
    const handleFormatDate = (formatDate: any) => {
        return dayjs(formatDate).format('DD/MM/YYYY HH:mm');
    };
    const [visibleCount, setVisibleCount] = useState(3);

    const handleShowMoreComments = () => {
        setVisibleCount(comments.length);
    };
    const [selectedFile, setSelectedFile] = useState<any[]>([]);

    const handleFileUpload = (file: any) => {
        setSelectedFile((prevSelectedFiles) => [...prevSelectedFiles, file]);
        console.log(file);
    };
    const handleRemoveFile = (file: any) => {
        setSelectedFile((prevSelectedFile) => prevSelectedFile.filter((f) => f.uid !== file.uid));
    };
    const handleChangeIcon = (post_category_id: any) => {
        if (post_category_id === 2) {
            return <MdOutlineBook className="bg-blue-400 text-white rounded-full p-1  w-10 h-10" size={32} />;
        } else if (post_category_id === 3) {
            return <MdOutlineAssignment className="bg-blue-400 rounded-full text-white p-1  w-10 h-10" size={32} />;
        } else if (post_category_id === 4) {
            return <MdNoteAlt className="bg-blue-400 rounded-full text-white p-1   w-10 h-10" size={32} />;
        }
        return '';
    };
    const user = localStorage.getItem('user');
    const accountId = user ? JSON.parse(user).account_id : null;
    console.log(accountId);

    const [submissionStatus, setSubmissionStatus] = useState<number>(valueStudentExam?.submission || 0);
    const handleButtonCancelEx = () => {
        if (submissionStatus === 0) {
            handleSubmitFile();
            // Nếu trạng thái hiện tại là "Nộp bài", thực hiện hành động nộp bài
            setSubmissionStatus(1); // Cập nhật trạng thái thành "Đã nộp"
        } else if (submissionStatus === 1) {
            // Nếu trạng thái hiện tại là "Đã nộp", thực hiện hành động hủy nộp
            handleSubmitFile();
            setSubmissionStatus(0); // Cập nhật trạng thái thành "Nộp bài"
        }
    };
    const [removeFile, setRemoveFile] = useState<number[]>([]);
    const handleRemoveFileInSnubmit = (idFile: number) => {
        setRemoveFile((prevRemoveFile) => [...prevRemoveFile, idFile]);
        if (valueStudentExam) {
            const studentExam = {
                ...valueStudentExam,
                file: valueStudentExam?.file.filter((file) => file.file_id !== idFile) ?? [],
            };
            setValueStudentExam(studentExam);
        }
    };
    const handleDelete = (id: number) => {
        console.log(id);
        const config = HeaderToken.getTokenConfig();
        const comment_id = id;

        axios
            .delete(`${BASE_URL}/comments/${comment_id}/delete-comment`, config)
            .then(() => {
                handleFetchData();
            })
            .then((response) => {})
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    let content = '';
                    const title = 'Lỗi';
                    const {
                        status,
                        data: { error_message: errorMessage },
                    } = error.response;
                    if (status === 404 && errorMessage === 'Not exist') {
                        content = 'Không tồn tại';
                    } else if (status === 400 && errorMessage === 'Delete not success') {
                        content = 'Xóa không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
        // Logic xử lý xóa item với ID cụ thể
    };
    return (
        <>
            <div className="flex justify-center p-10">
                <div className="mr-5">{handleChangeIcon(isData?.post_category_id)}</div>

                <div className="w-[45rem] gap-y-3 flex flex-col">
                    <div className="flex justify-between items-center ">
                        <span className="text-3xl text-blue-300">{isData?.title}</span>
                    </div>
                    <div className="flex gap-x-2 items-center">
                        <p>
                            {isData?.last_name} {isData?.first_name}
                        </p>
                        <span>•</span>
                        <span className="opacity-50 text-sm">{formatDate}</span>
                    </div>
                    <hr className="my-2 border-blue-500" />
                    {isData?.post_category_id === 4 ? (
                        <div>
                            {isData.student_exams[0].submission === 0 ? (
                                <div onClick={handleTest} className="border-2 flex gap-x-2 items-center p-4 rounded-md">
                                    <button>
                                        <MdLink size={30} />
                                    </button>
                                    <button>Đây là link làm bài</button>
                                </div>
                            ) : (
                                <div>
                                    Đã nộp bài
                                    <div>
                                        {isData?.student_exams[0]?.submission === 2
                                            ? isData?.student_exams[0]?.total_score
                                            : 0}
                                        /100
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div>{isData?.content}</div>

                            <div className="grid grid-cols-2 gap-x-2 gap-y-2 p-6 ">
                                {isData?.files.map((item: any) => (
                                    <button
                                        onClick={() => handlePopupDownloadFile(item.file_id)}
                                        className="border-[1px] rounded-lg border-gray-400 p-3 flex items-center"
                                    >
                                        {['image/jpg', 'image/jpeg', 'image/png'].includes(item.file_type) ? (
                                            <div className="w-10 h-10">
                                                <MdOutlineImage size={30} />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10">
                                                <MdOutlineFilePresent size={30} />
                                            </div>
                                        )}
                                        <div className="text-ellipsis overflow-hidden ...  max-w-xs w-[15rem]">
                                            {item.file_name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <hr />
                    <div className="w-[40rem]">
                        <div className="flex items-center gap-x-2 mb-2">
                            <span className="text-gray-500">
                                <MdOutlineGroup size={20} />
                            </span>
                            <span>Nhận xét của lớp học</span>
                        </div>
                        <div className="flex items-center gap-x-2 w-[45rem]">
                            <span className="">
                                <MdAccountCircle size={40} />
                            </span>
                            <div>
                                <span className="border-2 rounded-2xl justify-between flex items-center h-10 w-full">
                                    <TextFeild
                                        className="rounded-xl  px-4 w-[40rem]"
                                        value={textValue}
                                        onChange={handleTextField}
                                        placeholder="Thêm nhận xét trong lớp học"
                                    />
                                    <span
                                        className={`mr-2 text-blue-400 ${
                                            textValue ? 'cursor-pointer' : 'cursor-not-allowed '
                                        }`}
                                        onClick={handleButtonClick}
                                    >
                                        <MdSend size={20} />
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div>
                            {/* {visibleCount < comments.length && (
                                <div className="mt-4">
                                    <button onClick={handleShowMoreComments}>Nhận xét</button>
                                </div>
                            )} */}
                            <div className="mt-4">
                                Tổng nhận xét: {comments.length}
                                <div></div>
                            </div>
                            {comments.map((item, index) => {
                                if (index < visibleCount) {
                                    return (
                                        <div className="flex justify-between mt-4 gap-x-2" key={index}>
                                            <div className="flex">
                                                <div className='mr-4'>
                                                    <div>
                                                    <Avatar src={item.avatar} alt="Hình ảnh" size={45} shape="circle"/>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex gap-x-2 font-medium">
                                                        <span>
                                                            {item.last_name} {item.first_name}
                                                        </span>
                                                        <span>{handleFormatDate(item.comment_date)}</span>
                                                    </div>
                                                    <span>
                                                        <div>{item.content}</div>
                                                    </span>
                                                </div>
                                            </div>
                                            {item.account_id == accountId && (
                                                <div>
                                                    {item.account_id == accountId && (
                                                        <div>
                                                            <CustomButtonDelete onDelete={handleDelete} item={item} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            {visibleCount < comments.length && (
                                <div className="mt-4">
                                    <button onClick={handleShowMoreComments}>Nhận xét</button>
                                </div>
                            )}
                            {/* {visibleCount === comments.length && (
                             
                            )} */}
                        </div>
                    </div>
                </div>
                {isData?.post_category_id === 3 ? (
                    <div>
                        <div className="shadow-lg bg-zinc-100 rounded-md px-5 py-5 ml-10 grid gap-y-5 ">
                            <div className="flex justify-between">
                                <div>Bài tập của bạn</div>
                                <div>
                                    {isData.student_exams[0].submission === 2
                                        ? isData?.student_exams[0]?.total_score
                                        : 0}
                                    /100
                                </div>
                                {/* <div className="text-red-500 font-medium">Thiếu</div> */}
                            </div>
                            <div className="flex flex-col max-w-[15rem]">
                                <div className=" overflow-auto max-h-40 mb-2">
                                    {valueStudentExam?.file &&
                                        valueStudentExam?.file.map((item: any) => (
                                            <div className="border-2 p-2 flex flex-row max-h-40  gap-y-3 items-center">
                                                <div>
                                                    {['image/jpg', 'image/jpeg', 'image/png'].includes(
                                                        item.file_type,
                                                    ) ? (
                                                        <div className="w-10 h-10">
                                                            <MdOutlineImage size={32} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10">
                                                            <MdOutlineFilePresent size={32} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="truncate">{item.file_name}</div>
                                                <Button
                                                    disabled={
                                                        valueStudentExam.submission === 1 ||
                                                        valueStudentExam.submission === 2
                                                            ? true
                                                            : false
                                                    }
                                                    type="default"
                                                    onClick={() => {
                                                        handleRemoveFileInSnubmit(item.file_id);
                                                    }}
                                                    danger
                                                    shape="circle"
                                                >
                                                    X
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                                {valueStudentExam?.submission === 0 && (
                                    <div className="overflow-auto max-h-40 p-4 border-[2px] border-slate-300 py-2 hover:border-blue-400 duration-200 rounded-md text-center text-blue-400 mb-2">
                                        <Upload
                                            listType="picture"
                                            multiple
                                            className=""
                                            showUploadList={{ showRemoveIcon: true }}
                                            accept=".png,.jpeg,.jpg,.pdf,.docx,.doc,.pptx,.xlsx,.rar,.zip "
                                            action={'http://localhost:3000/'}
                                            beforeUpload={(file) => {
                                                handleFileUpload(file);
                                                return false;
                                            }}
                                            onRemove={handleRemoveFile}
                                        >
                                            <button className="flex items-center gap-x-2">
                                                <MdOutlineFileUpload /> Tải file
                                            </button>
                                        </Upload>
                                    </div>
                                )}

                                {valueStudentExam?.submission === 0 && (
                                    <button
                                        className="bg-blue-400 py-2  hover:bg-blue-500 rounded-md duration-200 font-medium text-white"
                                        onClick={handleButtonCancelEx}
                                    >
                                        Nộp bài
                                    </button>
                                )}
                                {valueStudentExam?.submission === 1 && (
                                    <button
                                        className="bg-gray-400 py-2  rounded-md duration-200 font-medium text-white"
                                        onClick={handleButtonCancelEx}
                                    >
                                        Hủy nộp
                                    </button>
                                )}
                                {valueStudentExam?.submission === 2 && (
                                    <button
                                        disabled
                                        className="bg-gray-400 py-2  rounded-md duration-200 font-medium text-white"
                                    >
                                        Đã chấm điểm
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="shadow-lg bg-zinc-100 rounded-md px-5 py-5 ml-10 grid gap-y-5 w-72 mt-5">
                            <div className="flex items-center gap-x-5">
                                <span>
                                    <MdPermIdentity size={24} />
                                </span>
                                <span>Nhận xét riêng tư</span>
                            </div>

                            {!showForm ? (
                                <div onClick={handleOpenForm} className="border-1 h-8 m-auto flex items-center">
                                    <div className="font-medium hover:text-blue-400 cursor-pointer">Thêm nhận xét</div>
                                </div>
                            ) : (
                                <form className="border-1 border-blue-400 h-auto w-full m-15 rounded-xl max-w-3xl p-1">
                                    <div className="flex items-center justify-around">
                                        <div className="w-full max-w-3xl overflow-auto px-2">
                                            <label htmlFor="Thông báo">Nhận xét</label>
                                            <TextArea style={{ resize: 'none', height: '100px', padding: '5px' }} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className=" mr-4">
                                            <button
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-800 transition-all duration-200 text-white font-medium py-2 px-4 rounded-md"
                                            >
                                                Đăng
                                            </button>
                                            <button
                                                onClick={handleCancelForm}
                                                type="button"
                                                className="bg-gray-300 hover:bg-gray-400 transition-all duration-200 ml-2 px-4 py-2 rounded-md font-medium"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
            {isData?.id ? (
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
                        <Button type="primary" onClick={() => handleDownPost(isData?.id, fileId)} className="mr-5">
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

export default DetailExcercise;

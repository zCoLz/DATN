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
    MdOutlineGroup,
    MdOutlineImage,
    MdPermIdentity,
    MdSend,
} from 'react-icons/md';
import TextFeild from '../../../components/TextFeild';
import { log } from 'console';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import HeaderToken from '../../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../../common/consts/system_const';
import Notification from '../../../components/Notification';
import UnauthorizedError from '../../../common/exception/unauthorized_error';
import ErrorAlert from '../../../common/Screens/ErrorAlert';
import { Button, Modal } from 'antd';
import './scss/style.scss';
import CustomButton from '../../../components/CustomButton';
import CustomButtonDelete from '../../../components/CustomButtonDelete';
import ErrorCommon from '../../../common/Screens/ErrorCommon';
interface Comment {
    id: number;
    content: string;
    last_name: string;
    first_name: string;
    comment_date: string;
    account_id: number;
}
interface File {
    file_id: string;
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
}
const BASE_URL = `${SystemConst.DOMAIN}`;
const DetailExcercise = () => {
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
    const handleButtonClick = () => {
        if (textValue) {
            const newComment = {
                post_id: isData?.id,
                content: textValue,
            };

            const config = HeaderToken.getTokenConfig();
            axios.post(`${BASE_URL}/comments/create-comment`, newComment, config).then((response) => {
                const dataComment = response.data.response_data;
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
        navigate(`/giang-vien/class/${classroom_id}/${post_id}/detail-test/test`);
    };
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
    const role = localStorage.getItem('role');
    const handleChange = (post_category_id: any) => {
        if (post_category_id === 2) {
            return <MdOutlineBook className="bg-blue-400 text-white rounded-full p-1.5 w-10 h-10" size={32} />;
        } else if (post_category_id === 3) {
            return <MdOutlineAssignment className="bg-blue-400 rounded-full text-white  p-1.5 w-10 h-10" size={32} />;
        } else if (post_category_id === 4) {
            return <MdNoteAlt className="bg-blue-400 rounded-full text-white  p-1.5 w-10 h-10" size={32} />;
        }
        return '';
    };
    const handleDelete = (id: number) => {
        console.log(id);
        const config = HeaderToken.getTokenConfig();
        const comment_id = id;
        axios
            .delete(`${BASE_URL}/comments/${comment_id}/delete-comment`, config)
            .then((response) => {
                const updatedCommentList = comments.filter((comment) => comment.id !== comment_id);
                setComments(updatedCommentList);
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
    };
    const user = localStorage.getItem('user');
    const accountId = user ? JSON.parse(user).account_id : null;
    return (
        <>
            <div className="flex justify-center ">
                <div className="mr-5">{handleChange(isData?.post_category_id)} </div>
                <div className="w-[45rem] gap-y-3 flex flex-col">
                    <div className="flex justify-between items-center ">
                        <span className="text-3xl text-blue-300">{isData?.title}</span>
                        <span>
                            <MdMoreVert
                                className="hover:bg-blue-200 rounded-full transition-all duration-300  cursor-pointer"
                                size={24}
                            />
                        </span>
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
                        <div onClick={handleTest} className="border-2 flex gap-x-2 items-center p-4 rounded-md">
                            <button>
                                <MdLink size={30} />
                            </button>
                            <button>Đây là link làm bài</button>
                        </div>
                    ) : (
                        <div>
                            <div>{isData?.content}</div>
                            <div className="grid grid-cols-2 gap-x-2">
                                {isData?.files.map((item: any) => (
                                    <button
                                        onClick={() => handlePopupDownloadFile(item.file_id)}
                                        className="border-[1px] rounded-sm border-gray-400 p-2 flex items-center"
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
                        <div>
                            <span></span>

                            <div className="mt-4">
                                Tổng nhận xét: {comments.length}
                                <div></div>
                            </div>
                            {comments.map((item, index) => {
                                if (index < visibleCount) {
                                    return (
                                        <div className="flex justify-between mt-4 gap-x-2" key={index}>
                                            <div className="flex">
                                                <div>
                                                    <div>
                                                        <MdAccountCircle size={40} />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className=" flex gap-x-2 font-medium">
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
                                                    <CustomButtonDelete onDelete={handleDelete} item={item} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            })}
                            {visibleCount < comments.length && (
                                <div className="mt-4">
                                    <button onClick={handleShowMoreComments}>Nhận xét</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {isData?.post_category_id === 3 && role === '0' ? (
                    <div>
                        <div className="shadow-lg bg-zinc-100 rounded-md px-5 py-5 ml-10 grid gap-y-5 w-72">
                            <div className="flex justify-between">
                                <div>Bài tập của bạn</div>
                                <div className="text-red-500 font-medium">Thiếu</div>
                            </div>
                            <div className="flex flex-col gap-y-3">
                                <button className="border-[2px] border-slate-300 py-2 hover:border-blue-400 duration-200 rounded-md text-blue-400">
                                    Import
                                </button>
                                <button className="bg-blue-400 py-2  hover:bg-blue-500 rounded-md duration-200 font-medium text-white">
                                    Đánh dấu đã hoàn thành
                                </button>
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

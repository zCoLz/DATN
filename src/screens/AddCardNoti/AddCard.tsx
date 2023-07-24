import React, { useState, useRef, useEffect } from 'react';
import iconUser from '../../img/iconUser.svg';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import {
    MdAccountCircle,
    MdNoteAlt,
    MdOutlineAssignment,
    MdOutlineBook,
    MdOutlineFilePresent,
    MdOutlineFileUpload,
    MdOutlineImage,
} from 'react-icons/md';
import { Button, Input, Modal, Progress, Spin, Tooltip, Upload, notification } from 'antd';
import axios from 'axios';
import HeaderToken from '../../common/utils/headerToken';
import SystemConst from '../../common/consts/system_const';
import { useNavigate, useParams } from 'react-router-dom';
import Notification from '../../components/Notification';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorAlert from '../../common/Screens/ErrorAlert';
import '../scss/style.scss';
import TextArea from 'antd/es/input/TextArea';
import CustomButton from '../../components/CustomButton';

interface Files {
    file_name: string;
    file_type: string;
    file_id: number;
}
interface News {
    id: number;
    title: string;
    content: string;
    files: Files[];
}
const BASE_URL = `${SystemConst.DOMAIN}`;
const AddCard = ({ onFetchData, data }: { onFetchData: any; data: any }) => {
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [value, setValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<any[]>([]);
    const { classroom_id } = useParams();
    const [loading, setLoading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [percent, setPercent] = useState(0);
    const [progressbar, setProgressbar] = useState('none');
    const [postList, setPostList] = useState([]);
    const [editNew, setEditNew] = useState<News[]>([]);
    const [getNew, setGetNew] = useState<News>();
    useEffect(() => {
        setPostList(data);
        setEditNew(data);
    }, [data]);
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
                            const path = '/giang-vien';

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
                    setLoading(false);
                    setDownloadComplete(false);
                });
                setModalDownloadFile(false);
        }
    };
    const handleFetchUploadFile = () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };
        if (classroom_id) {
            const parser = new DOMParser();
            const parsedContent = parser.parseFromString(value, 'text/html');
            const plainTextContent = parsedContent.body.textContent || '';
            const parsedClassroomId = parseInt(classroom_id, 10); // Chuyển đổi thành số nguyên (integer)
            const parsedPostCategoryId = parseInt('1', 10);
            const formData = new FormData();
            formData.append('classroom_id', parsedClassroomId.toString());
            formData.append('content', plainTextContent);
            formData.append('post_category_id', parsedPostCategoryId.toString());
            selectedFile.forEach((files) => {
                formData.append(`files`, files);
            });
            axios
                .post(`${BASE_URL}/posts/create-post`, formData, config)
                .then((response) => {
                    console.log(response);
                    onFetchData();
                    Notification('success', 'Thông báo', 'Tạo thành công bảng tin');
                })
                .finally(() => {
                    setLoading(false);
                });
            setPercent(0);
            setProgressbar('none');
        }
    };
    const handleCancel = () => {
        setMessage('');
        setShowForm(false);
    };
    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleSubmitNotification = (e: { preventDefault: () => void }) => {
        // Xử lý dữ liệu đã nhập từ ReactQuill
        e.preventDefault();
        setShowForm(false);
        handleFetchUploadFile();
        setValue('');
        setSelectedFile([]);
        // Gửi dữ liệu lên server hoặc thực hiện các hành động khác
    };
    const [fileId, setFileId] = useState(0);
    const [idFile, setIdFile] = useState(0);
    const handleShowPopupDownload = (file_id: number, id: number) => {
        setProgressbar('block');
        setDownloadComplete(false);
        setModalDownloadFile(true);
        setFileId(file_id);
        setIdFile(id);
    };
    const handleFileUpload = (file: any) => {
        setSelectedFile((prevSelectedFiles) => [...prevSelectedFiles, file]);
    };
    const handleRemoveFile = (file: any) => {
        setSelectedFile((prevSelectedFile) => prevSelectedFile.filter((f) => f.uid !== file.uid));
    };
    const [modalDownloadFile, setModalDownloadFile] = useState(false);

    const handleVisibleDownloadFile = () => {
        setModalDownloadFile(false);
    };
    const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };
    const navigate = useNavigate();

    const handleClick = (item: any) => {
        if (item.post_category_id === 3 || item.post_category_id === 4) {
            navigate(`/giang-vien/class/${classroom_id}/${item.id}/detail-test`);
        } else if (item.post_category_id == 2) {
            navigate(`/giang-vien/class/${classroom_id}/${item.id}/document`);
        }
    };
    const handleChangeIcon = (post_category_id: any) => {
        if (post_category_id === 2) {
            return <MdOutlineBook className="bg-blue-400 text-white rounded-full  w-8 h-8" size={20} />;
        } else if (post_category_id === 3) {
            return <MdOutlineAssignment className="bg-blue-400 rounded-full text-white w-8 h-8" size={20} />;
        } else if (post_category_id === 4) {
            return <MdNoteAlt className="bg-blue-400 rounded-full text-white  w-8 h-8" size={20} />;
        } else if (post_category_id === 1) {
            return <MdAccountCircle className="bg-blue-400 rounded-full text-white  w-8 h-8" size={20} />;
        }
        return '';
    };
    const handleDetele = (id: any) => {
        console.log(id);
        const post_id = id;
        const config = HeaderToken.getTokenConfig();
        axios.delete(`${BASE_URL}/posts/${post_id}/delete-post`, config).then(() => {
            const updatePostList = postList.filter((item: any) => item.id !== id);
            // data = data.filter((item: any) => item.id !== id);
            setPostList(updatePostList);
            onFetchData();
            Notification('success', 'Thông báo', 'Xóa thành công bảng tin');
        });
    };
    const [showEdit, setShowEdit] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [itemEdit, setItemEdit] = useState<{ post_category_id?: number; files: Files[] } | null>(null);
    const [selectedItemEditNews, setSelectedItemEditNews] = useState<{
        id?: number;
        content: string;
        title: string;
    } | null>(null);
    const [file, setFile] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const handleEditNews = (item: {
        id?: number | undefined;
        post_category_id?: number | undefined;
        content: string;
        title: string;
        files: Files[];
    }) => {
        setShowEdit(true);
        setSelectedItemEditNews(item);
        setItemEdit(item);
    };
    const handleCancelEdit = () => {
        setShowEdit(false);
    };
    const handleContentEditNews = (e: { target: { value: any } }) => {
        setSelectedItemEditNews({
            ...selectedItemEditNews,
            content: e.target.value || null,
            title: e.target.value || null,
        });
    };
    const handleEdit = () => {
        //handleEditNews();
        // const result = postListEdit
        //     .filter((post) => post.id === id)
        //     .map((post) => ({ title: post.title, content: post.content }));
        // const edit = {
        //     title: result[0].title,
        //     content: result[0].content,
        // };
        // console.log(edit, id);

        // const edit = {
        //     title:
        // }
        const config = HeaderToken.getTokenConfig();
        if (selectedItemEditNews?.id && classroom_id) {
            const formData = new FormData();
            //formData.append('title', editTitle);
            formData.append('content', selectedItemEditNews.content);
            formData.append('post_id', selectedItemEditNews.id.toString());
            formData.append('classroom_id', classroom_id.toString());
            // formData.append('file', file);
            formData.append('list_files_remove', JSON.stringify(removeFile));
            selectedFile.forEach((item) => {
                formData.append('files', item);
            });

            // Gọi API edit với dữ liệu trong formData
            axios
                .put(`${SystemConst.DOMAIN}/posts/update-post`, formData, config)
                .then(() => {
                    Notification('success', 'Thông báo', 'Cập nhật thành công');
                    onFetchData();
                    setShowEdit(false);
                })
                .catch(() => {
                    Notification('error', 'Lỗi', 'Không thể cập nhật');
                });
        } else {
            Notification('error', 'Lỗi', 'Thiếu thông tin');
        }

        // Example:
        // axios
        //     .post('/api/edit', formData)
        //     .then((response) => {
        //         // Xử lý thành công
        //         console.log(response.data);
        //         // Đóng Modal và thực hiện các thao tác khác
        //         handleCancelEdit();
        //     })
        //     .catch((error) => {
        //         // Xử lý lỗi
        //         console.error(error);
        //     });
    };
    const [removeFile, setRemoveFile] = useState<number[]>([]);
    const handleRemoveFileInSnubmit = (idFile: number) => {
        setRemoveFile((prevRemoveFile) => [...prevRemoveFile, idFile]);
        if (itemEdit) {
            const newEdit = {
                ...itemEdit,
                files: itemEdit?.files.filter((file) => file.file_id !== idFile) ?? [],
            };
            setItemEdit(newEdit);
        }
    };
    return (
        <>
            {progressbar === 'block' && !downloadComplete && (
                <Progress
                    percent={percent}
                    style={{ display: progressbar }}
                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                    type="line"
                />
            )}

            <Spin spinning={loading}>
                <div className="grid gap-y-4">
                    <div>
                        {!showForm ? (
                            <div
                                onClick={handleOpenForm}
                                className="bg-slate-200 h-20 m-15 shadow-xl rounded-lg flex items-center"
                            >
                                <div className="w-14 flex justify-center">
                                    <img className="w-9 h-9" src={iconUser} alt="" />
                                </div>
                                <div className="font-medium hover:text-blue-400 cursor-pointer">
                                    Đây là thông báo nội dung nào đó cho lớp học của bạn
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmitNotification}
                                className="bg-slate-200 h-auto w-full m-15 shadow-lg  rounded-lg max-w-3xl p-2"
                            >
                                <div className="flex items-center justify-around py-4">
                                    <div className={`w-14 ${showForm ? 'hidden' : ''}`}>
                                        <img className="w-9 h-9" src={iconUser} alt="" />
                                    </div>
                                    <div className="w-full max-w-3xl overflow-auto px-4">
                                        <label htmlFor="Thông báo">Thông báo</label>
                                        <TextArea
                                            style={{ resize: 'none', height: '150px', padding: '10px' }}
                                            value={value}
                                            onChange={handleChangeTextArea}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="ml-4">
                                        <Upload
                                            multiple
                                            showUploadList={{ showRemoveIcon: true }}
                                            accept=".png,.jpeg,.jpg,.pdf,.docx,.doc,.pptx,.xlsx,.rar,.zip "
                                            beforeUpload={(file) => {
                                                handleFileUpload(file);
                                                return false;
                                            }}
                                            onRemove={handleRemoveFile}
                                        >
                                            <Button className="flex items-center gap-x-2">
                                                <MdOutlineFileUpload /> Upload
                                            </Button>
                                        </Upload>
                                    </div>
                                    <div className=" mr-4">
                                        <button
                                            disabled={!value}
                                            onClick={handleSubmitNotification}
                                            type="submit"
                                            className={
                                                !value
                                                    ? `bg-slate-400 transition-all duration-200 text-white font-medium py-2 px-4 rounded-md`
                                                    : `bg-blue-600 hover:bg-blue-800 transition-all duration-200 text-white font-medium py-2 px-4 rounded-md`
                                            }
                                        >
                                            Đăng
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="bg-gray-300 hover:bg-gray-400 transition-all duration-200 ml-2 px-4 py-2 rounded-md font-medium"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                    {postList.map((item: any) => (
                        <div
                            onClick={() => handleClick(item)}
                            className={`flex justify-between bg-slate-200 ${item.post_category_id === 1 ? ' ' : 'hover:shadow-lg'
                                } px-10 py-5 box-decoration-slice rounded-lg max-w-3xl cursor-pointer whitespace-pre-line`}
                        >
                            <div className="flex gap-y-4 flex-col justify-start">
                                <div className="flex flex-row items-center gap-x-2">
                                    <div className="bg-blue-400 text-white text-xl p-2 rounded-full">
                                        {handleChangeIcon(item.post_category_id)}
                                    </div>
                                    <div className="flex text-base font-medium">
                                        <div className="">
                                            {item.last_name} {item.first_name}{' '}
                                            {item.post_category_id === 4 ? `đã đăng kiểm tra ${item.title}` : ''}
                                            {item.post_category_id === 3 ? `đã đăng bài tập ${item.title}` : ''}
                                            {item.post_category_id === 2 ? `đã đăng tài liệu ${item.title}` : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <p className="break-words w-[35rem] text-start">
                                        {item.post_category_id === 1 ? item.content : ''}
                                    </p>
                                </div>
                                {item.files.length > 0 ? (
                                    <div className="grid grid-cols-2 ">
                                        {item.files.map((file: any) => (
                                            <button onClick={() => handleShowPopupDownload(file.file_id, item.id)}>
                                                <Tooltip title={file.file_name}>
                                                    <div className="p-1   ">
                                                        <div className="border-[1px] rounded-sm border-gray-400 p-2 flex items-center ">
                                                            {file.file_type.startsWith('image/') ? (
                                                                <div className="w-10 h-10">
                                                                    <img src={file.file_path} alt="Hình ảnh" loading='lazy'/>
                                                                </div>
                                                            ) : (
                                                                <div className="w-10 h-10">
                                                                    <MdOutlineFilePresent size={32} />
                                                                </div>
                                                            )}

                                                            <div className="text-ellipsis overflow-hidden ...  max-w-xs w-[15rem]">
                                                                {file.file_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div>
                                <button className="">
                                    <CustomButton
                                        post_category_id={item.post_category_id}
                                        item={item}
                                        onDelete={handleDetele}
                                        onEdit={() => handleEditNews(item)}
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Spin>
            {idFile ? (
                <Modal
                    visible={modalDownloadFile}
                    open={modalDownloadFile}
                    title="Thông báo"
                    onCancel={handleVisibleDownloadFile}
                    className="custom-modal-download-file"
                    footer={null}
                >
                    <div>
                        <p>Bạn có muốn tải file này ?</p>
                    </div>
                    <div className="flex justify-end h-full mt-20">
                        <Button type="primary" onClick={() => handleDownPost(idFile, fileId)} className="mr-5">
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
            {itemEdit ? (
                <Modal
                    title={
                        <>
                            <div className="bg-blue-300 font-medium text-base px-6 py-4 ">Sửa bảng tin</div>
                        </>
                    }
                    className="customModal"
                    footer={
                        <div className="text-end mr-5 mt-10">
                            <Button type="primary" onClick={handleEdit}>
                                Sửa
                            </Button>{' '}
                        </div>
                    }
                    open={showEdit}
                    onCancel={handleCancelEdit}
                >
                    <div className="flex flex-col gap-y-4  px-10 mt-10">
                        {itemEdit.post_category_id !== 1 && (
                            <div>
                                <label htmlFor="">Tiêu đề</label>
                                <Input
                                    value={selectedItemEditNews?.title}
                                    onChange={(e) => handleContentEditNews({ target: { value: e.target.value } })}
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="">Nội dung</label>
                            <Input
                                value={selectedItemEditNews?.content}
                                onChange={(e) => handleContentEditNews({ target: { value: e.target.value } })}
                            />
                        </div>
                        <div className=" overflow-auto max-h-40 mb-2">
                            {itemEdit?.files &&
                                itemEdit?.files.map((item: any) => (
                                    <div className="border-2 p-2 flex flex-row max-h-40  gap-y-3 items-center">
                                        <div>
                                            {['image/jpg', 'image/jpeg', 'image/png'].includes(item.file_type) ? (
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
                        <Upload
                            className="mt-5 max-h-60 overflow-auto"
                            listType="picture"
                            multiple
                            fileList={selectedFile}
                            beforeUpload={(file: any) => {
                                handleFileUpload(file);
                                return false; // Prevent file from being uploaded immediately
                            }}
                            onRemove={handleRemoveFile}
                        >
                            <Button>Upload File</Button>
                        </Upload>
                    </div>
                </Modal>
            ) : (
                ''
            )}
        </>
    );
};

export default AddCard;
var toolbarOption = [['bold', 'italic']];
const modules = {
    toolbar: toolbarOption,
};
// {/* <div className="grid gap-y-4">
// {isData.map((item) => (
//     <div>
//         <CardExerciseNews item={item}></CardExerciseNews>
//         {/* {item.files.map((list)=>(

//     ))} */}
//     </div>
// ))}
// </div> */}


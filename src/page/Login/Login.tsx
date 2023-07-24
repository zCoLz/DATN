import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import bgLogin from '../../img/backgoundhoctap.jpg';
import HomeScreen from '../Main/HomeScreen';
import logoTruong from '../../img/Logotruong.png';
import { useNavigate } from 'react-router-dom';
import systemConst from '../../common/consts/system_const';
import SystemConst from '../../common/consts/system_const';
import HomeScreenStudent from '../Main/HomeScreenStudent';
const Login: React.FC = () => {
    const BASE_URL = `${systemConst.DOMAIN}`;
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();
    const [isToken, setIsToken] = useState(Boolean(localStorage.getItem('token')));

    // Điều hướng trang đến giang viên và sinh viên và không thể back ra lại login trừ khi nhấn đăng xuất
    const handleRouteTeacher = () => {
        setTimeout(() => {
            navigate('/giang-vien', { replace: true });
        }, 0);
    };
    const handleRouteStudent = () => {
        setTimeout(() => {
            navigate('/sinh-vien', { replace: true });
        }, 0);
    };
    const handleRouteAdmin = () => {
        setTimeout(() => {
            navigate('/admin', { replace: true });
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userEmail = email.current?.value;
        const userPassword = password.current?.value;

        if (!userEmail || !userPassword) {
            return setMessage('Vui lòng nhập đầy đủ thông tin tài khoản và mật khẩu.');
        }
        try {
            axios
                .post(`${BASE_URL}/login`, {
                    email: userEmail,
                    password: userPassword,
                })
                .then((response) => {
                    if (response.status === 200) {
                        const { token, role, account_id, first_name, last_name } = response.data;
                        localStorage.setItem('token', token);
                        localStorage.setItem('role', role);
                        localStorage.setItem(
                            'user',
                            JSON.stringify({
                                account_id: account_id,
                                first_name: first_name,
                                last_name: last_name,
                            }),
                        );

                        setIsToken(token);

                        if (role === 1) {
                            setMessage('Đăng nhập thành công');
                            navigate('/giang-vien');
                        } else if (role === 0) {
                            setMessage('Đăng nhập thành công');
                            navigate('/sinh-vien');
                        } else if (role === 2) {
                            setMessage('Đăng nhập thành công');
                            navigate('/admin');
                        } else {
                            setMessage('Không hợp lệ');
                            console.log('Invalid');
                        }
                        return;
                    } else {
                        alert('Đã xảy ra lỗi');
                    }
                })
                .catch((error) => {
                    if (axios.isAxiosError(error)) {
                        if (
                            error.response?.status === systemConst.STATUS_CODE.UNAUTHORIZED_REQUEST &&
                            error.response.data.error_message === 'No exist email'
                        ) {
                            setMessage('Tài khoản không tồn tại');
                        } else if (
                            error.response?.status === systemConst.STATUS_CODE.UNAUTHORIZED_REQUEST &&
                            error.response.data.error_message === 'Invalid password'
                        ) {
                            setMessage('Sai mật khẩu');
                        } else if (error.response?.status === systemConst.STATUS_CODE.BAD_REQUEST) {
                            setMessage('Cần Nhập tài khoản và mật khẩu');
                        } else {
                            setMessage('Không thể kết nối máy chủ');
                        }
                    } else {
                        console.error(error);
                    }
                });
        } catch (error) {}
    };

   if (localStorage.getItem('token')) {
    if (localStorage.getItem('role') == '1') {
        handleRouteTeacher();
    } else if (localStorage.getItem('role') == '0') {
        handleRouteStudent();
    } else if (localStorage.getItem('role') == '2') {
        handleRouteAdmin();
    }
   }

    return (
        <>
            {!isToken && (
                <div className="bg-slate-100 h-screen">
                    <div className="bg-blue-300 h-16 items-center fixed w-full">
                        <div className="w-48 mx-2 my-2">
                            <img src={logoTruong} alt="" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col max-w-7xl xl:px-5 lg:flex-row">
                            <div className="flex flex-col items-center w-full lg:pt-1 2xl:pt-2 lg:flex-row">
                                <div className="w-full bg-cover max-w-md lg:max-w-6xl lg:px-2 lg:w-8/12 2xl:w-8/12">
                                    <div className="flex flex-col items-center justify-center w-full h-full relative lg:pr-5">
                                        <img className="rounded-xl" src={bgLogin} alt="" />
                                    </div>
                                </div>
                                <div className="w-full relative z-10 max-w-3xl lg:pr-1 lg:mt-0 lg:w-4/12 2xl:w-4/12 lg:pt-2">
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex flex-col items-start justify-start py-10 px-10 bg-white shadow-2xl rounded-xl relative z-10">
                                            <p className="w-full text-4xl font-medium text-center leading-snug font-sans">
                                                Đăng nhập
                                            </p>
                                            <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                                <div className="relative">
                                                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                                        Email
                                                    </p>
                                                    <input
                                                        ref={email}
                                                        placeholder="MSSV@caothang.edu.vn"
                                                        type="text"
                                                        className="border placeholder-gray-400 focus:outline-none focus:border-blue-600 w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                                        Password
                                                    </p>
                                                    <input
                                                        ref={password}
                                                        placeholder="Password"
                                                        type="password"
                                                        className="border placeholder-gray-400 focus:outline-none focus:border-blue-600 w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <button className="w-full inline-block pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-center text-white bg-indigo-500 rounded-lg transition duration-200 hover:bg-indigo-600 ease">
                                                        Đăng nhập
                                                    </button>
                                                </div>
                                                {message && <div className="text-red-500">{message}</div>}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;

// const Loading: React.FC<{ success: boolean; onClose: () => void }> = ({ success, onClose }) => {
//     const [showSuccess, setShowSuccess] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowSuccess(true);
//         }, 5000);
//     }, []);

//     const handleOverlayClick = () => {
//         onClose();
//     };

//     if (showSuccess) {
//         return (
//             <div
//                 className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
//                 onClick={handleOverlayClick}
//             >
//                 <div className="bg-white p-10  rounded-lg">
//                     <div className="flex items-center mb-4">
//                         {success ? (
//                             <svg
//                                 className="h-5 w-5 mr-3 text-green-500"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     d="M5 13l4 4L19 7"
//                                 />
//                             </svg>
//                         ) : (
//                             <svg
//                                 className="h-5 w-5 mr-3 text-red-500"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     d="M6 18L18 6M6 6l12 12"
//                                 />
//                             </svg>
//                         )}
//                         <span className="font-medium">{success ? 'Thành công!' : 'Thất bại!'}</span>
//                     </div>
//                     {success ? <p>Đăng nhập thành công.</p> : <p>Đăng nhập thất bại.</p>}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
//             <div className="bg-white p-10 rounded-lg">
//                 <div className="flex items-center mb-4">
//                     <svg
//                         className="animate-spin h-5 w-5 mr-3 text-blue-500"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                     >
//                         <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                         ></circle>
//                         <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                     </svg>
//                     <span className="font-medium">Đang xử lý...</span>
//                 </div>
//                 <p>Vui lòng đợi trong giây lát.</p>
//             </div>
//         </div>
//     );
// };

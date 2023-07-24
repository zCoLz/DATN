import React, { useEffect, useState } from 'react';

const Loading: React.FC<{ success: boolean; onClose: () => void }> = ({ success, onClose }) => {
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSuccess(true);
        }, 5000);
    }, []);

    const handleOverlayClick = () => {
        onClose();
    };

    if (showSuccess) {
        return (
            <div
                className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                onClick={handleOverlayClick}
            >
                <div className="bg-white p-10  rounded-lg">
                    <div className="flex items-center mb-4">
                        {success ? (
                            <svg
                                className="h-5 w-5 mr-3 text-green-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-5 w-5 mr-3 text-red-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        )}
                        <span className="font-medium">{success ? 'Thành công!' : 'Thất bại!'}</span>
                    </div>
                    {success ? <p>Đăng nhập thành công.</p> : <p>Đăng nhập thất bại.</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-10 rounded-lg">
                <div className="flex items-center mb-4">
                    <svg
                        className="animate-spin h-5 w-5 mr-3 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span className="font-medium">Đang xử lý...</span>
                </div>
                <p>Vui lòng đợi trong giây lát.</p>
            </div>
        </div>
    );
};

export default Loading;

import React, { useState } from 'react';

function CreatePost() {
    const [showForm, setShowForm] = useState(false);

    const handleButtonClick = () => {
        setShowForm(true);
    };
    const handleCancelForm = () => {
        setShowForm(false);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Thực hiện lưu bài đăng tại đây
        setShowForm(false);
    };

    return (
        <div className="flex flex-col ">
            <div className={`${showForm ? 'hidden' : ''} flex justify-center`}>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32 flex justify-center"
                    onClick={handleButtonClick}
                >
                    Create Post
                </button>
            </div>
            {showForm && (
                <form className="mt-4 w-[40rem]" onSubmit={handleFormSubmit}>
                    <div className="mb-4 p-2">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="postContent">
                            Post content:
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="postContent"
                            name="postContent"
                        />
                    </div>
                    <div className="mb-4 p-2">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="postImage">
                            Post image:
                        </label>
                        <input type="file" id="postImage" name="postImage" />
                    </div>
                    <div className="flex justify-center py-2">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            type="submit"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelForm}
                            className=" bg-gray-300 ml-2 px-4 py-2 rounded"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default CreatePost;

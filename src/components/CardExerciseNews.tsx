import { Button } from 'antd';
import React from 'react';
import { MdMoreVert, MdOutlineAssignment } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface CardExerciseProps {
    item: {
        title: string;
        datetime: string;
        content: string;
        first_name: string;
        last_name: string;
        file_name: string;
    };
}

const CardExerciseNews: React.FC<CardExerciseProps> = ({ item }) => {
    const { title, datetime, content, first_name, last_name } = item;
    return (
        <>
            <div className="">
                <div className="flex justify-between items-center bg-slate-200 hover:shadow-lg px-10 py-5 box-decoration-slice rounded-lg max-w-3xl cursor-pointer">
                    <div className="flex gap-y-4 flex-col justify-start">
                        <div className="flex flex-row items-center gap-x-2">
                            <div className="bg-blue-400 text-white text-xl p-2 rounded-full">
                                <MdOutlineAssignment />
                            </div>
                            <div className="text-base font-medium">
                                {last_name} {first_name}
                            </div>
                        </div>
                        <div>
                            <div>{content}</div>
                        </div>
                    </div>
                    <div>
                        <button className="m-auto p-1 hover:bg-slate-300 focus:bg-slate-400  rounded-full duration-300">
                            <MdMoreVert size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardExerciseNews;

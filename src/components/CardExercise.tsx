import dayjs from 'dayjs';
import React from 'react';
import { MdBook, MdMoreVert, MdNoteAlt, MdOutlineAssignment, MdOutlineBook } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';

interface CardExerciseProps {
    item: {
        icon: React.ReactElement;
        title: string;
        create_date: string;
        post_category_id: number;
    };
    onClick?: () => void;
}
const handleChange = (item: any) => {
    if (item.post_category_id === 2) {
        return <MdOutlineBook />;
    } else if (item.post_category_id === 3) {
        return <MdOutlineAssignment />;
    } else if (item.post_category_id === 4) {
        return <MdNoteAlt />;
    }
    return '';
};
const CardExercise: React.FC<CardExerciseProps> = ({ item, onClick }) => {
    const { title, create_date, post_category_id } = item;
    const formatDate = dayjs(create_date).format('DD/MM/YYYY HH:mm');
    return (
        <>
            <div className="">
                <div
                    className="flex justify-between bg-slate-200 hover:shadow-lg px-10 py-5 box-decoration-slice rounded-lg max-w-3xl cursor-pointer"
                    onClick={onClick}
                >
                    <div className="flex gap-x-3 items-center">
                        <div className="bg-blue-400 text-white text-xl p-2 rounded-full">{handleChange(item)}</div>
                        <div>{title}</div>
                    </div>
                    <div>{formatDate}</div>
                </div>
                <hr />
            </div>
        </>
    );
};

export default CardExercise;

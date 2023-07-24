import React from 'react';
import CreatePost from '../CreatePost';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CardExercise from '../../components/CardExercise';

const ClassroomExercisesStudent = ({ data }: { data: any }) => {
    const ExerciseList = [
        {
            Exercise: 'Bài 1',
            PostDate: 'Đã đăng vào 19 tháng 9 năm 2022',
        },
        {
            Exercise: 'Bài 2',
            PostDate: 'Đã đăng vào 20 tháng 9 năm 2022',
        },
        {
            Exercise: 'Bài 3',
            PostDate: 'Đã đăng vào 21 tháng 9 năm 2022',
        },

        {
            Exercise: 'Đề cương',
            PostDate: 'Đã đăng vào 19 tháng 9 năm 2022',
        },
        {
            Exercise: 'Bài 1',
            PostDate: 'Đã đăng vào 19 tháng 9 năm 2022',
        },
    ];
    const dataList = data.list_post;
    const navigate = useNavigate();
    const { classroom_id } = useParams();
    const handleClick = (item: any) => {
        if (item.post_category_id !== 1) {
            navigate(`/sinh-vien/class/${classroom_id}/${item.id}/detail-student`);
        }
    };
    return (
        <div className="w-[45rem]">
            <div className="mt-6 ">
                <div className="grid gap-y-4">
                    {dataList
                        .filter((item: any) => item.post_category_id !== 1)
                        .map((item: any) => (
                            <CardExercise onClick={() => handleClick(item)} item={item} />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ClassroomExercisesStudent;

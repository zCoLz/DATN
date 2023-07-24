import axios from 'axios';
import React, { useEffect, useState } from 'react';
import HeaderToken from '../../common/utils/headerToken';
import SystemConst from '../../common/consts/system_const';
import { useParams } from 'react-router-dom';

interface Student {
    id: number;
    submission: number;
    total_score: number;
    first_name: string;
    last_name: string;
}
interface Data {
    id: number;
    delivered: number;
    student_exams: Student[];
    submitted: number;
    title: string;
}
const BASE_URL = `${SystemConst.DOMAIN}`;
const DetailHome = ({ params }: { params: any }) => {
    const { post_id } = useParams();
    const [isData, setIsData] = useState<Data>();
    useEffect(() => {
        setIsData(params);
    }, [params]);
    return (
        <>
            <div className="mb-10">
                <div className="text-xl font-semibold">{isData?.title}</div>
            </div>
            <div className="flex ml-10">
                <div className="pr-4 text-center">
                    <div className="text-5xl">{isData?.delivered}</div>
                    <div className="text-lg font-medium opacity-50">Đã giao</div>
                </div>
                <div className="border-l-2 border-slate-500"></div>
                <div className="pl-4 text-center">
                    <div className="text-5xl">{isData?.submitted}</div>
                    <div className="text-lg font-medium opacity-50">Đã nộp</div>
                </div>
            </div>
        </>
    );
};

export default DetailHome;

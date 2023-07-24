import React, { useEffect, useState } from 'react';
import HeaderToken from '../../common/utils/headerToken';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import { Button, Checkbox, Input, Layout, Radio } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import './style.scss';
import { useNavigate, useParams } from 'react-router-dom';
const { TextArea } = Input;

interface Question {
    examId: number;
    questionIndex: number;
    answerId: undefined;
    id: number;
    content: string;
    answers: Answer[];
    question_category_id: number;
    exam_id: number;
    student_answer_options: StudentExam[];
}
interface StudentExam {
    id: number;
    answer_id: number;
    essay_answer: string;
    student_exam_id: number;
}
interface Answer {
    id: number;
    answer: string;
    correct_answer: boolean;
}
interface Data {
    list_questions_answers: Question[];
    student_exam_id: number;
    submission: number;
}
interface EssayAnswer {
    [key: string]: any;
}
const { Header, Footer, Content } = Layout;
const BASE_URL = `${SystemConst.DOMAIN}`;
const JoinMark = () => {
    const [question, setQuestion] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Question[]>([]);
    const [isData, setIsData] = useState<Data>();
    const [isValueText, setIsValueText] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [studentExamId, setStudentExamId] = useState(0);
    const [submission, setSubmission] = useState(0);
    const [essayAnswers, setEssayAnswers] = useState<EssayAnswer>({});
    const [checkTextValue, setCheckTextValue] = useState<EssayAnswer>({});
    useEffect(() => {
        handleFetchData();
    }, []);
    const { post_id } = useParams();
    const handleFetchData = () => {
        const config = HeaderToken.getTokenConfig();
        axios.get(`${BASE_URL}/questions-and-answers/${post_id}/get-questions-and-answers`, config).then((response) => {
            const dataFetch = response.data.response_data;
            setQuestion(dataFetch.list_questions_answers);
            //sửa lại json
            setIsData(dataFetch);
            // setStudentExamId(dataFetch.student_exam_id);
            // setSubmission(dataFetch.submission);
        });
    };

    const onChange = (checkedValues: CheckboxValueType[]) => {
        console.log('checked = ', checkedValues);
    };
    const handleUpdateAnswers = (
        questionId: number,
        answerIds: number[],
        studentExamId: number,
        essayAnswer: string | null,
    ) => {
        const config = HeaderToken.getTokenConfig();
        const data = {
            question_id: questionId,
            answer_ids: answerIds,
            essay_answer: essayAnswer,
            student_exam_id: studentExamId,
        };
        axios
            .patch(`${BASE_URL}/students/update-answer`, data, config)
            .then((response) => {
                console.log(response, 'minh');
                setSend(false);
            })
            .catch((error) => {
                console.log(error);
                //hiện form lỗi ở đây
            });
    };
    //const handleAnswerChange = (examId: number, questionIndex: number, answerId: any) => {};
    let questionRadio: number[];
    const handleAnswerChange = (questionId: number, answerIds: any, StudentExamId: number) => {
        questionRadio = [];
        if (questionRadio) {
            // Cập nhật danh sách đáp án cho câu hỏi đã tồn tại trong danh sách selectedAnswers
            questionRadio = [answerIds];
        } else {
            const newQuestion = [answerIds];
            questionRadio = newQuestion;
        }
        handleUpdateAnswers(questionId, questionRadio, StudentExamId, null);
    };
    const selectAnswers: Record<number, number[]> = {};
    const checkStudentExam: Record<number, boolean> = {};
    const handleAnswerCheckBox = (questionId: number, answerIds: any, checked: boolean, studentExamId: number) => {
        if (!checkStudentExam[questionId]) {
            checkStudentExam[questionId] = true;
            const questionItem = question.find(
                (item) => item.id === questionId && item.student_answer_options.length > 0,
            );
            if (questionItem) {
                selectAnswers[questionId] = questionItem.student_answer_options
                    .filter((student_exam) => student_exam.student_exam_id === studentExamId)
                    .map((student_exam) => student_exam.answer_id);
            }
        }
        if (!selectAnswers[questionId]) {
            // Nếu chưa có mục cho câu hỏi này, tạo một mục mới và thêm câu trả lời đã chọn
            selectAnswers[questionId] = [answerIds];
        } else {
            if (checked) {
                // Nếu được chọn, thêm câu trả lời vào danh sách
                selectAnswers[questionId].push(answerIds);
            } else {
                // Nếu không được chọn, loại bỏ câu trả lời khỏi danh sách
                selectAnswers[questionId] = selectAnswers[questionId].filter((id) => id !== answerIds);
            }
        }
        handleUpdateAnswers(questionId, selectAnswers[questionId], studentExamId, null);
    };
    const [send, setSend] = useState<boolean>(false);
    let timer: any;
    const { classroom_id } = useParams();
    const navigate = useNavigate();
    const handleSubmit = () => {
        // Gửi dữ liệu đã được lưu trong selectedAnswers về server
        // Sử dụng axios hoặc phương thức gửi dữ liệu tương tự
        setSend(true);
        clearTimeout(timer);
        if (isData?.student_exam_id && isData.submission === 0) {
            timer = setTimeout(() => {
                const config = HeaderToken.getTokenConfig();
                const data = {
                    student_exam_id: isData.student_exam_id,
                    post_id: post_id,
                };
                axios
                    .post(`${BASE_URL}/students/submission`, data, config)
                    .then((response) => {
                        setSend(false);
                        console.log(response);
                    })
                    .catch((error) => {
                        setSend(false);
                        console.log(error);
                    });
            }, 1500);
        }
        //handleFetchData();
        navigate(`/sinh-vien/class/${classroom_id}/${post_id}/detail-student`, { replace: true });
    };
    //console.log(classroom_id);

    const handleExitHome = () => {
        window.location.replace('/');
    };
    const [shouldCallAPI, setShouldCallAPI] = useState(false);
    const [questionId, setQuestionId] = useState<number | null>(null);
    useEffect(() => {
        let timer: any;
        if (shouldCallAPI) {
            timer = setTimeout(() => {
                if (isData?.submission === 0 && isData.student_exam_id && questionId) {
                    handleUpdateAnswers(questionId, [], isData.student_exam_id, essayAnswers[questionId]);
                }
            }, 500);
        }

        return () => clearTimeout(timer);
    }, [shouldCallAPI, essayAnswers, send]);

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, questionId: number) => {
        setSend(true);
        const { value } = e.target;
        setQuestionId(questionId);
        setEssayAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: value,
        }));
        setShouldCallAPI(true);
    };

    //console.log(isData?.list_questions_answers);

    return (
        <>
            <div>
                <div>
                    <div className="h-screen grid grid-cols-1 grid-rows-[auto,1fr,auto] ">
                        <Header className="bg-blue-400 text-xl grid items-center">Bài Kiểm Tra</Header>
                        <div className="p-5 grid justify-center ">
                            <div className="justify-center flex">
                                <div>{send ? 'Đang lưu ...' : ''}</div>
                                <div className="w-[50rem]">
                                    {isData?.list_questions_answers.map((asw, index) => (
                                        <div key={asw.id} className="mb-4 bg-gray-300 rounded-md px-4 py-4 ">
                                            <div className="text-xl font-bold mb-2">
                                                Câu {index + 1}. {asw.content}
                                            </div>
                                            <div className="space-y-2">
                                                {asw.answers.map((answer) => (
                                                    <label
                                                        className={`flex items-center space-x-2 ${
                                                            asw.question_category_id === 1
                                                                ? 'radio-answer'
                                                                : 'checkbox-answer'
                                                        } ${
                                                            answer.correct_answer &&
                                                            !isData.student_exam_id &&
                                                            isData.submission !== 0 &&
                                                            'bg-green-300 rounded-md'
                                                        }`}
                                                        key={answer.id}
                                                    >
                                                        {asw.question_category_id === 1 && (
                                                            <input
                                                                disabled={isData.submission ? true : false}
                                                                defaultChecked={asw.student_answer_options
                                                                    .map((e) => parseInt(e.answer_id?.toString()))
                                                                    .filter((id) => id !== null)
                                                                    .includes(answer.id)}
                                                                type="radio"
                                                                name={`asw${index}`}
                                                                onChange={() => {
                                                                    if (
                                                                        isData.student_exam_id &&
                                                                        isData.submission === 0
                                                                    ) {
                                                                        handleAnswerChange(
                                                                            asw.id,
                                                                            answer.id,
                                                                            isData.student_exam_id,
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        {asw.question_category_id === 2 && (
                                                            <input
                                                                type="checkbox"
                                                                className="focus:border-blue-300"
                                                                disabled={isData.submission ? true : false}
                                                                defaultChecked={asw.student_answer_options
                                                                    .map((e) => parseInt(e.answer_id?.toString()))
                                                                    .filter((id) => id !== null)
                                                                    .includes(answer.id)}
                                                                value={answer.id}
                                                                onChange={(e) => {
                                                                    if (
                                                                        isData.student_exam_id &&
                                                                        isData.submission === 0
                                                                    ) {
                                                                        handleAnswerCheckBox(
                                                                            asw.id,
                                                                            answer.id,
                                                                            e.target.checked,
                                                                            isData.student_exam_id,
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        )}

                                                        <span className="text-lg font-medium">{answer.answer}</span>
                                                    </label>
                                                ))}

                                                {asw.question_category_id === 3 && (
                                                    <TextArea
                                                        className="text-lg"
                                                        style={{ height: '20rem', overflow: 'hidden', resize: 'none' }}
                                                        maxLength={2000}
                                                        showCount
                                                        value={
                                                            !checkTextValue[asw.id]
                                                                ? asw.student_answer_options[0]?.essay_answer?.toString()
                                                                : essayAnswers[asw.id]?.toString()
                                                        }
                                                        placeholder="Nhập câu trả lời"
                                                        onChange={(e) => {
                                                            setCheckTextValue((prevAnswers) => ({
                                                                ...prevAnswers,
                                                                [asw.id]: true,
                                                            }));
                                                            handleTextAreaChange(e, asw.id);
                                                        }}
                                                    ></TextArea>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {isData?.submission === 0 && (
                                <div className=" gap-x-3 flex flex-row justify-end">
                                    <Button onClick={handleSubmit} disabled={send} className="" type="primary">
                                        Gửi
                                    </Button>
                                    <Button onClick={handleExitHome} type="primary" danger>
                                        Hủy
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JoinMark;

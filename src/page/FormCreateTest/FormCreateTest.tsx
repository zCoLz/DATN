import { Input } from 'antd';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './scss/style.scss';
interface Option {
    id: number;
    value: string;
    isCorrect: boolean;
    answer: string;
}

interface Question {
    id: number;
    title: string;
    options: Option[];
    inputType: 'checkbox' | 'radio' | 'text'; // Added 'text' as an option
}

const FormCreateTest: React.FC = (props) => {
    const [questions, setQuestions] = useState<Question[]>([{ id: 1, title: '', options: [], inputType: 'checkbox' }]);
    const [questionPoints, setQuestionPoints] = useState<{ [key: number]: number }>({});
    const [point, setPoint] = useState<number>(0);
    const handleAddQuestion = () => {
        setQuestions((prevQuestions) => [
            ...prevQuestions,
            {
                id: questions.length + 1,
                title: '',
                options: [],
                inputType: 'checkbox',
            },
        ]);
    };

    const handleQuestionChange = (questionId: number, title: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) => (question.id === questionId ? { ...question, title } : question)),
        );
    };

    const handleOptionChange = (questionId: number, optionId: number, value: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          options: question.options.map((option) =>
                              option.id === optionId ? { ...option, value } : option,
                          ),
                      }
                    : question,
            ),
        );
    };

    const handleCheckboxChange = (questionId: number, optionId: number, checked: boolean) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          options: question.options.map((option) =>
                              option.id === optionId ? { ...option, isCorrect: checked } : option,
                          ),
                      }
                    : question,
            ),
        );
    };
    const handleRadioChange = (questionId: number, optionId: number, checked: boolean) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          options: question.options.map((option) =>
                              option.id === optionId
                                  ? { ...option, isCorrect: checked }
                                  : { ...option, isCorrect: false },
                          ),
                      }
                    : question,
            ),
        );
    };
    const handleRemoveOption = (questionId: number, optionId: number) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          options: question.options.filter((option) => option.id !== optionId),
                      }
                    : question,
            ),
        );
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const questionsWithoutId = questions.map((question) => {
            return {
                id: question.id,
                title: question.title,
                options: question.options,
                inputType: question.inputType,
                point: questionPoints[question.id],
            };
        });
        console.log(questionsWithoutId);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>, questionId: number) => {
        const { value } = e.target;
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                          ...question,
                          inputType: value as 'checkbox' | 'radio' | 'text', // Added 'text' as an option
                          options: question.options.map((option) =>
                              option.isCorrect ? { ...option, isCorrect: false } : option,
                          ),
                      }
                    : question,
            ),
        );
    };

    const handleAddOption = (questionId: number) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId && question.inputType !== 'text'
                    ? {
                          ...question,
                          options: [
                              ...question.options,
                              {
                                  id: question.options.length + 1,
                                  value: '',
                                  isCorrect: false,
                                  answer: '', // New property for the answer value
                              },
                          ],
                      }
                    : question,
            ),
        );
    };

    const handleRemoveQuestion = (questionId: number) => {
        setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== questionId));
    };
    const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPoint(Number(e.target.value));
    };
    const handleQuestionPointChange = (questionId: number, point: number) => {
        setQuestionPoints((prevQuestionPoints) => ({
            ...prevQuestionPoints,
            [questionId]: point,
        }));
    };
    return (
        <>
            <div className="container mx-auto flex justify-center overflow-y-auto">
                <form
                    onSubmit={handleFormSubmit}
                    className=" px-4 py-2 w-[60rem] h-[40rem] max-h-full rounded-md overflow-y-auto "
                >
                    {questions.map((question) => (
                        <div key={question.id} className="mb-5 bg-white p-4 rounded-lg shadow-lg">
                            <div className="mb-2 flex gap-x-2 items-center">
                                <span className="font-semibold">Điểm câu hỏi</span>
                                <span className="w-20">
                                    <Input
                                        type="number"
                                        placeholder="Điểm"
                                        min={0}
                                        max={100}
                                        value={questionPoints[question.id]?.toString() || ''}
                                        onChange={(e) => handleQuestionPointChange(question.id, Number(e.target.value))}
                                    />
                                </span>
                            </div>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={question.title}
                                    onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                                    placeholder="Nhập câu hỏi"
                                    className="border border-gray-300 rounded px-4 py-2 w-full mb-2 "
                                    required
                                />
                                <div>
                                    <select
                                        id={`inputType_${question.id}`}
                                        value={question.inputType}
                                        onChange={(e) => handleInputChange(e, question.id)}
                                        className="ml-2 px-2 py-2 w-32 rounded-md border-2 focus:border-blue-300"
                                    >
                                        <option value="checkbox">Hộp kiểm</option>
                                        <option value="radio">Trắc Nghiệm</option>
                                        <option value="text">Tự Luận</option> {/* Added 'text' option */}
                                    </select>
                                </div>
                            </div>
                            {question.options.map((option) => (
                                <div key={option.id} className="flex items-center mb-2 justify-between">
                                    <div>
                                        {question.inputType === 'checkbox' || question.inputType === 'radio' ? (
                                            <input
                                                type={question.inputType}
                                                id={`option_${option.id}`}
                                                name={`question_${question.id}`}
                                                value={option.id}
                                                checked={option.isCorrect}
                                                onChange={(e) =>
                                                    question.inputType === 'checkbox'
                                                        ? handleCheckboxChange(question.id, option.id, e.target.checked)
                                                        : handleRadioChange(question.id, option.id, e.target.checked)
                                                }
                                                className="mr-2 focus:border-blue-300"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={option.answer}
                                                onChange={(e) =>
                                                    handleOptionChange(question.id, option.id, e.target.value)
                                                }
                                                placeholder="Nhập đáp án"
                                                className="border border-gray-300 rounded px-4 py-2 w-72 focus:border-blue-300"
                                                required
                                            />
                                        )}

                                        <input
                                            type="text"
                                            value={option.value}
                                            onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                                            placeholder="Nhập đáp án"
                                            className="border border-gray-300 rounded px-4 py-2 w-72 focus:border-blue-300"
                                            required
                                        />
                                    </div>
                                    {option.isCorrect ? <span className="ml-2 text-green-500">✔</span> : null}
                                    <button
                                        type="button"
                                        className="ml-2 text-red-600 "
                                        onClick={() => handleRemoveOption(question.id, option.id)}
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}

                            <div className="flex justify-between">
                                {question.inputType !== 'text' && (
                                    <button
                                        type="button"
                                        onClick={() => handleAddOption(question.id)}
                                        className="bg-blue-500 text-white py-2 px-2 rounded mb-2 mt-2"
                                    >
                                        Thêm đáp án
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveQuestion(question.id)}
                                    className="bg-red-500 text-white py-2 px-4 rounded mb-2 mt-2"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleAddQuestion}
                            className="bg-green-500 text-white py-2 px-4 rounded mb-4"
                        >
                            Thêm câu hỏi
                        </button>

                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded h-10">
                            Gửi
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
export default FormCreateTest;

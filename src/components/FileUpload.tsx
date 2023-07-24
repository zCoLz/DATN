import React, { useState } from 'react';
import { AiOutlineFilePdf, AiOutlineFileWord, AiOutlineFileImage } from 'react-icons/ai';
import { BsFileEarmarkZip, BsFileEarmarkRichtext, BsFileEarmarkSpreadsheet } from 'react-icons/bs';
import { MdOutlineFileUpload } from 'react-icons/md';
import { FaFilePowerpoint } from 'react-icons/fa';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
    const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
    const [selectedFile2, setSelectedFile2] = useState<File | null>(null);

    const handleFileChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile1(file);
            onFileSelect(file);
        }
    };

    // const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         setSelectedFile2(file);
    //         onFileSelect(file);
    //     }
    // };

    const getFileExtension = (fileName: string): string => {
        return fileName.split('.').pop()?.toLowerCase() || '';
    };

    const getFileIcon = (extension: string): React.ReactNode => {
        switch (extension) {
            case 'pdf':
                return <AiOutlineFilePdf size={28} />;
            case 'doc':
            case 'docx':
                return <AiOutlineFileWord size={28} />;
            case 'jpg':
            case 'png':
                return <AiOutlineFileImage size={28} />;
            case 'rar':
            case 'zip':
                return <BsFileEarmarkZip size={28} />;
            case 'txt':
                return <BsFileEarmarkRichtext size={28} />;
            case 'csv':
            case 'xls':
            case 'xlsx':
                return <BsFileEarmarkSpreadsheet size={28} />;
            case 'ppt':
            case 'pptx':
                return <FaFilePowerpoint size={28} />;
            default:
                return <MdOutlineFileUpload size={28} />;
        }
    };

    return (
        <div>
            <div>
                <label htmlFor="fileInput1" className="flex items-center cursor-pointer">
                    <input
                        type="file"
                        id="fileInput1"
                        name="file"
                        onChange={handleFileChange1}
                        className="sr-only"
                    />
                    <span className="">
                        {selectedFile1 ? (
                            getFileIcon(getFileExtension(selectedFile1.name))
                        ) : (
                            <MdOutlineFileUpload size={28} />
                        )}
                    </span>
                    {selectedFile1 ? selectedFile1.name : ''}
                </label>
            </div>

            {/* <div>
                <label htmlFor="fileInput2" className="flex items-center cursor-pointer">
                    <input
                        type="file"
                        id="fileInput2"
                        name="file"
                        onChange={handleFileChange2}
                        className="sr-only"
                    />
                    <span className="">
                        {selectedFile2 ? (
                            getFileIcon(getFileExtension(selectedFile2.name))
                        ) : (
                            <MdOutlineFileUpload size={28} />
                        )}
                    </span>
                    {selectedFile2 ? selectedFile2.name : ''}
                </label>
            </div> */}
        </div>
    );
};

export default FileUpload;

"use client"
import { useState, ChangeEvent } from "react";


const MultipleFileUpload: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.files){
            const selectedFiles = Array.from(event.target.files);
            setFiles(selectedFiles);

            const previews = selectedFiles.map((file) => URL.createObjectURL(file));
            setFilePreviews(previews);
        }
    };

    const handleUpload = async () => {
        alert("Files uploaded!")
        //Add API Call to store images in S3 bucket.
    }

    return (
        <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-md font-semibold mb-4"> Upload files</h2>
            <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="block w-full my-4 py-4 px-2 text-sm border border-gray-300 rounded"
                />
            <button 
                onClick={handleUpload}
                className="mt-4 p-4 bg-blue-600 text-white rounded">Upload</button>

        </div>
    );
}

export default MultipleFileUpload;
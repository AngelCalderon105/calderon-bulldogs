"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useState, ChangeEvent } from "react";
import { api } from "~/trpc/react";
import "@splidejs/splide/dist/css/splide.min.css";

const MultipleFileUpload: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const presignedUrlMutation = api.s3.getPresignedUrl.useMutation();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            setFiles(selectedFiles);

            const previews = selectedFiles.map((file) => URL.createObjectURL(file));
            setFilePreviews(previews);
        }
    };

    const handleUpload = async () => {
        setUploading(true);
        try {
            for (const file of files) {
                const { presignedUrl } = await presignedUrlMutation.mutateAsync({
                    fileName: file.name,
                    fileType: file.type,
                });
                await fetch(presignedUrl, {
                    method: "PUT",
                    body: file,
                });
            }
            alert("Files uploaded successfully!");
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("Failed to upload files.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-md font-semibold mb-4">Upload files</h2>
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full my-4 py-4 px-2 text-sm border border-gray-300 rounded"
            />
            <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 p-4 bg-blue-600 text-white rounded"
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>

            {filePreviews.length > 0 && (
                <div className="mt-4 ">
                    <h3 className="font-medium mb-2">Selected files:</h3>
                    <Splide
                        options={{
                            perPage: 3,
                            gap: "2rem",
                            pagination: false,
                            arrows: true,
                            drag: "free",
                        }}
                        className="splide"
                    >
                        {filePreviews.map((preview, index) => (
                            <SplideSlide key={index}>
                                <img
                                    src={preview}
                                    alt={`File preview ${index + 1}`}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            </SplideSlide>
                        ))}
                    </Splide>
                </div>
            )}
        </div>
    );
};

export default MultipleFileUpload;

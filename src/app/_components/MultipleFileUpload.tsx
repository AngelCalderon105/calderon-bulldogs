"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useState, ChangeEvent } from "react";
import { api } from "~/trpc/react";

import "@splidejs/splide/dist/css/splide.min.css";

const MultipleFileUpload: React.FC = () => {
    const tagOptions = ["Puppy", "Stud", "Mother", "Previous Litter"]; 
    const [files, setFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [fileTags, setFileTags] = useState<string[][]>([]); 

    const presignedUrlMutation = api.s3.getPresignedUrl.useMutation();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            setFiles(selectedFiles);

            const previews = selectedFiles.map((file) => URL.createObjectURL(file));
            setFilePreviews(previews);
            setFileTags(selectedFiles.map(() => []));
        }
    };
  const handleTagChange = (index: number, tags: string[]) => {
    const newFileTags = [...fileTags];
    newFileTags[index] = tags;
    setFileTags(newFileTags);
  };
  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);
    const updatedTags = fileTags.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
    setFileTags(updatedTags);
  };


  const handleUpload = async () => {
    // Validate if files are selected
    if (!files || files.length === 0) {
      alert("No files selected.");
      return;
    }
  
    // Validate if all files have tags
    for (let i = 0; i < files.length; i++) {
      const tags = fileTags[i] || []; // Ensure tags are never undefined, default to empty array
  
      if (tags.length === 0) { // Check if tags are empty
        alert(`Please enter tags for file ${files[i]?.name || "Unknown File"}`);
        return; // Stop if any file is missing tags
      }
    }
  
    // Proceed with uploading files
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];  
        // Type guard to ensure 'file' is defined
        if (!file) {
        console.error("File is undefined at index:", i);
        continue; // Skip this iteration if file is undefined
  }

            const tags = fileTags[i] || []; // Use default empty array to avoid undefined

  // Get the presigned URL for uploading
            const { presignedUrl } = await presignedUrlMutation.mutateAsync({
                    fileName: file.name,
                    fileType: file.type,
                    tags, // Pass the tags for this file
                    });
  
        // Upload the file to S3 using the presigned URL
        await fetch(presignedUrl, {
          method: "PUT",
          body: file,
        });
      }
  
      // Alert user when the files have been successfully uploaded
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
        <div className="mt-4">
          <h3 className="font-medium mb-2">Selected files:</h3>
          <Splide
            options={{
              perPage: 3,
              gap: "2rem",
              pagination: false,
              arrows: true,
              drag: "free",
              breakpoints: {
                640: {
                  perPage: 1,
                },
              },
            }}
          >
            {filePreviews.map((preview, index) => (
              <SplideSlide key={index}>
                <div className="relative">
                  <img
                    src={preview}
                    alt={`File preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                  <label className="block mt-2">
                    Tags:
                    <select
                      multiple
                      className="block w-full border border-gray-300 rounded py-2 px-3 mt-1"
                      value={fileTags[index] || []}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                        handleTagChange(index, selectedOptions);
                      }}
                    >
                      {tagOptions.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
      )}
    </div>
  );
};

export default MultipleFileUpload;
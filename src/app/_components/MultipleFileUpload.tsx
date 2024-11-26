"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useState, ChangeEvent } from "react";
import { api } from "~/trpc/react";
import "@splidejs/splide/dist/css/splide.min.css";
import PuppyProfile from "./PuppyProfile";

interface UploadProps {
  galleryType: string,
  puppyName?: string;
}

const MultipleFileUpload: React.FC<UploadProps> = ({ galleryType, puppyName }) => {
  const tagOptions = ["Previous Litters", "Stud", "Mother", "Our Clients"];
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileTags, setFileTags] = useState<string[]>([]); // Array of single tags for each file

  const presignedUrlMutation = api.s3.getPresignedUrl.useMutation();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setFilePreviews(previews);
      setFileTags(new Array(selectedFiles.length).fill("")); // Initialize with empty strings
    }
  };

  const handleTagChange = (index: number, tag: string) => {
    const newFileTags = [...fileTags];
    newFileTags[index] = tag;
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
    if (!files || files.length === 0) {
      alert("No files selected.");
      return;
    }
    if (galleryType == "main_gallery"){

    for (let i = 0; i < files.length; i++) {
      const tag = fileTags[i];
      if (!tag) {
        alert(`Please select a tag for file ${files[i]?.name || "Unknown File"}`);
        return;
      }
    }
  }
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        let formattedTag ="";
        
        if (galleryType == "main_gallery"){
          formattedTag= (fileTags[i] || "").toLowerCase().replace(/\s+/g, "_") + "_gallery";
        }
       
        if (galleryType == "puppy_galleries"){
          formattedTag = (puppyName || "").toLowerCase().replace(/\s+/g, "_") + "_gallery";
        }

        const { presignedUrl } = await presignedUrlMutation.mutateAsync({
          fileName: file.name,
          fileType: file.type,
          folderName: galleryType,
          tags: formattedTag, 
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
      <h2 className="text-md font-semibold mb-4">Upload Pictures</h2>
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
                  {galleryType =="main_gallery" &&
                  <label className="block mt-2">
                    Tag:
                    <select
                      className="block w-full border border-gray-300 rounded py-2 px-3 mt-1"
                      value={fileTags[index] || ""}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      >
                      <option value="">Select a tag</option>
                      {tagOptions.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </label>
                    }

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

import React, { useState } from 'react';

interface FileUploadProps {
  maxFiles?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ maxFiles = 5 }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selected = Array.from(files).slice(0, maxFiles);
      setSelectedFiles(selectedFiles => [...selectedFiles, selected[0]]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const selected = Array.from(files).slice(0, maxFiles);
      setSelectedFiles(selected);
    }
  };

  const handleRemoveFile = (file: File) => {
    const updatedFiles = selectedFiles.filter((f) => f !== file);
    setSelectedFiles(updatedFiles);
  };

  const handleUpload = () => {
    // Perform the file upload logic here
    // You can use libraries like axios, fetch, or FormData API for the actual upload
    // Example using FormData and fetch:

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the upload
        console.error(error);
      });
  };

  return (
    <div>
      <div
        className="border-2 border-dashed border-gray-400 p-4 text-center cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p>Drag and drop files here or</p>
        <label htmlFor="fileInput" className="text-blue-500 font-bold cursor-pointer">
          click to select
        </label>
        <input
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="mt-4">
        {selectedFiles.map((file, index) => (
          <div key={index} className="flex items-center">
            <span className="mr-2">{file.name}</span>
            <button
              onClick={() => handleRemoveFile(file)}
              className="text-red-500 font-bold"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;

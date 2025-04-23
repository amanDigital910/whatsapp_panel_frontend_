// components/Uploaders/ImageUploaderGroup.jsx
import { ImagesUploader } from "./Index";

const ImageUploaderGroup = ({ inputRefs, uploadedFiles, handleFileUpload, removeFile, mediaCaptions, setMediaCaptions }) => {
  return (
    <div>
      <h6 className="font-semibold">Upload Image (Max 2MB):</h6>
      <div className="grid grid-cols-1 gap-6">
        {["image1", "image2", "image3", "image4"].map((type, index) => (
          <ImagesUploader
            key={type}
            index={index}
            type={type}
            inputRef={inputRefs[type]}
            uploadedFile={uploadedFiles[type]}
            onFileUpload={handleFileUpload}
            onRemove={removeFile}
            caption={mediaCaptions[type] || ""}
            onCaptionChange={(val) => setMediaCaptions((prev) => ({ ...prev, [type]: val }))}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploaderGroup;

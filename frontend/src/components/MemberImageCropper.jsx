import React, { useState, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Card } from "react-bootstrap";

const MemberImageCropper = ({ onCropComplete }) => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState({
    unit: "%",
    width: 90,
    aspect: 300 / 230
  });
  const [imgRef, setImgRef] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);

  const onSelectFile = (e) => {
    if (e?.target?.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]); // Store the actual file
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    if (img) {
      setImgRef(img);
    }
  }, []);

  const handleCropComplete = (crop) => {
    if (!crop) return;

    setCompletedCrop(crop);

    if (imgRef && crop && selectedFile) {
      const scaleX = imgRef?.naturalWidth / imgRef?.width || 1;
      const scaleY = imgRef?.naturalHeight / imgRef?.height || 1;

      const cropData = {
        x: Math.round(crop.x * scaleX),
        y: Math.round(crop.y * scaleY),
        width: Math.round(crop.width * scaleX),
        height: Math.round(crop.height * scaleY),
      };

      // Pass both the original file and crop data to parent
      if (typeof onCropComplete === "function") {
        onCropComplete({
          file: selectedFile,
          cropData: cropData,
        });
      }
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="flex justify-content-center text-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
            </div>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={onSelectFile}
            />
          </label>
        </div>

        {imgSrc && (
          <div className="mt-4">
            <div className="mb-4">
              <h4 className="text-lg font-medium text-center text-gray-900">Select Thumbnail</h4>
              <p className="text-sm text-center text-gray-500">
                Click and drag to create the thumbnail members will see in the directory
              </p>
            </div>

            <div
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={300 / 230}
                className="max-w-full"
              >
                <img
                  src={imgSrc}
                  onLoad={(e) => onLoad(e.target)}
                  alt="Crop preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "500px",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </ReactCrop>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MemberImageCropper;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  initialPreview?: string; // 기존 이미지 URL (수정 시)
}

export default function ImageUpload({
  onChange,
  initialPreview,
}: ImageUploadProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string>(initialPreview || "");
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("imageUpload.fileSizeError"));
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(t("imageUpload.imageOnlyError"));
      return;
    }

    setFileName(file.name);

    // 로컬 미리보기 생성 (Blob URL)
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 파일 객체를 부모 컴포넌트로 전달
    onChange(file);
  };

  const handleRemove = () => {
    setPreview("");
    setFileName("");
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {!preview && (
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-sm text-sm text-neutral-700 hover:bg-neutral-200 transition">
              {t("imageUpload.selectFile")}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-sm text-neutral-500">
              {fileName || t("imageUpload.noFileSelected")}
            </span>
          </label>
        )}
      </div>

      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-sm border border-neutral-200"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 rounded"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

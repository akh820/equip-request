import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  initialPreview?: string; // 기존 이미지 URL (수정 시)
}

export default function ImageUpload({
  onChange,
  initialPreview,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(initialPreview || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB를 초과할 수 없습니다.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

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
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {!preview && (
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1"
          />
        )}
      </div>

      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-48 h-48 object-cover border border-slate-300 rounded"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

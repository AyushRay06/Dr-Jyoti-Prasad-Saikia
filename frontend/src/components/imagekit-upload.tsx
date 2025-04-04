// components/ImageUpload.tsx
import { useState } from "react"
import { imagekit } from "../utils/imagekit"
import { ImageKitUploadResponse } from "../types/imagekit"

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void
  folder?: string
}

export default function ImageUpload({
  onUploadSuccess,
  folder = "/default",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const result = (await imagekit.upload({
        file,
        fileName: file.name,
        folder,
      })) as ImageKitUploadResponse

      onUploadSuccess(result.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      console.error("Upload failed:", err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        onChange={handleUpload}
        disabled={isUploading}
        accept="image/*"
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

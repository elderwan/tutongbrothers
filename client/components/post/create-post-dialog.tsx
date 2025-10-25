"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, XIcon, AtSignIcon } from "lucide-react"
import { useErrorDialog } from "@/components/dialogs/error-dialog"
import { useSuccessDialog } from "@/components/dialogs/success-dialog"
import { createPostApi } from "@/api/post"
import { uploadImages } from "@/lib/uploadImage"

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPostCreated?: () => void
}

export default function CreatePostDialog({ open, onOpenChange, onPostCreated }: CreatePostDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showError } = useErrorDialog()
  const { showSuccess } = useSuccessDialog()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (images.length + files.length > 18) {
      showError({ code: 400, title: "Too many images", msg: "Maximum 18 images allowed" })
      return
    }

    setUploading(true)
    try {
      // Create preview URLs (blob URLs) for immediate display
      const newFiles = Array.from(files)
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

      // Store both the files and preview URLs
      setImageFiles([...imageFiles, ...newFiles])
      setImages([...images, ...newPreviews])
    } catch (error) {
      showError({ code: 500, title: "Upload failed", msg: "Failed to prepare images" })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    // Revoke the blob URL to free memory
    URL.revokeObjectURL(images[index])
    setImages(images.filter((_, i) => i !== index))
    setImageFiles(imageFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      showError({ code: 400, title: "Empty post", msg: "Please write something" })
      return
    }

    setSubmitting(true)
    try {
      // Upload images to Cloudinary first
      let uploadedImageUrls: string[] = []

      if (imageFiles.length > 0) {
        const uploadResults = await uploadImages(imageFiles, { maxSizeMB: 5 })
        uploadedImageUrls = uploadResults.map(result => result.url)
      }

      // Extract mentions from content
      const mentionRegex = /@(\w+)/g
      const mentions = [...content.matchAll(mentionRegex)].map(m => m[1])

      const response = await createPostApi({
        title,
        content,
        images: uploadedImageUrls, // Use the uploaded URLs instead of blob URLs
        mentions
      })

      if (response.code === 200) {
        showSuccess({
          title: "Post created",
          msg: "Your post has been published!",
          onConfirm: () => {
            // Clean up blob URLs
            images.forEach(url => URL.revokeObjectURL(url))
            setTitle("")
            setContent("")
            setImages([])
            setImageFiles([])
            onOpenChange(false)
            onPostCreated?.()
          }
        })
      } else {
        showError({ code: response.code, title: "Failed", msg: response.msg || "Failed to create post" })
      }
    } catch (error: any) {
      showError({ code: 500, title: "Failed", msg: error.message || "Failed to create post" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Post title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XIcon size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 18 || uploading}
              >
                <ImageIcon size={16} className="mr-1" />
                Images ({images.length}/18)
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting || !content.trim()}>
                {submitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

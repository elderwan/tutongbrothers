"use client"

import { useState, useEffect, useRef } from "react"
import { X, Upload, Trash2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPhotos, uploadPhoto, deletePhoto, updatePhoto, Photo } from "@/api/photo"
import { useErrorDialog } from "@/components/dialogs/error-dialog"
import { useSuccessDialog } from "@/components/dialogs/success-dialog"
import { uploadImage } from "@/lib/uploadImage"
import Image from "next/image"

interface PhotoManagerProps {
    onClose: () => void
}

export default function PhotoManager({ onClose }: PhotoManagerProps) {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [isPortrait, setIsPortrait] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { showError } = useErrorDialog()
    const { showSuccess } = useSuccessDialog()

    useEffect(() => {
        loadPhotos()
    }, [])

    const loadPhotos = async () => {
        try {
            setLoading(true)
            const response = await getPhotos()
            if (response.code === 200) {
                setPhotos(response.data)
            }
        } catch (error) {
            showError({
                code: 500,
                title: "loading error",
                msg: "Failed to load photos"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])

        if (files.length === 0) return

        setUploading(true)

        try {
            const uploadPromises = files.map(async (file) => {
                // Upload to Cloudinary
                const result = await uploadImage(file, { maxSizeMB: 10 })

                // Save to database
                const response = await uploadPhoto(result.url, isPortrait, photos.length)

                if (response.code !== 200) {
                    throw new Error(response.msg)
                }

                return response.data
            })

            await Promise.all(uploadPromises)

            showSuccess({
                title: "upload success",
                msg: `success uploaded ${files.length} photos`,
                onConfirm: () => { }
            })

            setIsPortrait(false)
            loadPhotos()

            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } catch (error) {
            showError({
                code: 500,
                title: "upload error",
                msg: error instanceof Error ? error.message : "pls upload later"
            })
        } finally {
            setUploading(false)
        }
    }

    const triggerFileSelect = () => {
        fileInputRef.current?.click()
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await deletePhoto(id)
            if (response.code === 200) {
                showSuccess({
                    title: "delete success",
                    msg: "photo has been removed from the carousel",
                    onConfirm: () => { }
                })
                loadPhotos()
            } else {
                showError({
                    code: response.code,
                    title: "delete failed",
                    msg: response.msg
                })
            }
        } catch (error) {
            showError({
                code: 500,
                title: "delete failed",
                msg: "pls try again later"
            })
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-cream rounded-beagle-xl shadow-beagle-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-light-beige">
                    <h2 className="text-2xl font-bold text-forest-green">📸 photos manager</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-light-beige transition-colors"
                    >
                        <X className="w-5 h-5 text-forest-green" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Upload Form */}
                    <div className="glass rounded-beagle-lg p-6 border border-white/20">
                        <h3 className="text-lg font-semibold text-forest-green mb-4">upload new photos</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-medium-text mb-2">
                                    select photo files
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <div
                                    onClick={triggerFileSelect}
                                    className="border-2 border-dashed border-light-beige rounded-beagle-md p-8 text-center cursor-pointer hover:border-warm-orange hover:bg-light-beige/30 transition-all"
                                >
                                    <ImageIcon className="w-12 h-12 text-medium-text mx-auto mb-3" />
                                    <p className="text-medium-text font-medium mb-1">
                                        click to select photos
                                    </p>
                                    <p className="text-sm text-medium-text/70">
                                        supports multiple selections, max 10MB/photo
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPortrait"
                                    checked={isPortrait}
                                    onChange={(e) => setIsPortrait(e.target.checked)}
                                    className="w-4 h-4 rounded border-light-beige text-warm-orange focus:ring-warm-orange"
                                />
                                <label htmlFor="isPortrait" className="text-sm text-medium-text">
                                    portrait photos (3:4 aspect ratio) - check to mark uploaded photos as portrait
                                </label>
                            </div>
                            {uploading && (
                                <div className="text-center py-3">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-warm-orange border-t-transparent"></div>
                                    <p className="text-sm text-medium-text mt-2">uploading...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Photos List */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-forest-green">
                            current list ({photos.length})
                        </h3>
                        {loading ? (
                            <div className="text-center py-8 text-medium-text">loading...</div>
                        ) : photos.length === 0 ? (
                            <div className="text-center py-8 text-medium-text">
                                no photos yet, please upload the first photo
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {photos.map((photo) => (
                                    <div
                                        key={photo._id}
                                        className="glass rounded-beagle-md overflow-hidden border border-white/20 group"
                                    >
                                        <div className="relative aspect-square">
                                            <Image
                                                src={photo.url}
                                                alt="Photo"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <button
                                                    onClick={() => handleDelete(photo._id)}
                                                    className="p-2 rounded-full bg-red/90 text-white hover:bg-red transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {photo.isPortrait && (
                                                <div className="absolute bottom-2 left-2">
                                                    <span className="px-2 py-1 bg-warm-orange/90 text-white text-xs rounded-full font-semibold">
                                                        portrait
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent } from "react";
import { Upload, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FileItem {
  id: string;
  name: string;
  size: number;
  totalSize: number;
  progress: number;
  status: "uploading" | "completed" | "error";
}

export default function FileUpload() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Solo 1 archivo
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) {
        alert("Usuario no identificado");
        return;
      }

      const fileId = Math.random().toString(36).substring(2, 9);

      const tempFile: FileItem = {
        id: fileId,
        name: file.name,
        size: 0,
        totalSize: file.size,
        progress: 0,
        status: "uploading",
      };

      setFiles((prev) => [...prev, tempFile]);

      const formData = new FormData();
      formData.append("deposit", file); // debe coincidir con `upload.single("deposit")`

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/uploadDeposit/${user.id}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error en la subida");
        }

        // Marcar como completado
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  size: f.totalSize,
                  progress: 100,
                  status: "completed",
                }
              : f
          )
        );
        router.push("/shop/invoices");
      } catch (error) {
        console.error("Error al subir:", error);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: "error" } : f))
        );
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: Math.floor(file.size / 2), // Simulate partial upload
        totalSize: file.size,
        progress: 50,
        status: "uploading" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload completion for the new files
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((file) => {
            if (newFiles.some((newFile) => newFile.id === file.id)) {
              return {
                ...file,
                size: file.totalSize,
                progress: 100,
                status: "completed" as const,
              };
            }
            return file;
          })
        );
      }, 2000);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "";
  };

  return (
    <div className="fixed inset-0 bg-gris-oscuro/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gris-medio/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-marfil-suave flex items-center justify-center">
              <Upload className="w-4 h-4 text-gris-oscuro" />
            </div>
            <h2 className="text-lg font-semibold text-gris-oscuro">
              Sube el Comprobante
            </h2>
          </div>
          <button className="text-gris-medio hover:text-gris-oscuro">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gris-medio mb-3">
            Select and upload the files of your choice
          </p>

          <div
            className="border-2 border-dashed border-gris-medio/30 rounded-lg p-8 flex flex-col items-center justify-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="w-12 h-12 rounded-full bg-marfil-suave flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-gris-oscuro" />
            </div>
            <p className="text-gris-oscuro font-medium text-center mb-1">
              Choose a file or drag & drop it here.
            </p>
            <p className="text-sm text-gris-medio text-center mb-4">
              JPEG, PNG
            </p>

            <button
              onClick={handleBrowseClick}
              className="bg-white border border-gris-medio/30 hover:border-dorado-elegante text-gris-oscuro px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Browse File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              multiple={false}
            />
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border border-gris-medio/20 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-vino-profundo/10 rounded flex items-center justify-center text-vino-profundo text-xs font-bold">
                        {getFileExtension(file.name)}
                      </div>
                      <div>
                        <p className="text-sm text-gris-oscuro font-medium">
                          {file.name}
                        </p>
                        <p className="text-xs text-gris-medio">
                          {formatFileSize(file.size)} of{" "}
                          {formatFileSize(file.totalSize)} •{" "}
                          {file.status === "uploading" && (
                            <span className="text-dorado-elegante">
                              Uploading...
                            </span>
                          )}
                          {file.status === "completed" && (
                            <span className="text-green-500">Completed</span>
                          )}
                          {file.status === "error" && (
                            <span className="text-red-500">Error</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gris-medio hover:text-gris-oscuro"
                    >
                      {file.status === "uploading" ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="h-1 w-full bg-gris-medio/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        file.status === "uploading"
                          ? "bg-dorado-elegante"
                          : file.status === "completed"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

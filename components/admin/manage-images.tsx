
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import supabase from "../../app/config/supabaseClient";

const ManageImages = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("image_upload")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setDeletingId(id);

    try {
      const { error } = await supabase
        .from("image_upload")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/image-upload?id=${id}`);
  };

  const handleAddNew = () => {
    router.push("/admin/image-upload");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0))] text-foreground px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-muted-foreground">
            Gallery management
          </p>
          <h1 className="mb-4 text-4xl font-serif text-foreground sm:text-5xl">
            Manage wedding photos
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            View, edit, and organize the photos in your wedding gallery. Add new
            memories or update existing ones to keep the celebration alive.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <Button
            onClick={handleAddNew}
            className="rounded-full px-8 py-3 text-base font-medium"
          >
            Add new photo
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Loading images...</p>
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-[2rem] border border-border/60 bg-white/80 shadow-2xl backdrop-blur-xl dark:bg-slate-950/80 p-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-6 text-6xl">📷</div>
              <h3 className="mb-4 text-2xl font-semibold text-foreground">
                No photos yet
              </h3>
              <p className="mb-8 text-muted-foreground">
                Start building your wedding gallery by uploading your first
                photo. Every moment deserves to be remembered.
              </p>
              <Button
                onClick={handleAddNew}
                className="rounded-full px-8 py-3 text-base font-medium"
              >
                Upload first photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group overflow-hidden rounded-[1.5rem] border border-border/60 bg-white/80 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl dark:bg-slate-950/80"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={img.image}
                    alt={img.title || "Wedding photo"}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-3 font-medium text-foreground line-clamp-2">
                    {img.title}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(img.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(img.id)}
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === img.id}
                      className="flex-1 rounded-full"
                    >
                      {deletingId === img.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ManageImages;

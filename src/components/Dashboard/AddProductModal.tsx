import React, { useState } from "react";

const BASE_URL = "http://localhost:8081/api/v1";

export default function AddProductModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    stock: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    const data = new FormData();
    data.append("file", file); // Part 1: binary image

    // Part 2: JSON object including the productId field
    const requestObject = {
      productId: 0,
      title: formData.name,
      name: formData.name,
      price: formData.price,
      description: formData.description,
      stock: formData.stock,
    };

    data.append(
      "request",
      new Blob([JSON.stringify(requestObject)], { type: "application/json" }),
    );

    try {
      const response = await fetch(`${BASE_URL}/products/create`, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Product Created Successfully!");
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          Post New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-bold text-gray-400">
            PRODUCT IMAGE
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm"
          />

          <input
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price ($)"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
          />
          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded h-20"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 text-white rounded font-bold"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

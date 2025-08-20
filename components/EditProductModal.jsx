import { useState, useEffect } from "react";

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
  });

  // Prefill form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        desc: product.desc || "",
        price: product.prices?.[0] || "", // first price
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send prices as an array of numbers
    const updatedData = {
      title: formData.title,
      desc: formData.desc,
      prices: [parseFloat(formData.price)],
    };
    onSave(product._id, updatedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </label>

          <div className="modal-actions">
            <button
              type="button"
              className="btn cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn save">
              Save
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .modal {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        h2 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        input, textarea {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.25rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
        }

        textarea {
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .btn {
          padding: 0.5rem 1.2rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }

        .btn.cancel {
          background: #ccc;
          color: #000;
        }

        .btn.cancel:hover {
          background: #b3b3b3;
        }

        .btn.save {
          background: #0070f3;
          color: #fff;
        }

        .btn.save:hover {
          background: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default EditProductModal;

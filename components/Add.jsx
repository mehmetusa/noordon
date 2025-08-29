import { useState, useRef } from "react";
import axios from "axios";
import styles from "../styles/Add.module.css";

const Add = ({ setClose }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [prices, setPrices] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [extra, setExtra] = useState(null);
  const [extraOptions, setExtraOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const categories = [
    { id: "bakery", name: "Bakery" },
    { id: "cakes", name: "Cakes" },
    { id: "desserts", name: "Desserts" },
    { id: "salads", name: "Salads" },
    { id: "salties", name: "Salties" },
    { id: "cookies", name: "Cookies" },
  ];

  const handleFilesChange = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles(selectedFiles);
    const previewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(previewUrls);
  };

  const changePrice = (e, index) => {
    const newPrices = [...prices];
    newPrices[index] = Number(e.target.value);
    setPrices(newPrices);
  };

  const handleExtraInput = (e) => {
    setExtra({ ...extra, [e.target.name]: e.target.value });
  };

  const handleAddExtra = () => {
    if (extra?.text && extra?.price) {
      setExtraOptions([...extraOptions, extra]);
      setExtra(null);
    }
  };

  const handleCreate = async () => {
    if (!title || !desc || !categoryId || files.length === 0 || prices.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const uploadedUrls = [];

      for (let file of files) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "noordon");

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dcjz84xa8/image/upload",
          data
        );
        uploadedUrls.push(uploadRes.data.url);
      }

      const newProduct = {
        title,
        desc,
        prices,
        category: categoryId,
        extraOptions,
        imgs: uploadedUrls,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, newProduct);
      setClose(true);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span className={styles.close} onClick={() => setClose(true)}>X</span>
        <h1>Add New Product</h1>

        {/* File Upload */}
        <div className={styles.item}>
          <label className={styles.label}>Choose Images</label>
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              className={styles.addButton}
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Files
            </button>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{
                opacity: 0,
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
              onChange={handleFilesChange}
            />
          </div>
          <div className={styles.previewContainer}>
            {previews.map((url, index) => (
              <img key={index} src={url} alt={`Preview ${index}`} className={styles.previewImg} />
            ))}
          </div>
        </div>

        {/* Title */}
        <div className={styles.item}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className={styles.item}>
          <label className={styles.label}>Description</label>
          <textarea
            rows={4}
            className={styles.input}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {/* Prices */}
        <div className={styles.item}>
          <label className={styles.label}>Prices</label>
          <div className={styles.priceContainer}>
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Small"
              onChange={(e) => changePrice(e, 0)}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Medium"
              onChange={(e) => changePrice(e, 1)}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Large"
              onChange={(e) => changePrice(e, 2)}
            />
          </div>
        </div>

        {/* Category */}
        <div className={styles.item}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.select}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">-- Select a category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Extra Options */}
        <div className={styles.item}>
          <label className={styles.label}>Extra Options</label>
          <div className={styles.extra}>
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="text"
              placeholder="Item"
              name="text"
              onChange={handleExtraInput}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Price"
              name="price"
              onChange={handleExtraInput}
            />
            <button className={styles.extraButton} onClick={handleAddExtra}>
              Add
            </button>
          </div>
          <div className={styles.extraItems}>
            {extraOptions.map((option, index) => (
              <span key={index} className={styles.extraItem}>
                {option.text} (+${option.price})
              </span>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <button
          className={styles.addButton}
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Create Product"}
        </button>
      </div>
    </div>
  );
};

export default Add;

import React, { useState } from "react";
import { FaPaperPlane, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import styles from "../styles/Contact.module.css";


const Contact = () => {
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const form = new FormData(event.target);
    form.append("access_key", "effecd1a-3484-4f8b-8770-645fee5ecf86");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully!");
        event.target.reset();
      } else {
        console.error("Error", data);
        setResult(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      setResult("Submission failed, please try again.");
    }
  };

  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.contactContainer}>
        {/* Contact Info */}
        <div className={styles.contactInfoMain}>
          <img className={styles.logoContact} src="/img/noordon.png" alt="Logo" />
          <h2>Contact Us</h2>
          <p>Have questions or ready to schedule service? Reach out today!</p>

          <div className={styles.contactDetails}>
            <div className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <span>(202) 844-9087</span>
            </div>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span>info@noordon.us</span>
            </div>
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>3548 Finish Line Drive Gainesville, VA 20155</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className={styles.contactFormContainer}>
          <form className={styles.contactForm} onSubmit={onSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Smith"
                required
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                required
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="How can we help you?"
                rows="5"
                required
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>
              <FaPaperPlane className={styles.buttonIcon} />
              Send Message
            </button>

            <div className={`${styles.formResult} ${result ? styles.visible : ""}`}>
              {result}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

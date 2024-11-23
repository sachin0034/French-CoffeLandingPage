import React, { useState } from "react";
import "./ContactForm.css";
import { Images } from "../../assets";
import axios from "axios";
import { toast } from "react-toastify";

function ContactForm() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/contact/add`,
        {
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }
      );
      if (response.data.success) {
        toast.success("Send Successfully");
      }
      setFormData({ email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form">
        <h2>CONTACTEZ-NOUS</h2>
        <p>
          Nous sommes à votre disposition pour toute demande de renseignements
          ou services.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Numéro de téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-submit">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
      <div className="contact-image">
        <img src={Images.CONTACT_SEC_IMAGE} alt="Contact Us" />
      </div>
    </div>
  );
}

export default ContactForm;

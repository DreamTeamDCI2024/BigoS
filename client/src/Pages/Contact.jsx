import React from "react";
import "../Pages/CSS/Contact.css"
import mail_icon from "../Assets/mail_icon.png";
import location_icon from "../Assets/location_icon.png";
import msg_icon from "../Assets/msg_icon.png";
import phone_icon from "../Assets/phone_icon.png";

const Contact = () => {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "f931eee1-9608-405c-ae30-8cb13aa18678");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  return (
    <div className="contact">
      <div className="contact-col">
        <h3>
          Send us a message <img src={msg_icon} alt="" />{" "}
        </h3>
        <p>
          Feel free to reach out through contact form or find our contact
          information below. Your feedback, questions, and suggestions are
          important to us as we strive to provide exceptional service.
        </p>
        <ul>
          <li>
            <img src={mail_icon} alt="" />
            Contact@Bigos.dev
          </li>
          <li>
            {" "}
            <img src={phone_icon} alt="" />
            +49 152-651-1321
          </li>
          <li>
            <img src={location_icon} alt="" />
            77 Ollenhaustrasse, Berlin
            <br /> 13401, Germany
          </li>
        </ul>
      </div>
      <div className="contact-col">
        <form onSubmit={onSubmit}>
          <label>Your name</label>
          <input
            type="text"
            name="name"
            plac
            eholder="Enter your name"
            required
          />{" "}
          <br />
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your mobile"
            required
          />{" "}
          <br />
          <label>Write your messages here</label>
          <textarea
            name="message"
            rows="6"
            placeholder="Enter your message"
            required
          ></textarea>{" "}
          <br />
          <button type="submit" className="btn dark-btn">
            Submit now
          </button>
        </form>
        <span>{result}</span>
      </div>
    </div>
  );
};

export default Contact;


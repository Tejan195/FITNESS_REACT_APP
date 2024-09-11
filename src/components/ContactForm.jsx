import "./ContactForm.css";
function ContactForm() {
  return (
    <div className="contact-form">
      <h4>Get in touch</h4>
      <h2>We are here to help</h2>
      <form>
        <label htmlFor="name">Name <span>*</span></label>
        <input type="text" id="name" name="name" placeholder="Your Name" required />

        <label htmlFor="email">Email address <span>*</span></label>
        <input type="email" id="email" name="email" placeholder="email@website.com" required />

        <label htmlFor="phone">Phone number <span>*</span></label>
        <input type="tel" id="phone" name="phone" placeholder="555-555-5555" required />

        <label htmlFor="message">Message<span>*</span></label>
        <textarea id="message" name="message" placeholder="Your message"></textarea>

        <div className="checkbox">
          <input type="checkbox" id="consent" name="consent" required />
          <label htmlFor="consent">
            I allow this website to store my submission so they can respond to my inquiry.<span>*</span>
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ContactForm;

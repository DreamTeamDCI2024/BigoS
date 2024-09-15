import "./TermsOfuse.css";

const TermsOfuse = ({ show, onClose, title }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        
        <div className="modal-body">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
          <p>
            1. Acceptance of Terms By accessing and using this website or
            service, you agree to comply with and be bound by these Terms of
            Use. If you do not agree to these terms, please do not use the
            service.
          </p>
          <p>
            2. Use of the Service You may use the service for lawful purposes
            only. You agree not to use the service: To violate any local, state,
            national, or international laws or regulations. To infringe upon or
            violate our intellectual property rights or the intellectual
            property rights of others. To harm, defraud, or mislead other users.
            To introduce viruses or other malicious code.
          </p>
          <p>
            3. User Accounts You may be required to create an account to use
            certain parts of the service. You are responsible for maintaining
            the confidentiality of your account information and for all
            activities that occur under your account. You must notify us
            immediately of any unauthorized use of your account.
          </p>
          <p>
            4. Intellectual Property All content, including but not limited to
            text, graphics, logos, images, and software, is the property of
            [Your Company Name] or its licensors and is protected by
            intellectual property laws. You may not reproduce, distribute,
            modify, or exploit the content without our prior written consent.
          </p>
          <p>
            5. Limitation of Liability We make no guarantees or warranties of
            any kind, express or implied, about the operation or availability of
            the service. You agree that your use of the service is at your own
            risk. We are not liable for any direct, indirect, incidental,
            consequential, or punitive damages arising from your use of the
            service.
          </p>
          <p>
            6. Termination We reserve the right to suspend or terminate your
            access to the service at any time, for any reason, including but not
            limited to a breach of these terms.
          </p>
          <p>
            7. Changes to Terms We may update these Terms of Use from time to
            time. You agree to review these terms periodically for any changes.
            Continued use of the service after changes are posted constitutes
            acceptance of the revised terms.
          </p>
          <p>
            8. Governing Law These terms are governed by and construed in
            accordance with the laws of [Your Jurisdiction]. Any disputes
            arising from or relating to these terms will be resolved in the
            courts of [Your Jurisdiction].
          </p>
          <h2>Privacy Policy</h2>
          <p>
            1. Introduction At [Your Company Name], we are committed to
            protecting your privacy. This Privacy Policy explains how we
            collect, use, and disclose personal information through our website
            or service.
          </p>
          <p>
            2. Information We Collect We may collect personal information that
            you provide to us directly, such as: Name Email address Billing and
            payment information Account details We may also collect non-personal
            information automatically through the use of cookies, analytics
            tools, and similar technologies.
          </p>
          <p>
            3. Use of Information We use your personal information to: Provide
            and improve our services Process payments and transactions
            Communicate with you regarding your account or transactions Send
            promotional materials (only with your consent) Comply with legal
            obligations
          </p>
          <p>
            4. Sharing of Information We do not share your personal information
            with third parties except: With your consent To service providers
            who help us operate the service (e.g., payment processors) To comply
            with legal requirements (e.g., in response to a court order or
            government request)
          </p>
          <p>
            5. Data Security We implement reasonable security measures to
            protect your personal information from unauthorized access, use, or
            disclosure. However, no security system is impenetrable, and we
            cannot guarantee the complete security of your data.
          </p>
          <p>
            6. Your Rights You may have certain rights regarding your personal
            information, including: The right to access, correct, or delete your
            personal information. The right to object to or restrict the
            processing of your personal information. The right to withdraw
            consent to the use of your personal information. To exercise any of
            these rights, please contact us at [Your Contact Information].
          </p>
          <p>
            7. Cookies Our website uses cookies to enhance user experience. You
            can manage cookie preferences through your browser settings, but
            disabling cookies may affect the functionality of the service.
          </p>
          <p>
            8. Changes to the Privacy Policy We may update this Privacy Policy
            from time to time. We will notify you of any significant changes,
            and your continued use of the service constitutes acceptance of the
            updated policy.
          </p>
          <p>
            9. Contact Information If you have any questions or concerns about
            this Privacy Policy, please contact us at [Your Email Address or
            Phone Number]. These templates cover basic legal requirements for
            websites or apps. However, it is essential to consult with a legal
            professional to ensure your Terms of Use and Privacy Policy are
            fully compliant with relevant laws, such as the GDPR, CCPA, or
            others depending on your user base.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfuse;

import React from "react";

function Meta() {
  return (
    <>
      <title>Support</title>
      <meta
        name="description"
        content="Need help? Contact our support team by filling out this form to send an email directly."
      />
    </>
  );
}

const SupportPage = () => {
  const [fromEmail, setFromEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  const supportEmail = "support@example.com";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(`From: ${fromEmail}\n\n${message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <>
      <Meta />
      <div className="flex min-h-screen items-center justify-center bg-base-200 p-6">
        <div className="card w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Contact Support</h2>
            <p className="mb-4 text-sm text-gray-500">
              Fill out this form to email our support team.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Your Email</span>
                </label>
                <input
                  type="email"
                  required
                  className="input input-bordered"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  type="text"
                  required
                  className="input input-bordered"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="form-control">
                <button type="submit" className="btn btn-primary">
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPage;

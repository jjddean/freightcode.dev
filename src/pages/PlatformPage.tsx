import React from 'react';

const PlatformPage = () => {
  const capabilities = [
    "AI-powered quote engine",
    "Digital document processing",
    "Real-time shipment updates",
    "Secure client dashboard"
  ];

  return (
    <div className="page-container">
      <h1>Platform Capabilities</h1>
      <div className="page-content">
        <div className="platform-overview">
          <h2>Our Technology</h2>
          <p>
            FreightSync's proprietary platform combines artificial intelligence, 
            document processing, and real-time tracking to create a seamless 
            shipping experience for our clients.
          </p>
        </div>

        <div className="capabilities-section">
          <h2>Key Features</h2>
          <div className="capabilities-grid">
            {capabilities.map((capability, index) => (
              <div key={index} className="capability-card">
                <div className="capability-icon">⚙️</div>
                <h3>{capability}</h3>
                <p>Our {capability.toLowerCase()} helps streamline your shipping process and provides greater visibility into your supply chain.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="platform-demo">
          <h2>See It In Action</h2>
          <p>
            Schedule a personalized demo to see how our platform can transform 
            your logistics operations and save you time and money.
          </p>
          <button className="demo-button">Request Demo</button>
        </div>
      </div>
    </div>
  );
};

export default PlatformPage;
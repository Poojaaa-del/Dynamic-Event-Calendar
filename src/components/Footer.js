import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Dynamic Calendar App. All rights reserved.</p>
        <div className="social-links">
          <a href="https://github.com/Poojaaa-del" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://www.linkedin.com/in/pooja-kumari-40b382340/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
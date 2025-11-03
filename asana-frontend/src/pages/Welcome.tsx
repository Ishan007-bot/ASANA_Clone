import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import asanaLogo from '../assets/asana-logo.png';

function Welcome() {
  const [fullName, setFullName] = useState('');
  const [showError, setShowError] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Get email from localStorage or use default
  const email = localStorage.getItem('signupEmail') || 'yourvlogger6969@gmail.com';

  useEffect(() => {
    // Show error if name is empty when trying to submit
    if (fullName.trim() === '' && showError) {
      setShowError(true);
    } else if (fullName.trim() !== '') {
      setShowError(false);
    }
  }, [fullName, showError]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() === '') {
      setShowError(true);
      return;
    }
    // Navigate to Tell Us About Work page
    navigate('/tell-us-about-work');
  };

  const handleLoginInstead = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  const isContinueDisabled = fullName.trim() === '';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif'
    }}>
      {/* Left Section - Form */}
      <div style={{
        flex: '0 0 60%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 60px',
        position: 'relative'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '48px' }}>
          <img
            src={asanaLogo}
            alt="Asana"
            style={{
              height: '28px',
              width: 'auto'
            }}
          />
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: 500,
          color: '#3d3d3d',
          margin: '0 0 16px 0',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          fontFamily: '"Ghost", "Helvetica Neue", "Helvetica", sans-serif'
        }}>
          Welcome to Asana!
        </h1>

        {/* Email Confirmation */}
        <p style={{
          fontSize: '16px',
          color: '#646f79',
          margin: '0 0 40px 0',
          lineHeight: '1.5'
        }}>
          You're signing up as {email}.
        </p>

        {/* Profile Picture and Name Input Section */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '32px',
          alignItems: 'flex-start'
        }}>
          {/* Profile Picture Placeholder */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={handleImageClick}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '2px dashed #b7bfc6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#fafafa',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    fill="#b7bfc6"
                  />
                  <path
                    d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                    fill="#b7bfc6"
                  />
                </svg>
              )}
            </div>
            {/* Camera Icon */}
            <div
              onClick={handleImageClick}
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #b7bfc6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                  stroke="#b7bfc6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
                  stroke="#b7bfc6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Name Input Section */}
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 500,
              color: '#3d3d3d',
              margin: '0 0 12px 0'
            }}>
              What's your full name?
            </h3>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (showError && e.target.value.trim() !== '') {
                  setShowError(false);
                }
              }}
              onBlur={() => {
                if (fullName.trim() === '') {
                  setShowError(true);
                }
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                borderRadius: '6px',
                border: showError ? '2px solid #ff5263' : '1px solid #cfcfcf',
                backgroundColor: '#ffffff',
                color: '#3d3d3d',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder=""
            />
            {showError && (
              <p style={{
                color: '#ff5263',
                fontSize: '14px',
                margin: '8px 0 0 0'
              }}>
                Please enter your name.
              </p>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={isContinueDisabled}
          style={{
            width: '100%',
            padding: '14px 24px',
            fontSize: '16px',
            fontWeight: 500,
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isContinueDisabled ? '#e7e7e7' : '#3d3d3d',
            color: isContinueDisabled ? '#868686' : '#ffffff',
            cursor: isContinueDisabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s, color 0.2s',
            marginBottom: '32px'
          }}
        >
          Continue
        </button>

        {/* Bottom Text */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '32px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#646f79',
            margin: '0 0 16px 0'
          }}>
            You're signing up as {email}.
          </p>
          <p style={{
            fontSize: '14px',
            color: '#646f79',
            margin: 0
          }}>
            Wrong account?{' '}
            <a
              href="/login"
              onClick={handleLoginInstead}
              style={{
                color: '#008ce3',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Log in instead.
            </a>
          </p>
        </div>
      </div>

      {/* Right Section - Decorative Illustration */}
      <div style={{
        flex: '0 0 40%',
        backgroundColor: '#ffedef',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative SVG Illustration */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Large Arch Shape */}
          <path
            d="M 50 200 Q 200 50, 350 200"
            stroke="#690031"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Cloud Top Left */}
          <g transform="translate(80, 120)">
            <path
              d="M 20 40 Q 30 20, 50 20 Q 60 10, 70 20 Q 90 20, 100 40 Q 100 50, 90 50 L 30 50 Q 20 50, 20 40 Z"
              fill="#ffffff"
              stroke="#690031"
              strokeWidth="2"
            />
          </g>

          {/* Envelope with Notification */}
          <g transform="translate(120, 180)">
            <rect x="10" y="20" width="40" height="30" fill="#ffffff" stroke="#690031" strokeWidth="2" rx="2"/>
            <path d="M 10 20 L 30 35 L 50 20" stroke="#690031" strokeWidth="2" fill="none"/>
            <circle cx="45" cy="25" r="6" fill="#FF584A"/>
          </g>

          {/* Speech Bubble */}
          <g transform="translate(200, 140)">
            <path
              d="M 20 10 Q 20 5, 25 5 L 55 5 Q 60 5, 60 10 L 60 35 Q 60 40, 55 40 L 35 40 L 25 50 L 25 40 L 25 40 Q 20 40, 20 35 Z"
              fill="#ffffff"
              stroke="#690031"
              strokeWidth="2"
            />
          </g>

          {/* Bars Icon */}
          <g transform="translate(260, 190)">
            <rect x="10" y="15" width="30" height="4" fill="#b7bfc6" stroke="#690031" strokeWidth="1"/>
            <rect x="10" y="25" width="30" height="4" fill="#b7bfc6" stroke="#690031" strokeWidth="1"/>
            <rect x="10" y="35" width="30" height="4" fill="#FF584A" stroke="#690031" strokeWidth="1"/>
          </g>

          {/* Sun Icon */}
          <g transform="translate(160, 280)">
            <circle cx="40" cy="40" r="25" fill="#FF584A" stroke="#690031" strokeWidth="2"/>
            <path d="M 40 5 L 40 15 M 40 65 L 40 75 M 5 40 L 15 40 M 65 40 L 75 40 M 12.93 12.93 L 20.61 20.61 M 59.39 59.39 L 67.07 67.07 M 12.93 67.07 L 20.61 59.39 M 59.39 20.61 L 67.07 12.93" 
              stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
          </g>

          {/* Cloud Bottom Right */}
          <g transform="translate(240, 350)">
            <path
              d="M 20 40 Q 30 20, 50 20 Q 60 10, 70 20 Q 90 20, 100 40 Q 100 50, 90 50 L 30 50 Q 20 50, 20 40 Z"
              fill="#ffffff"
              stroke="#690031"
              strokeWidth="2"
            />
          </g>

          {/* Horizontal Line */}
          <line x1="50" y1="500" x2="350" y2="500" stroke="#690031" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );
}

export default Welcome;


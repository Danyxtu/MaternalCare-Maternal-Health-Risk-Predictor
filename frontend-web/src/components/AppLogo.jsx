import React from 'react';
import logo from '../assets/images/maternal-care-logo.png';

const AppLogo = ({ 
  size = 40, 
  className = "", 
  borderColor = "#E11D48", 
  borderWidth = 2,
  backgroundColor = "transparent",
  plain = false,
  imageScale = 0.85
}) => {
  const shineStyle = {
    animation: 'logo-shine 2.5s ease-in-out infinite',
    filter: 'drop-shadow(0 0 8px rgba(225, 29, 72, 0.5))'
  };

  const keyframes = `
    @keyframes logo-shine {
      0% { 
        filter: drop-shadow(0 0 5px rgba(225, 29, 72, 0.3)); 
        transform: scale(1);
      }
      50% { 
        filter: drop-shadow(0 0 20px rgba(225, 29, 72, 0.8)); 
        transform: scale(1.05);
      }
      100% { 
        filter: drop-shadow(0 0 5px rgba(225, 29, 72, 0.3)); 
        transform: scale(1);
      }
    }
  `;

  if (plain) {
    return (
      <>
        <style>{keyframes}</style>
        <img
          src={logo}
          alt="MaternalCare Logo"
          style={{ width: size, height: size, objectFit: 'contain', ...shineStyle }}
          className={className}
        />
      </>
    );
  }

  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%', 
        border: `${borderWidth}px solid ${borderColor}`,
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(225, 29, 72, 0.2)',
        position: 'relative'
      }}
      className={className}
    >
      <style>{keyframes}</style>
      <img
        src={logo}
        alt="MaternalCare Logo"
        style={{ 
          width: `${imageScale * 100}%`, 
          height: `${imageScale * 100}%`, 
          objectFit: 'contain',
          transform: 'translateZ(0)',
          ...shineStyle
        }}
      />
    </div>
  );
};

export default AppLogo;

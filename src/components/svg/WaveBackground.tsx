import React from 'react';

interface WaveBackgroundProps {
  className?: string;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({ className }) => {
  return (
    <svg 
      width="1440" 
      height="593" 
      viewBox="0 0 1440 593" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1441 1C1314.36 113.878 1231.96 166.07 1080.5 229.324C945.396 285.748 720 318 720 318C720 318 494.604 350.252 359.5 406.676C208.044 469.93 125.637 522.122 -1 635" 
        stroke="#305AFF" 
        strokeOpacity="0.65" 
        strokeDasharray="6 6"
      />
    </svg>
  );
};

export default WaveBackground; 
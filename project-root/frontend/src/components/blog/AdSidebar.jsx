import React from 'react';

const ads = [
  {
    title: 'Upgrade Your Coding Skills!',
    description:
      'Join over 1 million developers using DevBoost for daily coding tips, tutorials, and exclusive webinars to take your skills to the next level.',
    isLarge: true,
  },
  {
    title: 'Launch Your Startup',
    description:
      'Affordable domain and hosting starting at just £1/month. Get your startup online quickly with 24/7 support and easy setup.',
    isLarge: true,
  },
  {
    title: 'Free UI Kits & Icons',
    description: 'Download high-quality UI resources for your next project.',
    isLarge: false,
  },
  {
    title: 'Join Our Newsletter',
    description: 'Get tech news, design trends, and dev memes every week!',
    isLarge: false,
  },
  {
    title: 'Boost Page Speed',
    description: 'Optimize your site performance with our free tools.',
    isLarge: false,
  },
  {
    title: 'Looking to Hire Devs?',
    description: 'Post your job on DevBoard and reach thousands of coders.',
    isLarge: false,
  },
];

const AdSidebar = () => {
  return (
    <div className='space-y-6 max-w-full'>
      {ads.map((ad, index) => (
        <div
          key={index}
          className={`rounded-2xl shadow-md bg-white dark:bg-gray-900 p-6 flex flex-col justify-center
            ${ad.isLarge ? 'min-h-[200px] text-base' : 'min-h-[120px] text-sm'}
            `}
          style={{
            wordWrap: 'break-word',
          }}
        >
          <h3
            className={`font-semibold mb-3 ${
              ad.isLarge ? 'text-xl' : 'text-lg'
            }`}
          >
            {ad.title}
          </h3>
          <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
            {ad.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdSidebar;

import { useState } from 'react';
import { motion } from 'framer-motion';
import newsData from '../utils/newsData';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 15,
    },
  },
};

const News = () => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className='min-h-screen bg-background text-text px-4 py-12 max-w-6xl mx-auto'>
      <header className='mb-8 text-center'>
        <h1 className='text-3xl sm:text-4xl font-heading font-bold'>
          Latest News
        </h1>
        <p className='mt-2 text-text text-sm sm:text-base max-w-xl mx-auto'>
          Stay up-to-date with the latest updates, tech releases, and industry
          trends.
        </p>
      </header>

      <motion.div
        className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
      >
        {newsData.map(({ id, title, description, date, image }) => {
          const isExpanded = expanded[id];

          return (
            <motion.article
              key={id}
              className='bg-white dark:bg-neutral border border-neutral rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col'
              variants={cardVariants}
            >
              {image && (
                <img
                  src={image}
                  alt={title}
                  loading='lazy'
                  width={400}
                  height={300}
                  className='w-full h-48 object-cover'
                />
              )}

              <div className='p-4 flex flex-col gap-2 flex-1'>
                <h2 className='text-xl font-heading font-semibold line-clamp-2'>
                  {title}
                </h2>

                <p
                  className={`text-sm text-text ${
                    isExpanded ? '' : 'line-clamp-5'
                  }`}
                >
                  {description}
                </p>

                <button
                  onClick={() => toggleExpand(id)}
                  className='text-md text-primary mt-1 self-start hover:underline'
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>

                <span className='text-xs text-text mt-auto'>
                  {new Date(date).toLocaleDateString()}
                </span>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
};

export default News;

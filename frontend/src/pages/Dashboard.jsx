const Dashboard = () => {
  return (
    <div className='min-h-screen bg-background text-text p-8'>
      <header className='mb-8'>
        <h1 className='text-4xl font-bold text-primary mb-2'>Dashboard</h1>
        <p className='text-secondary'>
          Welcome back! Here's an overview of your stats.
        </p>
      </header>

      <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Card 1 */}
        <div className='bg-neutral rounded-lg shadow-md p-6 border border-primary'>
          <h2 className='text-xl font-semibold mb-2 text-primary'>
            Total Posts
          </h2>
          <p className='text-3xl font-bold'>42</p>
        </div>

        {/* Card 2 */}
        <div className='bg-neutral rounded-lg shadow-md p-6 border border-primary'>
          <h2 className='text-xl font-semibold mb-2 text-primary'>
            New Comments
          </h2>
          <p className='text-3xl font-bold'>17</p>
        </div>

        {/* Card 3 */}
        <div className='bg-neutral rounded-lg shadow-md p-6 border border-primary'>
          <h2 className='text-xl font-semibold mb-2 text-primary'>Followers</h2>
          <p className='text-3xl font-bold'>128</p>
        </div>
      </section>

      <section className='mt-12'>
        <h2 className='text-2xl font-semibold text-primary mb-4'>
          Recent Activity
        </h2>
        <ul className='bg-neutral rounded-lg shadow-md divide-y divide-primary'>
          <li className='p-4 hover:bg-primary/10 cursor-pointer'>
            <p className='font-semibold'>
              You published a new post: "React Tips and Tricks"
            </p>
            <span className='text-secondary text-sm'>2 hours ago</span>
          </li>
          <li className='p-4 hover:bg-primary/10 cursor-pointer'>
            <p className='font-semibold'>
              New comment on your post "Understanding Redux"
            </p>
            <span className='text-secondary text-sm'>5 hours ago</span>
          </li>
          <li className='p-4 hover:bg-primary/10 cursor-pointer'>
            <p className='font-semibold'>
              You updated your profile information
            </p>
            <span className='text-secondary text-sm'>1 day ago</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;

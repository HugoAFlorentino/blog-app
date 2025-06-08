const LogsTable = ({
  logs,
  logsStatus,
  logsError,
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) => {
  return (
    <section className='mt-20'>
      <h2 className='text-4xl font-heading font-extrabold text-primary mb-6'>
        Logs
      </h2>

      {logsStatus === 'loading' && (
        <p className='text-center py-6'>Loading logs...</p>
      )}
      {logsStatus === 'failed' && (
        <p className='text-center py-6 text-error'>
          Failed to load logs: {logsError}
        </p>
      )}

      <div className='overflow-x-auto bg-neutral rounded-xl shadow-md border border-primary mb-6'>
        <table className='min-w-full divide-y divide-primary'>
          <thead className='bg-primary/10'>
            <tr>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                Action
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                User ID
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                Blog ID
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                User Agent
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                IP
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                Details
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                Created At
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-primary'>
            {logs.length === 0 && (
              <tr>
                <td colSpan='7' className='text-center py-6 text-secondary'>
                  No logs to display.
                </td>
              </tr>
            )}
            {logs.map((log, idx) => {
              const logId = log._id || log.id || `log-${idx}`;
              return (
                <tr key={logId} className='hover:bg-primary transition-colors'>
                  <td className='px-6 py-4 whitespace-nowrap'>{log.action}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{log.userId}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {log.blogId || '-'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {log.userAgent || '-'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {log.ip || '-'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className='flex justify-between items-center max-w-sm mx-auto'>
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className='btn-secondary'
        >
          Previous
        </button>
        <span className='text-secondary font-semibold'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className='btn-secondary'
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default LogsTable;

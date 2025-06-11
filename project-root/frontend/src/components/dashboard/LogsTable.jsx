import React from 'react';

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
        <div className='text-center py-6'>
          <div className='loader mx-auto mb-2' />
          Loading logs...
        </div>
      )}

      {logsStatus === 'failed' && (
        <p className='text-center py-6 text-error'>
          Failed to load logs: {logsError}
        </p>
      )}

      <div className='overflow-x-auto bg-neutral rounded-xl shadow-md border border-primary mb-6'>
        <table className='min-w-full divide-y divide-primary table-auto'>
          <thead className='bg-primary/10'>
            <tr>
              <th className='px-4 py-3 text-left text-sm font-semibold text-primary w-1/4'>
                Action
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-primary w-1/4'>
                Message
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-primary w-1/5'>
                User Agent
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-primary w-1/6'>
                IP
              </th>
              <th className='px-4 py-3 text-left text-sm font-semibold text-primary w-1/6'>
                Created At
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-primary'>
            {logs.length === 0 && (
              <tr>
                <td colSpan='5' className='text-center py-6 text-secondary'>
                  No logs to display.
                </td>
              </tr>
            )}
            {logs.map((log, idx) => {
              const logId = log._id || log.id || `log-${idx}`;

              return (
                <tr key={logId} className='hover:bg-primary transition-colors'>
                  <td className='px-4 py-3 whitespace-nowrap font-semibold'>
                    {log.action || 'N/A'}
                  </td>
                  <td
                    className='px-4 py-3 whitespace-nowrap'
                    title={log.details ? JSON.stringify(log.details) : ''}
                  >
                    {log.message || '-'}
                  </td>
                  <td
                    className='px-4 py-3 whitespace-nowrap truncate max-w-xs'
                    title={log.userAgent || ''}
                  >
                    {log.userAgent || '-'}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {log.ip || '-'}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
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
          aria-label='Previous Page'
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
          aria-label='Next Page'
        >
          Next
        </button>
      </div>

      {/* Loader CSS */}
      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default LogsTable;

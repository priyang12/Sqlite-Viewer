/**
 * Loading component displays a spinner indicating that content is loading.
 * @example
 * // Usage in JSX:
 * <Loading />
 * @returns {JSX.Element} Loading spinner component.
 */
const Loading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <span className="loading loading-spinner loading-lg text-info"></span>
    </div>
  );
};

export default Loading;

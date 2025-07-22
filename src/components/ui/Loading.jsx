import { motion } from "framer-motion";

const LoadingSkeleton = ({ className = "" }) => (
  <motion.div
    className={`bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  />
);

const Loading = ({ type = "cards" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-card">
            <div className="flex items-center space-x-4">
              <LoadingSkeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <LoadingSkeleton className="h-4 w-1/3" />
                <LoadingSkeleton className="h-3 w-1/2" />
              </div>
              <div className="space-y-2">
                <LoadingSkeleton className="h-4 w-20" />
                <LoadingSkeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <LoadingSkeleton className="w-8 h-8 rounded-lg" />
                  <LoadingSkeleton className="w-16 h-6 rounded-full" />
                </div>
                <LoadingSkeleton className="h-8 w-20" />
                <LoadingSkeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-card">
          <LoadingSkeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <LoadingSkeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <LoadingSkeleton className="h-4 w-1/3" />
                  <LoadingSkeleton className="h-3 w-1/2" />
                </div>
                <LoadingSkeleton className="w-20 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default cards loading
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-white rounded-xl p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <div className="flex items-center space-x-4">
            <LoadingSkeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-3">
              <LoadingSkeleton className="h-4 w-3/4" />
              <LoadingSkeleton className="h-3 w-1/2" />
              <LoadingSkeleton className="h-3 w-2/3" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <LoadingSkeleton className="h-3 w-full" />
            <LoadingSkeleton className="h-3 w-4/5" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;
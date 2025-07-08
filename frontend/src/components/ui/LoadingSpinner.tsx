// src/components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
  }
  
  const LoadingSpinner = ({ 
    size = 'md', 
    text = 'Memuat...', 
    fullScreen = true 
  }: LoadingSpinnerProps) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
  
    const spinnerContent = (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
        {text && (
          <p className="text-gray-600 text-sm font-medium">{text}</p>
        )}
      </div>
    );
  
    if (fullScreen) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          {spinnerContent}
        </div>
      );
    }
  
    return spinnerContent;
  };
  
  export default LoadingSpinner;
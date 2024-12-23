import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: number;
  className?: string;
}

export const Loading = ({ size = 24, className = '' }: LoadingProps) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 className="animate-spin" size={size} />
  </div>
);

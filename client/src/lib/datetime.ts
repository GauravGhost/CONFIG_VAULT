import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow } from 'date-fns';

const now = new Date();
export const getCurrentDateTime = format(now, 'yyyy-MM-dd HH:mm:ss');
export const getCurrentDate = format(now, 'yyyy-MM-dd');
export const getCurrentTime = format(now, 'HH:mm:ss');

export type DateFormatType = 
  | 'elegant' 
  | 'casual' 
  | 'formal' 
  | 'compact' 
  | 'relative' 
  | 'iso' 
  | 'readable'
  | 'timestamp'
  | 'friendly';

/**
 * Format a date string or Date object into various beautiful formats
 * @param dateString - ISO date string or Date object
 * @param type - Format type (default: 'elegant')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | Date, 
  type: DateFormatType = 'elegant'
): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  switch (type) {
    case 'elegant':
      return format(date, 'MMMM do, yyyy');

    case 'casual':
      return format(date, 'MMM dd, yyyy • h:mm a');

    case 'formal':
      return format(date, 'EEEE, MMMM do, yyyy at h:mm a');

    case 'compact':
      return format(date, 'dd/MM/yy');

    case 'relative':
      return formatDistanceToNow(date, { addSuffix: true });

    case 'iso':
      return format(date, 'yyyy-MM-dd');

    case 'readable':
      return format(date, 'EEEE, MMM dd');

    case 'timestamp':
      return format(date, 'yyyy-MM-dd HH:mm:ss');

    case 'friendly':
      if (isToday(date)) return `Today at ${format(date, 'HH:mm')}`;
      if (isYesterday(date)) return `Yesterday at ${format(date, 'HH:mm')}`;
      if (isTomorrow(date)) return `Tomorrow at ${format(date, 'HH:mm')}`;
      return format(date, 'MMM d, yyyy');

    default:
      return format(date, 'PPP');
  }
};

/**
 * Get a human-friendly relative time
 * @param dateString - ISO date string or Date object
 * @returns Relative time string (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (dateString: string | Date): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

/**
 * Format date for different contexts
 */
export const formatters = {
  card: (date: string | Date) => formatDate(date, 'elegant'),
  
  timestamp: (date: string | Date) => formatDate(date, 'casual'),
  
  document: (date: string | Date) => formatDate(date, 'formal'),
  
  filename: (date: string | Date) => format(new Date(date), 'yyyy-MM-dd_HH-mm-ss'),
  
  chat: (date: string | Date) => formatDate(date, 'friendly'),
  
  api: (date: string | Date) => formatDate(date, 'iso'),
};
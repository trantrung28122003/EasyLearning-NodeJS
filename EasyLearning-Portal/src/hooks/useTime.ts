const getToday = () => {
  const date = new Date();
  return date.toISOString().slice(0, 10);
};


const getTimeAgo = (dateCreate: string): string => {
  const currentDate = new Date();
  const createdDate = new Date(dateCreate);
  const diffInMs = currentDate.getTime() - createdDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays >= 1) {
    return `${diffInDays} ngày trước`;
  } else if (diffInHours >= 1) {
    return `${diffInHours} giờ trước`;
  } else if (diffInMinutes >= 1) {
    return `${diffInMinutes} phút trước`;
  } else {
    return "Vừa xong";
  }
};

const convertSecondsToTime = (seconds: number): string => {
  const totalSeconds = Math.floor(seconds); 
  const hrs = Math.floor(totalSeconds / 3600); 
  const mins = Math.floor((totalSeconds % 3600) / 60); 
  const secs = totalSeconds % 60; 
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};


const formatDateVN = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
  };
  return date.toLocaleDateString('vi-VN', options); 
};

export { getToday , getTimeAgo, convertSecondsToTime, formatDateVN};

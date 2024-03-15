export const formatTime = (dateTimeString) => {
  const currentTime = new Date();
  const time = new Date(dateTimeString);
  const difference = currentTime - time;
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference / (1000 * 60)) % 60);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  } else if (hours > 0) {
    return `${hours} giờ `;
  } else if (minutes > 0) {
    return `${minutes} phút trước`;
  } else {
    return "Vừa xong";
  }
};

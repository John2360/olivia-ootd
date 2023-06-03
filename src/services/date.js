export const formatDateToString = (date) => {
  const realDate = new Date(date);
  const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formattedDate = `${months[realDate.getMonth()]} ${realDate.getDate()} (${days[realDate.getDay()]})`;

  return formattedDate;
}

export const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const meridiem = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}${meridiem}`;
}

export const getTimeDifference = (targetDate) => {
  const currentDate = new Date();
  const timeDifference = targetDate - currentDate;

  const isPast = timeDifference < 0;
  const absTimeDifference = Math.abs(timeDifference);

  const days = Math.floor(absTimeDifference / (1000 * 60 * 60 * 24));
  const minutes = Math.floor((absTimeDifference / (1000 * 60)) % 60);
  const hours = Math.floor((absTimeDifference / (1000 * 60 * 60)) % 24);

  let timeString = '';

  if (isPast && days > 0) {
    timeString += `${days}d `;
  }

  if (hours > 0) {
    timeString += `${hours}h `;
  }

  if (minutes > 0) {
    timeString += `${minutes}m`;
  }

  return timeString;
}

export const convertToEST = (date) => {
  const updatedDate = new Date(date);
  updatedDate.setUTCHours(updatedDate.getUTCHours() - 4);
  return updatedDate;
}
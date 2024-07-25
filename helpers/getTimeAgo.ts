// 2024-07-21T10:41:02Z bu tarz bir date işleminin ne kadar süre önce olduğunu gösteren bir fonksiyon yaz

export const getTimeAgo = (date: string) => {
  const currentDate = new Date();
  const givenDate = new Date(date);
  const diff = currentDate.getTime() - givenDate.getTime();
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30;
  const years = months / 12;

  if (years >= 1) {
    return `${Math.floor(years)} years ago`;
  } else if (months >= 1) {
    return `${Math.floor(months)} month ago`;
  } else if (days >= 1) {
    return `${Math.floor(days)} days ago`;
  } else if (hours >= 1) {
    return `${Math.floor(hours)} hours ago`;
  } else if (minutes >= 1) {
    return `${Math.floor(minutes)} minutes ago`;
  } else {
    return `${Math.floor(seconds)} seconds ago`;
  }
};

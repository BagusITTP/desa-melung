const formatDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

  const formattedDate = date ? new Date(date).toLocaleDateString('id-ID', options) : null;

  if (formattedDate) {
    const hour = new Date(date).getHours();
    let timeOfDay;

    if (hour < 12) {
      timeOfDay = "pagi";
    } else if (hour < 18) {
      timeOfDay = "siang";
    } else {
      timeOfDay = "malam";
    }

    return `${formattedDate}, ${timeOfDay}`;
  }

  return formattedDate;
};

export default formatDate;
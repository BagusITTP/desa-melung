const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const formatDate = (date) => {
  const formattedDate = new Date(date)?.toLocaleDateString("id-Id", options);

  if (formattedDate) {
    const hour = new Date(date).getUTCHours();
    const minute = new Date(date).getUTCMinutes();
    let timeOfDay;

    if (hour < 12) {
      timeOfDay = "pagi";
    } else if (hour < 18) {
      timeOfDay = "siang";
    } else {
      timeOfDay = "malam";
    }

    return `${formattedDate}, ${hour}:${minute} ${timeOfDay}`;
  }

  return formattedDate;
};

export default formatDate;
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formatDate = (date) => {
  return new Date(date)?.toLocaleDateString("id-Id", options)
}

export default formatDate
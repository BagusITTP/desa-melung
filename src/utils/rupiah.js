const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",

  }).format(number).replace(/,00$/, '');
}

export default rupiah
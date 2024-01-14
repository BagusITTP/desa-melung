const numberFormat = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

const rupiah = (number) => {
  if (number === 0) {
    return "Rp0";
  }
  return numberFormat.format(number).replace(/,00$/, '');
}

export default rupiah
// Show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show alert

// Update Cart
const tableCart = document.querySelector("[table-cart]");
if(tableCart){
  const inputQuantity = tableCart.querySelectorAll("input[name='quantity']");
  inputQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("item-id");
      const quantity = input.value;
      window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  }); 
}
// End Update Cart
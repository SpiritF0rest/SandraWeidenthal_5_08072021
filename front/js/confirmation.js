// Constants definition
const params = (new URL(document.location)).searchParams;
const orderId = params.get('orderId');
// Adding the order Id to the confirmation message
document.getElementById("orderId").textContent = orderId;
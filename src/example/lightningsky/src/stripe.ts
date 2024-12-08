import { invoke } from "@tauri-apps/api/core";
let stripe;
let elements;
let response;

window.getPaymentIntentWithoutSplits = async (amount, currency) => {
return;
  try {
    response = await invoke("get_payment_intent_without_splits", {amount, currency});
console.log('response is', response);
    
    stripe = Stripe(response.publishableKey);
    elements = stripe.elements({
      clientSecret: response.paymentIntent
    });

    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
  } catch(err) {
console.warn(err);
  }
};

const form = document.getElementById('payment-form');
const submitButton = document.getElementById('submit-button');
const errorMessage = document.getElementById('error-message');
const loadingMessage = document.getElementById('loading');


window.updateConfirmPayment = (tag, referrer = "") => {
  window.confirmPayment = async () => {
    try {
      const { error } = await stripe.confirmPayment({
	  elements,
	  confirmParams: {
	      return_url: `${window.location.origin}?foo=bar&teleportTag=${JSON.stringify(window.teleportTag)}`,
	  },
      });

      if(error) {
	showError(error.message);
      }
    } catch(err) {
      showError('An unexpected error occurred.');
  console.warn('Payment error:', error);
    }
  };
};


form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!stripe || !elements) {
    return;
  }

  // Disable form submission while processing
  setLoading(true);

  await confirmPayment();

  setLoading(false);
});

const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  setTimeout(() => {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
  }, 5000);
}

const setLoading = (isLoading) => {
  submitButton.disabled = isLoading;
  loadingMessage.style.display = isLoading ? 'block' : 'none';
}

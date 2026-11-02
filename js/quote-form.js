const form = document.querySelector("#quote-form");
if (form) {
  const steps = [...form.querySelectorAll(".quote-step")];
  const back = document.querySelector("#quote-back");
  const next = document.querySelector("#quote-next");
  const submit = document.querySelector("#quote-submit");
  const progress = document.querySelector("#step-progress");
  const label = document.querySelector("#step-label");
  const percent = document.querySelector("#step-percent");
  const status = document.querySelector("#form-status");
  const review = document.querySelector("#quote-review");
  const dateInput = document.querySelector("#move-date");
  let current = 1;

  if (dateInput) {
    const today = new Date();
    dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  const field = (name) => form.elements.namedItem(name);
  const value = (name) => (field(name)?.value || "").trim();
  const errorNode = (step) => form.querySelector(`[data-error="step${step}"]`);
  const setError = (step, message = "") => { const node = errorNode(step); if (node) node.textContent = message; };

  function validateStep(step) {
    setError(step);
    if (step === 1) {
      if (!field("moveType").value) return setError(step, "Please choose the type of move."), false;
      if (!value("origin") || !value("destination")) return setError(step, "Please enter both your starting point and destination."), false;
    }
    if (step === 2 && !value("homeSize")) return setError(step, "Please select the size of your move."), false;
    if (step === 3) {
      if (!value("moveDate") || !value("name") || !value("email")) return setError(step, "Please complete the required date and contact fields."), false;
      if (!field("email").checkValidity()) return setError(step, "Please enter a valid email address."), false;
      if (dateInput.value && dateInput.min && dateInput.value < dateInput.min) return setError(step, "Please choose today or a future date."), false;
    }
    if (step === 4 && !field("consent").checked) return setError(step, "Please confirm that we may use these details to respond to your enquiry."), false;
    return true;
  }

  function showStep(step) {
    current = step;
    steps.forEach((item) => item.classList.toggle("is-active", Number(item.dataset.step) === step));
    const value = step * 25;
    progress.style.width = `${value}%`;
    label.textContent = `STEP ${step} OF 4`;
    percent.textContent = `${value}%`;
    back.disabled = step === 1;
    next.hidden = step === 4;
    submit.hidden = step !== 4;
    status.textContent = "";
    status.className = "form-status";
    if (step === 4) renderReview();
  }

  function renderReview() {
    const entries = [
      ["Move type", field("moveType").value],
      ["Moving from", value("origin")],
      ["Moving to", value("destination")],
      ["Move size", value("homeSize")],
      ["Special details", value("specialItems") || "None provided"],
      ["Preferred date", value("moveDate")],
      ["Name", value("name")],
      ["Email", value("email")],
      ["Phone", value("phone") || "Not provided"]
    ];
    review.innerHTML = entries.map(([key, val]) => `<div class="review-item"><small>${escapeHTML(key)}</small><b>${escapeHTML(val)}</b></div>`).join("");
  }

  function escapeHTML(input) {
    return String(input).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  next.addEventListener("click", () => {
    if (validateStep(current)) showStep(Math.min(4, current + 1));
  });
  back.addEventListener("click", () => showStep(Math.max(1, current - 1)));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateStep(4)) return;
    submit.disabled = true;
    submit.textContent = "Sending…";
    status.textContent = "";
    const payload = Object.fromEntries(new FormData(form).entries());
    delete payload.consent;
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We couldn't send your enquiry right now. Please try again.");
      status.textContent = "Your enquiry has been sent. Thank you — the team will follow up using the details you provided.";
      status.className = "form-status is-success";
      form.reset();
      showStep(1);
    } catch (error) {
      status.textContent = error.message || "Something went wrong. Please try again.";
      status.className = "form-status is-error";
    } finally {
      submit.disabled = false;
      submit.innerHTML = 'Send enquiry <span>↗</span>';
    }
  });
}
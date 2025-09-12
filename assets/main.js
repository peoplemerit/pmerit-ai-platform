document.addEventListener("DOMContentLoaded", () => {
  // Toggle Virtual Human Mode
  document.getElementById("vhToggle")?.addEventListener("click", () => {
    document.getElementById("vhBadge").style.display = "inline-block";
    document.getElementById("vhStage").classList.toggle("hidden");
  });

  // Toggle Support Mode
  document.getElementById("supportToggle")?.addEventListener("click", () => {
    document.getElementById("supportBadge").style.display = "inline-block";
    document.getElementById("supportAssistantPane").classList.toggle("hidden");
  });

  // Dark Mode Toggle
  document.getElementById("darkToggle")?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  // Chat Input Counter
  const chatInput = document.getElementById("chatInput");
  const count = document.getElementById("count");
  chatInput?.addEventListener("input", () => {
    count.textContent = `${chatInput.value.length}/1000`;
  });
});

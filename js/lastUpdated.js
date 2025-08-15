document.addEventListener("DOMContentLoaded", () => {
  const lastUpdated = document.querySelector(".lastUpdated");
  const version = document.querySelector(".version");

  if (lastUpdated) {
    lastUpdated.innerHTML = "Last updated: 8/14/25";
    version.innerHTML = "Site Version 0.21";
  }
});

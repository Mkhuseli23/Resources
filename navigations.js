// Smooth Navigation Handling
document.querySelectorAll('.navigate').forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const targetPage = button.getAttribute('data-target');
    navigateToPage(targetPage);
  });
});

function navigateToPage(targetPage) {
  // Optionally you can add smooth animation here before navigation
  window.location.href = targetPage; // This will navigate to the target page
}

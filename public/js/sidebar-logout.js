// sidebar-logout.js
// Handles logout and session check for sidebar and dashboard

function getUserEmail() {
  // Try to get from localStorage (set on login)
  return localStorage.getItem('user_email');
}

function setUserEmail(email) {
  localStorage.setItem('user_email', email);
}

function clearUserEmail() {
  localStorage.removeItem('user_email');
}

// Attach logout handler to sidebar
function setupSidebarLogout() {
  const logoutBtn = document.getElementById('sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      const email = getUserEmail();
      if (email) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        clearUserEmail();
      }
      window.location.href = '/index.html';
    });
  }
}

// Check session on dashboard load
async function checkSessionOrRedirect() {
  const email = getUserEmail();
  if (!email) {
    window.location.href = '/login.html';
    return;
  }
  try {
    const res = await fetch('/api/check-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!data.success || !data.is_logged_in) {
      clearUserEmail();
      window.location.href = '/login.html';
    }
  } catch {
    window.location.href = '/login.html';
  }
}

// Export for use in dashboard and sidebar
window.setupSidebarLogout = setupSidebarLogout;
window.checkSessionOrRedirect = checkSessionOrRedirect;
window.setUserEmail = setUserEmail;

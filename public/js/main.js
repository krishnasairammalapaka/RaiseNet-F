// --- Login form logic ---
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const msg = document.getElementById('login-message');
      msg.textContent = '';
      msg.className = 'mt-3 text-sm text-center';
      if (email && pass) {
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
          });
          const data = await res.json();
          if (data.success) {
            if (window.setUserEmail) window.setUserEmail(data.email);
            msg.textContent = 'Login successful! Redirecting...';
            msg.className = 'mt-3 text-green-400 text-sm text-center';
            setTimeout(() => {
              if (data.role === 'admin') {
                window.location.href = '/admin-dashboard.html';
              } else {
                window.location.href = '/customer/dashboard.html';
              }
            }, 1000);
          } else {
            msg.textContent = data.error || 'Invalid credentials.';
            msg.className = 'mt-3 text-red-400 text-sm text-center';
          }
        } catch {
          msg.textContent = 'Server error. Try again.';
          msg.className = 'mt-3 text-red-400 text-sm text-center';
        }
      } else {
        msg.textContent = 'Please enter valid credentials.';
        msg.className = 'mt-3 text-red-400 text-sm text-center';
      }
    });
  }
});
// --- Register form logic ---
document.addEventListener('DOMContentLoaded', function () {
  // ...existing code...
  // Register form
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('register-email').value;
      const pass = document.getElementById('register-password').value;
      const pass2 = document.getElementById('register-password2').value;
      const msg = document.getElementById('register-message');
      msg.textContent = '';
      msg.className = 'mt-3 text-sm text-center';
      if (!email || !pass || !pass2) {
        msg.textContent = 'All fields are required.';
        msg.className = 'mt-3 text-red-400 text-sm text-center';
        return;
      }
      if (pass !== pass2) {
        msg.textContent = 'Passwords do not match.';
        msg.className = 'mt-3 text-red-400 text-sm text-center';
        return;
      }
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (data.success) {
          msg.textContent = 'Registration successful! You can now log in.';
          msg.className = 'mt-3 text-green-400 text-sm text-center';
          regForm.reset();
        } else {
          msg.textContent = data.error || 'Registration failed.';
          msg.className = 'mt-3 text-red-400 text-sm text-center';
        }
      } catch {
        msg.textContent = 'Server error. Try again.';
        msg.className = 'mt-3 text-red-400 text-sm text-center';
      }
    });
  }
});
// Smooth scroll to waitlist section
function scrollToWaitlist() {
  window.location.href = '/login.html';
}

// Placeholder wallet connect
function connectWallet() {
  window.location.href = '/login.html';
}

// Navbar mobile toggle (optional, for responsive)
function toggleMenu() {
  // Implement if you have a mobile menu
}

// Load featured projects from API
async function loadFeaturedProjects() {
  const grid = document.getElementById('featured-projects');
  if (!grid) return;
  grid.innerHTML = '<div class="text-center text-gray-400">Loading projects...</div>';
  try {
    const res = await fetch('/api/projects');
    const { data } = await res.json();
    grid.innerHTML = data.map(project => `
      <div class="bg-gray-900 rounded-xl p-6 shadow hover:shadow-cyan-900/30 transition flex flex-col">
        <div class="flex justify-between items-center mb-2">
          <span class="bg-cyan-900 text-cyan-400 px-2 py-0.5 rounded text-xs font-semibold">${project.chain}</span>
          <span class="bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-xs">${project.category}</span>
        </div>
        <h3 class="font-bold text-lg mb-1">${project.title}</h3>
        <div class="text-xs text-gray-400 mb-2">by <code>${project.creator}</code></div>
        <div class="mb-2">
          <div class="w-full bg-gray-700 h-2 rounded">
            <div class="bg-cyan-400 h-2 rounded" style="width:${Math.round((project.raised / project.goal) * 100)}%"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>$${project.raised.toLocaleString()} raised</span>
            <span>${Math.round((project.raised / project.goal) * 100)}%</span>
          </div>
        </div>
        <div class="flex justify-between text-xs text-gray-300 mb-2">
          <span>🎯 $${project.goal.toLocaleString()} goal</span>
          <span>👥 ${project.backers} backers</span>
          <span>⏳ ${project.daysLeft} days left</span>
        </div>
        <button class="border border-cyan-400 text-cyan-400 px-4 py-1 rounded hover:bg-cyan-900 mt-auto" onclick="alert('Connect wallet to fund!')">Fund Project</button>
      </div>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<div class="text-center text-red-400">Failed to load projects.</div>';
  }
}

// Waitlist form AJAX
document.addEventListener('DOMContentLoaded', function () {
  loadFeaturedProjects();
  const form = document.getElementById('waitlist-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('waitlist-email').value;
      const msg = document.getElementById('waitlist-message');
      msg.textContent = '';
      msg.className = 'waitlist-message mt-3 text-sm';
      try {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.success) {
          msg.textContent = data.message;
          msg.className = 'waitlist-message mt-3 text-green-400 text-sm';
          form.reset();
        } else {
          msg.textContent = data.error || 'Failed to join waitlist.';
          msg.className = 'waitlist-message mt-3 text-red-400 text-sm';
        }
      } catch {
        msg.textContent = 'Network error. Try again.';
        msg.className = 'waitlist-message mt-3 text-red-400 text-sm';
      }
    });
  }
});

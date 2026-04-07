// register.js

document.addEventListener('DOMContentLoaded', function () {
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

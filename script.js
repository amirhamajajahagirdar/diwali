(() => {
  const get = (id) => document.getElementById(id);
  const recipientInput = get('recipientInput');
  const recipientName = get('recipientName');
  const message = get('message');
  const signature = get('signature');
  const envelope = get('envelope');
  const card = get('greetingCard');
  const prompt = get('tapPrompt');
  const fireworks = get('fireworks');

  function cleanName(value) {
    return value.trim().replace(/[<>]/g, '').slice(0, 50);
  }

  function updateGreeting(value, updateUrl) {
    const enteredName = cleanName(value);
    const friend = DIWALI_CONFIG.friends[enteredName.toLowerCase()];
    const displayName = friend ? friend.name : (enteredName || 'Dear friend');
    const greeting = friend
      ? friend.message
      : DIWALI_CONFIG.fallbackMessage.replace('{name}', displayName);

    recipientName.textContent = displayName;
    message.textContent = greeting;
    signature.textContent = DIWALI_CONFIG.sender;
    recipientInput.value = enteredName;
    document.title = `Happy Diwali, ${displayName} ✨`;

    card.hidden = true;
    card.classList.remove('is-visible');
    envelope.classList.remove('is-open');
    envelope.setAttribute('aria-expanded', 'false');
    prompt.hidden = false;

    if (updateUrl) {
      const url = new URL(window.location.href);
      enteredName ? url.searchParams.set('to', enteredName) : url.searchParams.delete('to');
      window.history.replaceState({}, '', url);
    }
  }

  function openLetter() {
    envelope.classList.add('is-open');
    envelope.setAttribute('aria-expanded', 'true');
    prompt.hidden = true;
    card.hidden = false;
    window.requestAnimationFrame(() => card.classList.add('is-visible'));
  }

  function createFirework(x, y) {
    const colors = ['#ffd166', '#ff7b54', '#ff4f87', '#fff4bd'];
    for (let index = 0; index < 42; index += 1) {
      const particle = document.createElement('i');
      const angle = (Math.PI * 2 * index) / 42;
      const distance = 35 + Math.random() * 110;
      particle.className = 'spark';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
      particle.style.backgroundColor = colors[index % colors.length];
      fireworks.append(particle);
      window.setTimeout(() => particle.remove(), 1100);
    }
  }

  get('showGreeting').addEventListener('click', () => updateGreeting(recipientInput.value, true));
  recipientInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      updateGreeting(recipientInput.value, true);
    }
  });
  envelope.addEventListener('click', openLetter);
  get('celebrate').addEventListener('click', () => {
    for (let index = 0; index < 3; index += 1) {
      window.setTimeout(() => createFirework(window.innerWidth * (0.25 + Math.random() * 0.5), window.innerHeight * (0.18 + Math.random() * 0.3)), index * 230);
    }
  });

  for (let index = 0; index < 80; index += 1) {
    const star = document.createElement('i');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    get('stars').append(star);
  }

  updateGreeting(new URLSearchParams(window.location.search).get('to') || '', false);
})();

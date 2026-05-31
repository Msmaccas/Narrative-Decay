async function fetchJSON(path: string) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return await res.json();
}

function renderThesisList(theses: any[]) {
  const list = document.getElementById('thesis-list') as HTMLUListElement;
  list.innerHTML = '';
  theses.forEach((t) => {
    const li = document.createElement('li');
    li.textContent = `${t.title}`;
    const span = document.createElement('span');
    span.className = 'state';
    span.textContent = ` (${t.state})`;
    li.appendChild(span);
    li.onclick = () => loadThesis(t.id);
    list.appendChild(li);
  });
}

async function loadTheses() {
  const data = await fetchJSON('/theses');
  renderThesisList(data);
}

async function loadThesis(id: string) {
  const data = await fetchJSON(`/thesis/${id}`);
  const title = document.getElementById('thesis-title') as HTMLElement;
  const state = document.getElementById('thesis-state') as HTMLElement;
  const evidenceList = document.getElementById('evidence-list') as HTMLUListElement;
  title.textContent = data.thesis.title;
  state.textContent = `Current state: ${data.thesis.state}`;
  evidenceList.innerHTML = '';
  data.evidence.forEach((ev: any) => {
    const li = document.createElement('li');
    li.textContent = `${ev.timestamp}: ${ev.content} (${ev.supports ? 'support' : 'contradict'})`;
    evidenceList.appendChild(li);
  });
}

async function triggerUpdate() {
  await fetch('/update', { method: 'POST' });
  await loadTheses();
  await loadSummary();
}

function init() {
  loadTheses();
  loadSummary();
  const refresh = document.getElementById('refresh') as HTMLButtonElement;
  refresh.onclick = () => {
    triggerUpdate().catch((err) => console.error(err));
  };
}

async function loadSummary() {
  // fetch summary counts and update UI
  try {
    const data = await fetchJSON('/summary');
    (document.getElementById('count-new') as HTMLElement).textContent = String(data.new.length);
    (document.getElementById('count-decaying') as HTMLElement).textContent = String(data.decaying.length);
    (document.getElementById('count-inconsistent') as HTMLElement).textContent = String(data.inconsistent.length);
  } catch (err) {
    console.error(err);
  }
}

init();
const matn = document.getElementById('matn');
const zaman = document.getElementById('zaman');
const dokme = document.getElementById('dokme');
const list = document.getElementById('list');
const titr = document.getElementById('titr');
const shomarande = document.getElementById('shomarande');

let yadavarha = JSON.parse(localStorage.getItem('yadavarha')) || [
  { neveshte: 'خرید نان', anjam: false },
  { neveshte: 'تماس با مامان', anjam: false }
];

function zakhire() {
  localStorage.setItem('yadavarha', JSON.stringify(yadavarha));
  beruzShomarande();
}

function beruzShomarande() {
  let tedad = 0;

  for (const yadavar of yadavarha) {
    if (yadavar.anjam === false) {
      tedad = tedad + 1;
    }
  }

  if (tedad === 0) {
    shomarande.textContent = 'همه کارها انجام شد!';
  } else {
    shomarande.textContent = tedad + ' یادآور انجام نشده';
  }
}

function sakhtYadavar(yadavar) {
  const li = document.createElement('li');
  if (yadavar.anjam) {
    li.classList.add('done');
  }

  const span = document.createElement('span');
  span.textContent = yadavar.neveshte;
  li.appendChild(span);

  if (yadavar.zaman) {
    const tarikh = document.createElement('small');
    tarikh.className = 'tarikh';
    tarikh.textContent = new Date(yadavar.zaman).toLocaleString('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    span.appendChild(tarikh);

    if (new Date(yadavar.zaman) < new Date() && yadavar.anjam === false) {
      li.classList.add('aghab');
    }
  }

    const dokmeha = document.createElement('div');
  dokmeha.className = 'dokmeha';
  li.appendChild(dokmeha);

  const virayesh = document.createElement('button');
  virayesh.textContent = '✎';
  virayesh.className = 'virayesh';
  dokmeha.appendChild(virayesh);

  const hazf = document.createElement('button');
  hazf.textContent = '×';
  hazf.className = 'hazf';
  dokmeha.appendChild(hazf);

  virayesh.onclick = function () {
    const jadid = prompt('متن جدید یادآور:', yadavar.neveshte);

    if (jadid === null || jadid.trim() === '') {
      return;
    }

    yadavar.neveshte = jadid.trim();
    zakhire();
    namayesh();
  };

  span.onclick = function () {
    yadavar.anjam = !yadavar.anjam;
    li.classList.toggle('done');
    zakhire();
  };

  hazf.onclick = function () {
    if (confirm('مطمئنی؟')) {
      const jaye = yadavarha.indexOf(yadavar);
      yadavarha.splice(jaye, 1);
      li.remove();
      zakhire();
    }
  };

  list.appendChild(li);
}

function namayesh() {
  list.innerHTML = '';
  for (const yadavar of yadavarha) {
    sakhtYadavar(yadavar);
  }
}

namayesh();
beruzShomarande();

dokme.onclick = function () {
  const neveshte = matn.value;

  if (neveshte === '') {
    alert('اول یک چیزی بنویس!');
    return;
  }

  const yadavarJadid = {
    neveshte: neveshte,
    anjam: false,
    zaman: zaman.value
  };
  yadavarha.push(yadavarJadid);
  zakhire();
  sakhtYadavar(yadavarJadid);

  matn.value = '';
  zaman.value = '';
  titr.textContent = 'یک یادآور اضافه شد!';
};

function barresiZaman() {
  const alan = new Date();

  for (const yadavar of yadavarha) {
    if (yadavar.zaman && yadavar.anjam === false && !yadavar.ehtarDade) {
      if (new Date(yadavar.zaman) <= alan) {
        yadavar.ehtarDade = true;
        zakhire();
        namayesh();
        alert('⏰ وقتشه: ' + yadavar.neveshte);
      }
    }
  }
}

barresiZaman();
setInterval(barresiZaman, 10000);

const DB_NAME='fire-report-db',STORE='reports';let db,evidence={},editingId=null;const $=id=>document.getElementById(id);const keys=['mapPhoto','north','east','south','west','above','below'];function openDB(){return new Promise((r,j)=>{const q=indexedDB.open(DB_NAME,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains(STORE))q.result.createObjectStore(STORE,{keyPath:'id'})};q.onsuccess=()=>{db=q.result;r(db)};q.onerror=()=>j(q.error)})}function all(){return new Promise((r,j)=>{const q=db.transaction(STORE).objectStore(STORE).getAll();q.onsuccess=()=>r(q.result.sort((a,b)=>b.created-a.created));q.onerror=()=>j(q.error)})}function save(x){return new Promise((r,j)=>{const q=db.transaction(STORE,'readwrite').objectStore(STORE).put(x);q.onsuccess=()=>r();q.onerror=()=>j(q.error)})}function remove(id){return new Promise((r,j)=>{const q=db.transaction(STORE,'readwrite').objectStore(STORE).delete(id);q.onsuccess=()=>r();q.onerror=()=>j(q.error)})}function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function readFile(f){return new Promise((r,j)=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.onerror=j;fr.readAsDataURL(f)})}function switchTab(id){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id));if(id==='records')render()}document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));function setToday(){const d=new Date(),local=new Date(d-d.getTimezoneOffset()*60000).toISOString().slice(0,10);$('eventDate').value=local;$('eventTime').value=d.toTimeString().slice(0,5);setDay()}function setDay(){if($('eventDate').value){const d=new Date($('eventDate').value+'T12:00:00');$('eventDay').value=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][d.getDay()]}}$('eventDate').onchange=setDay;setToday();
for(const id of keys){$(id).onchange=async e=>{const f=e.target.files[0];if(!f){evidence[id]=null;return}if(f.size>8*1024*1024){alert('Ukuran foto maksimal 8 MB');e.target.value='';return}evidence[id]=await readFile(f);const target=id==='mapPhoto'?'mapPreview':'prev-'+id;$(target).innerHTML='<img src="'+evidence[id]+'">'}}
$('gps').onclick=()=>{if(!navigator.geolocation){alert('GPS tidak tersedia');return}$('gps').textContent='Mengambil...';navigator.geolocation.getCurrentPosition(p=>{$('coordinates').value=p.coords.latitude.toFixed(6)+', '+p.coords.longitude.toFixed(6);$('gps').textContent='Ambil GPS'},e=>{alert(e.message);$('gps').textContent='Ambil GPS'},{enableHighAccuracy:true,timeout:15000})};
$('reportForm').onsubmit=async e=>{e.preventDefault();const old=editingId?(await all()).find(z=>z.id===editingId):null;const x={...(old||{}),id:editingId||crypto.randomUUID(),created:old?.created||Date.now(),docNo:$('docNo').value,effective:$('effective').value,revision:$('revision').value,reportNo:$('reportNo').value,status:$('status').value,eventDate:$('eventDate').value,eventDay:$('eventDay').value,eventTime:$('eventTime').value,eventLocation:$('eventLocation').value,initial:$('initial').value,response:$('response').value,condition:$('condition').value,coordinates:$('coordinates').value,preparedName:$('preparedName').value,preparedTitle:$('preparedTitle').value,approvedName:$('approvedName').value,approvedTitle:$('approvedTitle').value,evidence:{...evidence}};try{await save(x);$('formMessage').textContent='Laporan berhasil disimpan.';e.target.reset();editingId=null;$('reportForm').querySelector('[type=submit]').textContent='Simpan Laporan';evidence={};keys.forEach(id=>{const t=id==='mapPhoto'?'mapPreview':'prev-'+id;$(t).innerHTML=''});setToday();renderSummary()}catch(err){$('formMessage').textContent='Gagal menyimpan: '+err.message}};
async function renderSummary(){const a=await all();$('total').textContent=a.length;$('controlled').textContent=a.filter(x=>x.status==='Terkendali').length;$('emergency').textContent=a.filter(x=>x.status==='Darurat').length}
async function render(){const q=$('search').value.toLowerCase(),a=(await all()).filter(x=>[x.reportNo,x.eventLocation,x.initial,x.response,x.condition].join(' ').toLowerCase().includes(q));$('recordList').innerHTML=a.length?a.map(x=>'<article class="record"><h3>'+esc(x.reportNo||'Tanpa nomor')+' <span class="badge">'+esc(x.status)+'</span></h3><p>'+esc(x.eventDay||'')+', '+esc(x.eventDate||'')+' • '+esc(x.eventTime||'')+'</p><p>'+esc(x.eventLocation||'')+'</p><div class="record-actions"><button class="secondary" onclick="printOne(\''+x.id+'\')">PDF</button><button class="secondary" onclick="wordOne(\''+x.id+'\')">Word</button><button class="secondary" onclick="deleteOne(\''+x.id+'\')">Hapus</button></div></article>').join(''):'<p>Belum ada laporan.</p>'}
$('search').oninput=render;window.editOne=async id=>{const x=(await all()).find(z=>z.id===id);if(!x)return;editingId=id;['docNo','effective','revision','reportNo','status','eventDate','eventDay','eventTime','eventLocation','initial','response','condition','coordinates','preparedName','preparedTitle','approvedName','approvedTitle'].forEach(k=>$(k).value=x[k]||'');evidence={...(x.evidence||{})};keys.forEach(k=>{$(k).value='';$(k==='mapPhoto'?'mapPreview':'prev-'+k).innerHTML=evidence[k]?'<img src=\"'+evidence[k]+'\">':''});$('reportForm').querySelector('[type=submit]').textContent='Perbarui Laporan';$('formMessage').textContent='Mode edit laporan.';switchTab('form');window.scrollTo(0,0)};window.deleteOne=async id=>{if(confirm('Hapus laporan ini?')){await remove(id);render();renderSummary()}};
window.printOne=async id=>{const x=(await all()).find(z=>z.id===id);if(!x)return;const ev=x.evidence||{};const photo=(k)=>ev[k]?'<img src="'+ev[k]+'">':'<div class="empty-photo">Foto belum dilampirkan</div>';const header=n=>'<div class="doc-head"><b>FORMULIR</b><b>LAPORAN KEBAKARAN</b></div><table class="meta"><tr><th>No. Dokumen</th><td>'+esc(x.docNo)+'</td><th>Berlaku Mulai</th><td>'+esc(x.effective)+'</td></tr><tr><th>Edisi/Revisi</th><td>'+esc(x.revision)+'</td><th>Halaman</th><td>'+n+'/3</td></tr></table>';const w=window.open('','_blank');if(!w){alert('Izinkan pop-up untuk mencetak laporan');return}w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Laporan Kebakaran</title><style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font:10pt Arial;color:#111;margin:0}.page{width:100%;min-height:265mm;padding:4mm;border:1px solid #111;page-break-after:always;break-after:page;position:relative;overflow:visible}.page:last-child{page-break-after:auto;break-after:auto}.page3{page-break-before:auto;break-before:auto;}.doc-head{text-align:center;border:1px solid #111;margin-bottom:7mm}.doc-head b{display:block;padding:4px;border-bottom:1px solid #111}.doc-head b:last-child{border:0}.meta{width:100%;border-collapse:collapse;margin-bottom:3mm}.meta td,.meta th{border:1px solid #111;padding:5px;text-align:left}.meta th{white-space:nowrap}.section-title{font-weight:bold;border:1px solid #111;padding:5px;margin-top:4mm}.line{display:grid;grid-template-columns:9mm 45mm 1fr;padding:4px 2px}.chron-title{border:1px solid #111;padding:5px;font-weight:bold;margin-top:4mm}.chron-text{padding:5px 2px;line-height:1.35;white-space:pre-wrap;min-height:20mm}.approval{position:absolute;bottom:6mm;left:0.5mm;width:calc(100% - 1mm);display:grid;grid-template-columns:1fr 1fr;text-align:center}.approval div{border:1px solid #111}.approval b{display:block;border-bottom:1px solid #111;padding:4px}.approval .space{height:27mm}.approval .name{border-top:1px solid #111;padding:4px;min-height:8mm}.approval .title{padding:2px 4px 4px;min-height:6mm;font-size:9pt}.sub{font-weight:bold;margin:3mm 0 2mm}.coordinate-box{width:100%;min-height:14mm;border:1px solid #111;padding:4mm;margin:0 0 3mm;overflow-wrap:anywhere}.map{width:100%;}.map{height:55mm;border:1px solid #111;display:flex;align-items:center;justify-content:center}.map img{max-height:52mm;max-width:100%;object-fit:contain}.quad{display:grid;grid-template-columns:1fr 1fr}.cell{border:1px solid #111;text-align:center;height:53mm}.cell b{display:block;border-bottom:1px solid #111;padding:5px}.cell img{max-width:95%;height:43mm;object-fit:contain;margin:3px}.empty-photo{height:43mm;display:flex;align-items:center;justify-content:center;color:#999;font-size:9pt}.page3 .cell{height:112mm}.page3 .cell img{height:98mm}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>');
w.document.write('<section class="page">'+header(1)+'<div class="section-title">I &nbsp; PERISTIWA</div><div class="line"><b>1</b><b>Keadaan Darurat</b><span>'+esc(x.status)+'</span></div><div class="line"><b>2</b><b>Waktu Kejadian</b><span>'+esc(x.eventDay)+' , '+esc(x.eventDate)+' • '+esc(x.eventTime)+'</span></div><div class="line"><b>3</b><b>Lokasi Kejadian</b><span>'+esc(x.eventLocation)+'</span></div><div class="section-title">I &nbsp; KRONOLOGIS & KEMUNGKINAN BAHAYA LANJUTAN</div><div class="chron-title">a &nbsp; Awal diketahui kejadian kebakaran</div><div class="chron-text">'+esc(x.initial)+'</div><div class="chron-title">b &nbsp; Tindakan yang diambil</div><div class="chron-text">'+esc(x.response)+'</div><div class="chron-title">c &nbsp; Kondisi api saat ini dan kemungkinan dampak yang timbul</div><div class="chron-text">'+esc(x.condition)+'</div><div class="approval"><div><b>Dibuat oleh :</b><div class="space"></div><div class="name">'+esc(x.preparedName)+'</div><div class="title">'+esc(x.preparedTitle)+'</div></div><div><b>Diketahui oleh :</b><div class="space"></div><div class="name">'+esc(x.approvedName)+'</div><div class="title">'+esc(x.approvedTitle)+'</div></div></div></section>');
w.document.write('<section class="page">'+header(2)+'<div class="sub">Lampiran I. Koordinat Kebakaran</div><div class="sub">a. Koordinat Kebakaran</div><div class="coordinate-box">'+esc(x.coordinates)+'</div><div class="map">'+(ev.mapPhoto?photo('mapPhoto'):'Peta / screenshot lokasi belum dilampirkan')+'</div><div class="quad">'+['north','east','south','west'].map((k,i)=>'<div class="cell"><b>'+['Utara','Timur','Selatan','Barat'][i]+'</b>'+photo(k)+'</div>').join('')+'</div></section>');
w.document.write('<section class="page page3">'+header(3)+'<div class="quad">'+['above','below'].map((k,i)=>'<div class="cell"><b>'+['Atas','Bawah'][i]+'</b>'+photo(k)+'</div>').join('')+'</div></section><script>window.onload=()=>setTimeout(()=>window.print(),500)<\/script></body></html>');w.document.close()};

window.wordOne=async id=>{
  try{
    const x=(await all()).find(z=>z.id===id);if(!x)return;
    if(!window.docx||!docx.Document||!docx.Packer){alert('Mesin DOCX belum termuat. Pastikan aplikasi dibuka sekali saat online, lalu coba lagi.');return;}
    const D=docx, e=x.evidence||{};
    const border={style:D.BorderStyle.SINGLE,size:6,color:'222222'};
    const cell=(text,bold=false,width=4500)=>new D.TableCell({width:{size:width,type:D.WidthType.DXA},borders:{top:border,bottom:border,left:border,right:border},margins:{top:90,bottom:90,left:100,right:100},children:[new D.Paragraph({children:[new D.TextRun({text:String(text||'-'),bold,font:'Arial',size:20})]})]});
    const row=(a,b)=>new D.TableRow({children:[cell(a,true,3000),cell(b,false,6360)]});
    const table=rows=>new D.Table({width:{size:9360,type:D.WidthType.DXA},columnWidths:[3000,6360],rows,borders:{top:border,bottom:border,left:border,right:border,insideHorizontal:border,insideVertical:border}});
    const para=(text,bold=false,size=20,opts={})=>new D.Paragraph({spacing:{before:80,after:80},...opts,children:[new D.TextRun({text:String(text||'-'),bold,font:'Arial',size})]});
    const heading=t=>new D.Paragraph({spacing:{before:180,after:100},border:{bottom:{style:D.BorderStyle.SINGLE,size:6,color:'222222',space:4}},children:[new D.TextRun({text:t,bold:true,font:'Arial',size:22})]});
    const dataUri=(v)=>{const m=String(v||'').match(/^data:image\/(png|jpe?g|gif|webp);base64,([\s\S]+)$/i);if(!m)return null;const bin=atob(m[2]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return {data:u,type:m[1].toLowerCase()==='jpg'?'jpeg':m[1].toLowerCase()};};
    const photo=(key,label)=>{const im=dataUri(e[key]);if(!im)return new D.TableCell({children:[para(label,true),para('Foto belum dilampirkan',false,16)]});return new D.TableCell({children:[para(label,true),new D.Paragraph({alignment:D.AlignmentType.CENTER,children:[new D.ImageRun({data:im.data,transformation:{width:210,height:135},type:im.type})]})]});};
    const photoTable=(keys,labels)=>new D.Table({width:{size:9360,type:D.WidthType.DXA},columnWidths:[4680,4680],rows:[0,1].map(i=>new D.TableRow({children:[photo(keys[i*2],labels[i*2]),photo(keys[i*2+1],labels[i*2+1])]})),borders:{top:border,bottom:border,left:border,right:border,insideHorizontal:border,insideVertical:border}});
    const mapTable=()=>new D.Table({width:{size:9360,type:D.WidthType.DXA},rows:[new D.TableRow({children:[new D.TableCell({columnSpan:2,children:[para('Peta / screenshot lokasi',true),...(dataUri(e.mapPhoto)?[new D.Paragraph({alignment:D.AlignmentType.CENTER,children:[new D.ImageRun({data:dataUri(e.mapPhoto).data,transformation:{width:420,height:190},type:dataUri(e.mapPhoto).type})]})]:[para('Peta belum dilampirkan',false,16)])]})]})],borders:{top:border,bottom:border,left:border,right:border}});
    const head=(n)=>[para('FORMULIR LAPORAN KEBAKARAN',true,26,{alignment:D.AlignmentType.CENTER}),table([new D.TableRow({children:[cell('No. Dokumen: '+(x.docNo||'-')+' | Edisi/Revisi: '+(x.revision||'-')),cell('Berlaku Mulai: '+(x.effective||'-')+' | Halaman: '+n+'/3')]} )])];
    const children=[...head(1),heading('I. PERISTIWA'),table([row('Keadaan Darurat',x.status),row('Waktu Kejadian',[x.eventDay,x.eventDate,x.eventTime].filter(Boolean).join(' • ')),row('Lokasi Kejadian',x.eventLocation)]),heading('KRONOLOGIS & KEMUNGKINAN BAHAYA LANJUTAN'),para('a. Awal diketahui kejadian kebakaran',true),para(x.initial),para('b. Tindakan yang diambil',true),para(x.response),para('c. Kondisi api saat ini dan kemungkinan dampak',true),para(x.condition),new D.Paragraph({spacing:{before:450,after:100},children:[new D.TextRun({text:'Dibuat oleh: '+(x.preparedName||'-')+'                         Diketahui oleh: '+(x.approvedName||'-'),bold:true,font:'Arial',size:20})]}),para((x.preparedTitle||'')+'                                      '+(x.approvedTitle||''))];
    children.push(new D.Paragraph({children:[new D.PageBreak()]}),...head(2),heading('LAMPIRAN I. KOORDINAT KEBAKARAN'),para('a. Koordinat Kebakaran',true),table([new D.TableRow({children:[new D.TableCell({columnSpan:2,children:[para(x.coordinates||'-')]})]})]),mapTable(),photoTable(['north','east','south','west'],['Utara','Timur','Selatan','Barat']));
    children.push(new D.Paragraph({children:[new D.PageBreak()]}),...head(3),heading('LAMPIRAN II. FOTO TAMBAHAN'),photoTable(['above','below'],['Atas','Bawah']));
    const docObj=new D.Document({sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:650,right:650,bottom:650,left:650}}},children}]});
    const blob=await D.Packer.toBlob(docObj);
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Laporan-Kebakaran-'+(x.reportNo||'tanpa-nomor')+'.docx';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
    alert('File Word DOCX berhasil dibuat. Silakan buka dari folder Download.');
  }catch(err){console.error('Ekspor DOCX gagal:',err);alert('Ekspor DOCX gagal: '+(err.message||'Kesalahan tidak diketahui'));}
};
$('backupBtn').onclick=async()=>{const data=await all(),blob=new Blob([JSON.stringify({app:'Fire Report',version:2,exported:new Date().toISOString(),reports:data},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='fire-report-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(a.href);$('backupMessage').textContent='Backup berhasil dibuat.'};
$('restoreFile').onchange=async e=>{try{const d=JSON.parse(await e.target.files[0].text());if(!Array.isArray(d.reports))throw Error('Format backup tidak valid');if(!confirm('Pulihkan '+d.reports.length+' laporan?'))return;for(const x of d.reports)await save(x);$('backupMessage').textContent='Pemulihan selesai.';renderSummary()}catch(err){$('backupMessage').textContent='Gagal: '+err.message}e.target.value=''};
$('exportCsv').onclick=async()=>{const a=await all(),cols=['reportNo','status','eventDate','eventDay','eventTime','eventLocation','coordinates','initial','response','condition'],csv=[cols.join(';'),...a.map(x=>cols.map(k=>'"'+String(x[k]||'').replace(/"/g,'""')+'"').join(';'))].join('\n'),blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),el=document.createElement('a');el.href=URL.createObjectURL(blob);el.download='fire-report.csv';el.click();URL.revokeObjectURL(el.href)};
async function hashText(s){
  try{
    if(globalThis.crypto && crypto.subtle){
      const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
      return 'sha256:'+Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');
    }
  }catch(e){console.warn('SHA-256 tidak tersedia, gunakan fallback lokal',e)}
  let h=2166136261;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return 'local:'+ (h>>>0).toString(16);
}
function showApp(){
  $('loginScreen').hidden=true;
  $('appShell').hidden=false;
  loadCompany();
  if(db) renderSummary().catch(e=>console.error('Gagal memuat ringkasan',e));
}
window.startAccountRecovery=function(ev){
  if(ev){ev.preventDefault();ev.stopPropagation();}
  localStorage.removeItem('fireReportAccount');
  sessionStorage.removeItem('fireReportLoggedIn');
  const u=$('loginUser'),p=$('loginPass'),m=$('loginMessage');
  if(u)u.value='';if(p){p.value='';p.type='password';}if(m)m.textContent='';
  $('loginCaption').textContent='Buat akun administrator pertama kali';
  $('loginSubmit').innerHTML='BUAT AKUN <span>→</span>';
  $('loginScreen').hidden=false;$('appShell').hidden=true;
  return false;
};
function authInit(){
  const form=$('loginForm'),button=$('loginSubmit'),message=$('loginMessage');
  const refreshMode=()=>{
    const exists=!!localStorage.getItem('fireReportAccount');
    $('loginCaption').textContent=exists?'Masuk untuk melanjutkan':'Buat akun administrator pertama kali';
    button.innerHTML=exists?'MASUK <span>→</span>':'BUAT AKUN <span>→</span>';
  };
  refreshMode();
  const toggle=$('toggleLoginPassword');
  if(toggle){toggle.type='button';toggle.onclick=ev=>{ev.preventDefault();const field=$('loginPass'),show=field.type==='password';field.type=show?'text':'password';toggle.setAttribute('aria-label',show?'Sembunyikan kata sandi':'Tampilkan kata sandi');};}
  const status=$('loginConnection');
  const updateStatus=()=>{if(status)status.textContent=navigator.onLine?'ONLINE':'OFFLINE • DATA LOKAL AKTIF'};
  updateStatus();
  form.onsubmit=async e=>{
    e.preventDefault();
    message.textContent='';
    button.disabled=true;
    const username=$('loginUser').value.trim();
    const password=$('loginPass').value;
    try{
      if(!username){message.textContent='Username wajib diisi.';return;}
      const stored=localStorage.getItem('fireReportAccount');
      if(!stored){
        if(password.length<8){message.textContent='Password minimal 8 karakter.';return;}
        const account={username,hash:await hashText(password)};
        localStorage.setItem('fireReportAccount',JSON.stringify(account));
        const verify=JSON.parse(localStorage.getItem('fireReportAccount')||'null');
        if(!verify||verify.username!==username||verify.hash!==account.hash)throw new Error('Akun tidak berhasil disimpan di perangkat.');
        sessionStorage.setItem('fireReportLoggedIn','1');
        showApp();
        return;
      }
      const account=JSON.parse(stored);
      const enteredHash=await hashText(password);
      if(username===account.username && (enteredHash===account.hash || enteredHash.replace(/^sha256:/,'')===String(account.hash).replace(/^sha256:/,''))){
        sessionStorage.setItem('fireReportLoggedIn','1');
        showApp();
      }else{
        message.textContent='Username atau password tidak cocok. Periksa kembali atau gunakan Buat akun baru.';
      }
    }catch(err){
      console.error('Kesalahan login Fire Report:',err);
      message.textContent='Gagal memproses akun: '+(err.message||'Kesalahan perangkat');
    }finally{
      button.disabled=false;
      refreshMode();
    }
  };
  if(localStorage.getItem('fireReportAccount')&&sessionStorage.getItem('fireReportLoggedIn')==='1')showApp();
  else $('loginScreen').hidden=false;
}
$('logoutBtn').onclick=()=>{sessionStorage.removeItem('fireReportLoggedIn');$('appShell').hidden=true;$('loginScreen').hidden=false;$('loginPass').value=''};
let companyLogoData='';function loadCompany(){const x=JSON.parse(localStorage.getItem('fireReportCompany')||'{}');$('companyName').value=x.name||'';$('regionName').value=x.region||'';$('estateName').value=x.estate||'';companyLogoData=x.logo||'';$('logoPreview').innerHTML=companyLogoData?'<img src=\"'+companyLogoData+'\">':''}
$('companyLogo').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>3000000){alert('Logo maksimal 3 MB');return}companyLogoData=await readFile(f);$('logoPreview').innerHTML='<img src=\"'+companyLogoData+'\">'};
$('companyForm').onsubmit=e=>{e.preventDefault();localStorage.setItem('fireReportCompany',JSON.stringify({name:$('companyName').value,region:$('regionName').value,estate:$('estateName').value,logo:companyLogoData}));$('companyMessage').textContent='Identitas tersimpan.'};
$('accountForm').onsubmit=async e=>{e.preventDefault();const p=$('newPassword').value;if(p.length<8){$('accountMessage').textContent='Password minimal 8 karakter.';return}localStorage.setItem('fireReportAccount',JSON.stringify({username:$('newUsername').value.trim(),hash:await hashText(p)}));$('accountMessage').textContent='Akun diperbarui.';e.target.reset()};
// Explicit account recovery URL: clear only admin credentials; keep IndexedDB reports and company settings.
if(new URLSearchParams(location.search).get('setup')==='1'){localStorage.removeItem('fireReportAccount');sessionStorage.removeItem('fireReportLoggedIn');history.replaceState({},'',location.pathname);}
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));authInit();openDB().then(()=>{if($('appShell')&&!$('appShell').hidden)renderSummary();}).catch(e=>{console.error('Database gagal dibuka:',e);alert('Database laporan gagal dibuka: '+(e.message||'periksa izin penyimpanan browser'));});window.addEventListener('online',()=>{if($('connection'))$('connection').textContent='● Online';if($('loginConnection'))$('loginConnection').textContent='ONLINE'});window.addEventListener('offline',()=>{if($('connection'))$('connection').textContent='● Offline Ready';if($('loginConnection'))$('loginConnection').textContent='OFFLINE • DATA LOKAL AKTIF'});
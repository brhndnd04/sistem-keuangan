import { useState, useEffect, useMemo, useRef, useCallback } from "react";
const LOGO_IMG='data:image/png;base64,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';
import { loadData, saveData } from "./supabase";

const uid=()=>Math.random().toString(36).slice(2,10);
const fmtRp=(n)=>{if(n===0)return"Rp 0";return`${n<0?"- ":""}Rp ${Math.abs(n).toLocaleString("id-ID")}`};
const HARI=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BLN=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const fmtTgl=(d)=>`${HARI[d.getDay()]}, ${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`;
const fmtJam=(d)=>d.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
const fmtShort=(d)=>`${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`;
const NM=(v)=>{const n=parseInt(v);return isNaN(n)?0:n};
const curPer=()=>`${BLN[new Date().getMonth()]} ${new Date().getFullYear()}`;

const STATUS_LIST=["Belum Cair","Sudah Cair","Sudah Dilaporkan","Selesai"];
const stC=(s)=>({bg:s==="Belum Cair"?"#fff3e0":s==="Sudah Cair"?"#e3f2fd":s==="Sudah Dilaporkan"?"#ede7f6":"#e8f5e9",fg:s==="Belum Cair"?"#e67e22":s==="Sudah Cair"?"#2980b9":s==="Sudah Dilaporkan"?"#7c3aed":"#27ae60"});
const nxSt=(s)=>{const i=STATUS_LIST.indexOf(s);return i<3?STATUS_LIST[i+1]:null};
const nxLb=(s)=>{const n=nxSt(s);return n==="Sudah Cair"?"Cairkan":n==="Sudah Dilaporkan"?"Dilaporkan":n==="Selesai"?"Selesai":null};
function cP(p){const tr=p.pencairan.reduce((s,x)=>s+x.jumlah,0);const tc=p.pencairan.filter(x=>x.status!=="Belum Cair").reduce((s,x)=>s+x.jumlah,0);return{totalRencana:tr,totalCair:tc,sisaAlokasi:p.anggaran-tr,sisaAnggaran:p.anggaran-tc}}

function calcSlip(s){
  const gP=s.masukHari*s.gajiPerhari;
  const tPend=gP+s.lembur+s.tunjangan+s.bonus;
  const tPot=s.potKasbon+s.potMakan;
  return{gajiPokok:gP,totalPendapatan:tPend,totalPotongan:tPot,gajiBersih:tPend-tPot};
}
function mkSlip(){return{masukHari:0,lembur:0,gajiPerhari:0,tunjangan:0,bonus:0,potKasbon:0,potMakan:0,dibayarkan:0,periode:curPer()}}

const I={home:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,folder:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,users:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,shuffle:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>,list:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,logout:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,plus:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7.5" y1="2" x2="7.5" y2="13"/><line x1="2" y1="7.5" x2="13" y2="7.5"/></svg>,trash:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,edit:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,down:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7.5 3v9M4.5 9l3 3 3-3"/></svg>,up:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7.5 12V3M4.5 6l3-3 3 3"/></svg>,ret:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,menu:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,x:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,back:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,pdf:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,next:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,eye:(c="#1a3c34")=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,eyeOff:(c="#666")=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,slip:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="8" y1="3" x2="8" y2="21"/></svg>,search:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,print:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,save:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>,clock:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,cloud:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>,key:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,wallet:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/><circle cx="18" cy="15" r="1"/></svg>,gear:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00-.33-1.82V15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9c.09-.33.04-.68-.2-.94l-.06-.06a2 2 0 012.83-2.83l.06.06c.26.24.61.29.94.2H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51c.33.09.68.04.94-.2l.06-.06a2 2 0 012.83 2.83l-.06.06c-.24.26-.29.61-.2.94V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>};

const ACCTS=[{username:"admin",password:"admin123",nama:"Administrator",role:"Admin"},{username:"bendahara",password:"bend123",nama:"Bendahara RT",role:"Bendahara"}];

// ── Kebab Menu (3 dots) ──
function KebabMenu({items}){
  const[open,setOpen]=useState(false);const ref=useRef(null);
  useEffect(()=>{if(!open)return;const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h)},[open]);
  return(<div ref={ref} style={{position:"relative",display:"inline-flex"}}><button onClick={()=>setOpen(!open)} style={{background:"none",border:"none",cursor:"pointer",padding:"4px 6px",borderRadius:4,color:"#8b8baa",fontSize:18,lineHeight:1,fontWeight:700,letterSpacing:1}}>⋮</button>
    {open&&<div style={{position:"absolute",right:0,top:"100%",background:"#252540",borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",zIndex:200,minWidth:140,overflow:"hidden"}}>{items.map((it,i)=>(<button key={i} onClick={()=>{setOpen(false);it.onClick()}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 14px",border:"none",background:"none",cursor:"pointer",fontSize:12,fontWeight:500,color:it.danger?"#ff6b6b":"#ccc",borderBottom:i<items.length-1?"1px solid rgba(255,255,255,0.05)":"none",fontFamily:"inherit"}} onMouseEnter={e=>e.target.style.background="rgba(255,255,255,0.05)"} onMouseLeave={e=>e.target.style.background="none"}>{it.icon}{it.label}</button>))}</div>}
  </div>);
}

const defaultData=()=>({
  projects:[
    {id:uid(),name:"Renovasi Asrama Putra",anggaran:25000000,pencairan:[{id:uid(),tahap:1,jumlah:10000000,tgl:fmtShort(new Date(2026,0,15)),status:"Selesai",ket:"Material"},{id:uid(),tahap:2,jumlah:8000000,tgl:fmtShort(new Date(2026,2,1)),status:"Sudah Dilaporkan",ket:"Upah tukang"},{id:uid(),tahap:3,jumlah:4000000,tgl:fmtShort(new Date(2026,5,10)),status:"Sudah Cair",ket:"Cat"},{id:uid(),tahap:4,jumlah:3000000,tgl:"",status:"Belum Cair",ket:"Sisa"}]},
    {id:uid(),name:"Perbaikan Dapur",anggaran:12000000,pencairan:[{id:uid(),tahap:1,jumlah:6000000,tgl:fmtShort(new Date(2026,1,10)),status:"Sudah Cair",ket:"Peralatan"},{id:uid(),tahap:2,jumlah:6000000,tgl:"",status:"Belum Cair",ket:"Perbaikan"}]},
  ],
  employees:[
    {id:uid(),nama:"Ahmad Fauzi",jabatan:"Kepala Bagian",dep:"Rumah Tangga",gaji:3500000,status:"Aktif",telp:"0812-3456-7890",kasbon:500000,saldo:200000,slip:{masukHari:26,lembur:350000,gajiPerhari:115000,tunjangan:500000,bonus:200000,potKasbon:250000,potMakan:150000,periode:curPer()},logKasbon:[],riwayat:[]},
    {id:uid(),nama:"Siti Aminah",jabatan:"Staff Administrasi",dep:"Sekretariat",gaji:2800000,status:"Aktif",telp:"0813-5678-1234",kasbon:0,saldo:0,slip:mkSlip(),logKasbon:[],riwayat:[]},
    {id:uid(),nama:"Budi Santoso",jabatan:"Teknisi",dep:"Sarpras",gaji:3000000,status:"Aktif",telp:"0857-9012-3456",kasbon:300000,saldo:-150000,slip:{masukHari:25,gajiPerhari:100000,lembur:450000,tunjangan:350000,bonus:0,potKasbon:150000,potMakan:125000,periode:curPer()},logKasbon:[],riwayat:[]},
  ],
  loans:[],
  transactions:[],
  pengajuan:[],
  accounts:[...ACCTS],
});

// ── THEMES ──
const THEMES={
  dark:{id:"dark",name:"Gelap",nameEn:"Dark",emoji:"🌙",bg:"#0f0f1a",card:"#1a1a2e",cb:"rgba(255,255,255,0.05)",tx:"#e0e0f0",sub:"#8b8baa",mut:"#555",ac:"#6c63ff",acL:"#b8b2ff",acBg:"rgba(108,99,255,0.15)",gr:"linear-gradient(135deg,#6c63ff,#4834d4)",sA:"#12122a",sB:"#1a1a35",iBg:"#12122a",iBr:"rgba(255,255,255,0.08)"},
  light:{id:"light",name:"Terang",nameEn:"Light",emoji:"☀️",bg:"#f0f2f5",card:"#fff",cb:"#e5e5e5",tx:"#1a1a1a",sub:"#666",mut:"#bbb",ac:"#1a3c34",acL:"#2d6a5a",acBg:"rgba(26,60,52,0.08)",gr:"linear-gradient(135deg,#1a3c34,#2d6a5a)",sA:"#0f2b24",sB:"#1a3c34",iBg:"#fafbfc",iBr:"#ddd"},
  ocean:{id:"ocean",name:"Samudera",nameEn:"Ocean",emoji:"🌊",bg:"#0a1628",card:"#132238",cb:"rgba(255,255,255,0.06)",tx:"#e0ecf5",sub:"#6b8db5",mut:"#3a5575",ac:"#3b82f6",acL:"#93bbfd",acBg:"rgba(59,130,246,0.12)",gr:"linear-gradient(135deg,#3b82f6,#1d4ed8)",sA:"#081220",sB:"#0f1e33",iBg:"#0a1628",iBr:"rgba(255,255,255,0.08)"},
  emerald:{id:"emerald",name:"Zamrud",nameEn:"Emerald",emoji:"💎",bg:"#0a1a14",card:"#12291f",cb:"rgba(255,255,255,0.06)",tx:"#d0f0e0",sub:"#6baa8b",mut:"#3a6b55",ac:"#10b981",acL:"#6ee7b7",acBg:"rgba(16,185,129,0.12)",gr:"linear-gradient(135deg,#10b981,#059669)",sA:"#081510",sB:"#0f221a",iBg:"#0a1a14",iBr:"rgba(255,255,255,0.08)"},
  rose:{id:"rose",name:"Mawar",nameEn:"Rose",emoji:"🌹",bg:"#1a0f14",card:"#2e1a22",cb:"rgba(255,255,255,0.05)",tx:"#f0e0e5",sub:"#aa6b80",mut:"#6b3a4a",ac:"#f43f5e",acL:"#fda4af",acBg:"rgba(244,63,94,0.12)",gr:"linear-gradient(135deg,#f43f5e,#e11d48)",sA:"#150a10",sB:"#22121a",iBg:"#1a0f14",iBr:"rgba(255,255,255,0.08)"},
};
const LANG={
  id:{dashboard:"Dashboard",proyek:"Proyek",karyawan:"Karyawan",pengajuan:"Proyek Pengajuan",pinjaman:"Pinjaman",transaksi:"Transaksi",akun:"Kelola Akun",settings:"Pengaturan",selamat:"Selamat datang",tema:"Tema Tampilan",bahasa:"Bahasa",pilihTema:"Pilih tema favorit Anda",pilihBahasa:"Pilih bahasa antarmuka",simpan:"Simpan",batal:"Batal",tambah:"Tambah",hapus:"Hapus",edit:"Edit",cari:"Cari nama, jabatan, departemen...",masuk:"Masuk",keluar:"Keluar",memuat:"Memuat data...",menyimpan:"Menyimpan...",ringkasan:"Ringkasan Keuangan",aktif:"Aktif",total:"Total",saldo:"Saldo",catat:"Catat",riwayat:"Riwayat",pilihProyek:"Pilih Proyek",tAnggaran:"Total Anggaran",dicairkan:"Dicairkan",sisa:"Sisa",gajiBulan:"Total diterima/bulan"},
  en:{dashboard:"Dashboard",proyek:"Projects",karyawan:"Employees",pengajuan:"Submission Projects",pinjaman:"Loans",transaksi:"Transactions",akun:"Manage Accounts",settings:"Settings",selamat:"Welcome",tema:"Appearance",bahasa:"Language",pilihTema:"Choose your favorite theme",pilihBahasa:"Select interface language",simpan:"Save",batal:"Cancel",tambah:"Add",hapus:"Delete",edit:"Edit",cari:"Search name, position, department...",masuk:"Sign In",keluar:"Sign Out",memuat:"Loading data...",menyimpan:"Saving...",ringkasan:"Financial Summary",aktif:"Active",total:"Total",saldo:"Balance",catat:"Record",riwayat:"History",pilihProyek:"Select Project",tAnggaran:"Total Budget",dicairkan:"Disbursed",sisa:"Remaining",gajiBulan:"Total received/month"},
};
const mkCSS=(t)=>`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}input,select,button{font-family:inherit}input:focus,select:focus{outline:none;border-color:${t.ac}!important;box-shadow:0 0 0 3px ${t.acBg}}button:active{transform:scale(0.97)}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${t.mut};border-radius:8px}::-webkit-scrollbar-track{background:${t.card}}body{background:${t.bg}}`;

// ── PDF Slip ──
function printSlip(emp,s){const c=calcSlip(s);const sB=emp.saldo||0;const harusBayar=c.gajiBersih+sB;const dibayar=s.dibayarkan||0;const saldoBaru=harusBayar-dibayar;const sK=Math.max(0,(emp.kasbon||0)-s.potKasbon);const now=new Date();
const slip=`<div class="slip">
<div class="hdr"><div class="logo"><img src="${LOGO_IMG}" style="height:22px"/></div><div><div class="ttl">SLIP GAJI KARYAWAN</div><div class="sub">Dept. Rumah Tangga · ${s.periode}</div></div><div class="tgl">${fmtShort(now)}</div></div>
<div class="info"><div class="col"><b>${emp.nama}</b> · ${emp.jabatan} · ${emp.dep}</div><div class="col r">Kasbon: ${fmtRp(emp.kasbon||0)} · Saldo: ${sB>=0?'+':''}${fmtRp(sB)}</div></div>
<div class="body"><div class="sec">
<div class="stl">PENDAPATAN</div>
<div class="rw"><span>Gaji Pokok (${s.masukHari}hr × ${fmtRp(s.gajiPerhari)})</span><span>${fmtRp(c.gajiPokok)}</span></div>
<div class="rw"><span>Lembur</span><span>${fmtRp(s.lembur)}</span></div>
<div class="rw"><span>Tunjangan</span><span>${fmtRp(s.tunjangan)}</span></div>
<div class="rw"><span>Bonus</span><span>${fmtRp(s.bonus)}</span></div>
<div class="rw tot grn"><span>Total Pendapatan</span><span>${fmtRp(c.totalPendapatan)}</span></div>
</div><div class="sec">
<div class="stl red">POTONGAN</div>
<div class="rw"><span>Kasbon</span><span>${fmtRp(s.potKasbon)}</span></div>
<div class="rw"><span>Pot. Makan</span><span>${fmtRp(s.potMakan)}</span></div>
<div class="rw tot red"><span>Total Potongan</span><span>${fmtRp(c.totalPotongan)}</span></div>
</div><div class="sec">
<div class="stl">PEMBAYARAN</div>
<div class="rw"><span>Gaji Bersih</span><span>${fmtRp(c.gajiBersih)}</span></div>
${sB!==0?`<div class="rw ${sB>=0?'grn':'red'}"><span>Saldo Sebelumnya</span><span>${sB>=0?'+':''}${fmtRp(sB)}</span></div>`:''}
<div class="rw tot"><span>Harus Dibayar</span><span>${fmtRp(harusBayar)}</span></div>
<div class="rw grand"><span>DIBAYARKAN</span><span>${fmtRp(dibayar)}</span></div>
<div class="rw saldo ${saldoBaru>=0?'grn':'red'}"><span>Saldo → ${saldoBaru>0?'Kurang bayar':saldoBaru<0?'Lebih bayar':'Lunas'}</span><span>${saldoBaru>0?'+':''}${fmtRp(saldoBaru)}</span></div>
</div></div>
<div class="sign"><div class="sb"><div>Penerima,</div><div class="ln"></div><div class="nm">${emp.nama}</div></div><div class="sb"><div>Bendahara,</div><div class="ln"></div><div class="nm">Dept. Rumah Tangga</div></div></div>
</div>`;
const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Slip-${emp.nama}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Plus Jakarta Sans',sans-serif;color:#1a1a1a;font-size:9px;line-height:1.4}
@page{size:215mm 330mm;margin:6mm 8mm}
.page{width:100%;display:flex;flex-direction:column;height:318mm}
.slip{flex:1;padding:6mm 4mm;border-bottom:1.5px dashed #999;position:relative;display:flex;flex-direction:column}
.slip:last-child{border-bottom:none}
.slip::after{content:'✂';position:absolute;bottom:-3px;left:4mm;font-size:10px;color:#999}
.slip:last-child::after{display:none}
.hdr{display:flex;align-items:center;gap:6px;padding-bottom:4px;border-bottom:2px solid #1a3c34;margin-bottom:4px}
.hdr .ttl{font-size:11px;font-weight:700;color:#1a3c34}
.hdr .sub{font-size:8px;color:#888}
.hdr .tgl{margin-left:auto;font-size:8px;color:#888}
.info{display:flex;justify-content:space-between;padding:3px 0;font-size:8.5px;border-bottom:1px solid #eee;margin-bottom:3px}
.info .r{text-align:right}
.body{display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:4px;flex:1}
.sec{font-size:8.5px}
.stl{font-size:8px;font-weight:700;color:#1a3c34;border-bottom:1.5px solid #ddd;padding-bottom:1px;margin-bottom:2px}
.stl.red{color:#c0392b}
.rw{display:flex;justify-content:space-between;padding:1.5px 0;font-size:8.5px}
.rw span:last-child{font-weight:600;white-space:nowrap}
.rw.tot{border-top:1px solid #ddd;font-weight:700;margin-top:2px;padding-top:2px}
.rw.grn{color:#1a7a3a}.rw.red{color:#c0392b}
.rw.grand{background:#1a3c34;color:#fff;border-radius:3px;padding:3px 5px;font-weight:700;font-size:9.5px;margin-top:3px}
.rw.saldo{background:#f0f0f0;border-radius:3px;padding:2px 5px;font-weight:700;font-size:8.5px;margin-top:2px}
.sign{display:flex;justify-content:space-between;padding-top:4px;margin-top:auto}
.sb{text-align:center;font-size:8px;color:#666}
.ln{margin-top:24px;border-bottom:1px solid #333;width:100px;display:inline-block}
.nm{font-size:8.5px;font-weight:600;color:#1a1a1a;margin-top:2px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="page">${slip}${slip}${slip}</div>
<script>window.onload=function(){window.print()}<\/script></body></html>`;
const w=window.open("","_blank");if(w){w.document.write(html);w.document.close();}}

function printPc(p){const c=cP(p);let run=p.anggaran;const now=new Date();
const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pencairan-${p.name}</title><style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Plus Jakarta Sans',sans-serif;color:#1a1a1a;padding:32px;font-size:11px}table{width:100%;border-collapse:collapse}th{background:#f4f7f6;color:#1a3c34;font-weight:600;padding:7px 8px;border:1px solid #ddd;font-size:10px}td{padding:6px 8px;border:1px solid #e8e8e8}tr:nth-child(even){background:#fafbfc}.r{text-align:right}.c{text-align:center}.tot{background:#f4f7f6!important;font-weight:700}.b{display:inline-block;padding:1px 6px;border-radius:8px;font-size:8px;font-weight:600}@media print{body{padding:16px}@page{margin:10mm}}</style></head><body>
<div style="text-align:center;margin-bottom:16px;padding-bottom:10px;border-bottom:3px solid #1a3c34"><div style="font-size:15px;font-weight:700;color:#1a3c34">Pencairan — ${p.name}</div><div style="font-size:10px;color:#999;margin-top:3px">Dept. RT · ${fmtTgl(now)}</div></div>
<div style="border:2px solid #1a3c34;border-radius:6px;padding:10px 14px;margin-bottom:14px"><div style="display:flex;justify-content:space-between;padding:3px 0"><span>Anggaran</span><span style="font-weight:700">${fmtRp(p.anggaran)}</span></div><div style="display:flex;justify-content:space-between;padding:3px 0;color:#c0392b"><span>Dicairkan</span><span style="font-weight:700">- ${fmtRp(c.totalCair)}</span></div><div style="height:2px;background:#1a3c34;margin:4px 0"></div><div style="display:flex;justify-content:space-between;padding:3px 0;font-weight:700;font-size:13px;color:${c.sisaAnggaran>=0?'#27ae60':'#c0392b'}"><span>Sisa</span><span>${fmtRp(c.sisaAnggaran)}</span></div></div>
<table><thead><tr><th class="c" style="width:35px">Thp</th><th>Ket</th><th class="r" style="width:100px">Jumlah</th><th class="r" style="width:100px">Potong</th><th class="r" style="width:100px">Sisa</th><th class="c" style="width:70px">Tgl</th><th class="c" style="width:80px">Status</th></tr></thead><tbody>
${p.pencairan.map(pc=>{const ic=pc.status!=="Belum Cair";if(ic)run-=pc.jumlah;const bg=stC(pc.status).bg,fg=stC(pc.status).fg;return`<tr><td class="c">${pc.tahap}</td><td>${pc.ket||"-"}</td><td class="r">${fmtRp(pc.jumlah)}</td><td class="r" style="color:${ic?'#c0392b':'#aaa'}">${ic?'- '+fmtRp(pc.jumlah):'-'}</td><td class="r" style="font-weight:600">${ic?fmtRp(run):'-'}</td><td class="c">${pc.tgl||"-"}</td><td class="c"><span class="b" style="background:${bg};color:${fg}">${pc.status}</span></td></tr>`}).join("")}
<tr class="tot"><td colspan="2" class="r">Total</td><td class="r">${fmtRp(c.totalRencana)}</td><td class="r" style="color:#c0392b">- ${fmtRp(c.totalCair)}</td><td class="r" style="color:${c.sisaAnggaran>=0?'#27ae60':'#c0392b'}">${fmtRp(c.sisaAnggaran)}</td><td colspan="2"></td></tr></tbody></table>
<script>window.onload=function(){window.print()}<\/script></body></html>`;
const w=window.open("","_blank");if(w){w.document.write(html);w.document.close();}}

// ══════ LOGIN ══════
function LoginPage({onLogin,accounts,T}){const[u,setU]=useState("");const[p,setP]=useState("");const[sh,setSh]=useState(false);const[err,setErr]=useState("");const[now,setNow]=useState(new Date());useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
const S=useMemo(()=>mkS(T),[T]);const gCSS=useMemo(()=>mkCSS(T),[T]);
const go=()=>{const f=(accounts||ACCTS).find(a=>a.username===u&&a.password===p);if(f)onLogin(f);else setErr("Username atau password salah")};
return(<div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",minHeight:"100vh",background:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><style>{gCSS}</style><div style={{background:"#fff",borderRadius:20,padding:"40px 30px 28px",boxShadow:"0 8px 40px rgba(0,0,0,0.08)",border:"1px solid #e8e8e8",width:"100%",maxWidth:380}}>
  <div style={{textAlign:"center",marginBottom:20}}><div style={{width:120,height:120,borderRadius:16,background:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:12}}><img src={LOGO_IMG} style={{width:110,height:"auto"}} alt="DRT DN2"/></div><h1 style={{fontSize:20,fontWeight:800,color:"#1a3c34"}}>Administrasi Keuangan</h1><p style={{fontSize:12,color:"#999",marginTop:3}}>Departemen Rumah Tangga</p></div>
  <div style={{textAlign:"center",padding:"10px 0",marginBottom:14,borderTop:"1px solid #f0f0f0",borderBottom:"1px solid #f0f0f0"}}><span style={{fontSize:22,fontWeight:300,color:"#1a3c34",fontVariantNumeric:"tabular-nums"}}>{fmtJam(now)}</span><span style={{display:"block",fontSize:10,color:"#bbb",marginTop:2}}>{fmtTgl(now)}</span></div>
  <div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div><label style={{fontSize:11,fontWeight:600,color:"#888",display:"block",marginBottom:4}}>Username</label><input style={{...S.loginInput,background:"#f8f9fa",border:"1.5px solid #e0e0e0",color:"#333"}} value={u} onChange={e=>{setU(e.target.value);setErr("")}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Username" autoFocus/></div>
    <div><label style={{fontSize:11,fontWeight:600,color:"#888",display:"block",marginBottom:4}}>Password</label><input style={{...S.loginInput,background:"#f8f9fa",border:"1.5px solid #e0e0e0",color:"#333"}} type={sh?"text":"password"} value={p} onChange={e=>{setP(e.target.value);setErr("")}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Password"/></div>
    {err&&<div style={{fontSize:11,color:"#e74c3c",background:"#fef2f2",padding:"7px 10px",borderRadius:7,textAlign:"center"}}>{err}</div>}
    <button style={{padding:13,fontSize:14,fontWeight:700,border:"none",borderRadius:10,background:"linear-gradient(135deg,#1a3c34,#2d6a5a)",color:"#fff",cursor:"pointer",marginTop:4,boxShadow:"0 4px 12px rgba(26,60,52,0.3)"}} onClick={go}>Masuk</button>
  </div>
  <div style={{textAlign:"center",fontSize:10,color:"#ccc",marginTop:18}}>admin / admin123 · bendahara / bend123</div>
</div></div>);}

// ══════ SLIP DETAIL ══════
function SlipDetail({emp,onBack,onUpdate,S,T}){
  const s=emp.slip||mkSlip();const[form,setForm]=useState({...s});const[slTab,setSlTab]=useState("current");const[kbF,setKbF]=useState({jumlah:"",ket:""});
  const[editRw,setEditRw]=useState(null);const[rwF,setRwF]=useState({});
  const c=calcSlip(form);const sB=emp.saldo||0;const harusBayar=c.gajiBersih+sB;const dibayar=form.dibayarkan||0;const saldoBaru=harusBayar-dibayar;const sKA=Math.max(0,(emp.kasbon||0)-form.potKasbon);
  const sF=(k,v)=>setForm({...form,[k]:NM(v)});const saved=JSON.stringify(form)===JSON.stringify(s);
  const saveSlip=()=>onUpdate({...emp,slip:{...form}});
  const tutupPeriode=()=>{if(!dibayar){alert("Isi dulu Jumlah Dibayarkan!");return}const rec={periode:form.periode,slip:{...form},gajiBersih:c.gajiBersih,harusBayar,dibayarkan:dibayar,saldoSblm:sB,saldoAkhir:saldoBaru,tgl:fmtShort(new Date())};onUpdate({...emp,slip:{...mkSlip(),gajiPerhari:form.gajiPerhari,tunjangan:form.tunjangan},saldo:saldoBaru,kasbon:sKA,riwayat:[rec,...(emp.riwayat||[])]});setForm({...mkSlip(),gajiPerhari:form.gajiPerhari,tunjangan:form.tunjangan});setSlTab("history")};
  const addKb=()=>{const j=NM(kbF.jumlah);if(j<=0)return;onUpdate({...emp,kasbon:(emp.kasbon||0)+j,logKasbon:[{id:uid(),tgl:fmtShort(new Date()),jumlah:j,ket:kbF.ket},...(emp.logKasbon||[])]});setKbF({jumlah:"",ket:""})};

  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}><button style={S.btnGhost} onClick={onBack}>{I.back} Kembali</button><div style={{flex:1,minWidth:160}}><h3 style={{fontSize:16,fontWeight:700,color:"#b8b2ff"}}>Slip Gaji — {emp.nama}</h3><div style={{fontSize:11,color:"#888"}}>{emp.jabatan} · {emp.dep} · Standar: {fmtRp(emp.gaji)}</div></div><button onClick={()=>{saveSlip();printSlip({...emp,slip:form},form)}} style={{padding:"10px 20px",fontSize:13,fontWeight:700,border:"none",borderRadius:10,background:"linear-gradient(135deg,#b91c1c,#dc2626)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 2px 8px rgba(185,28,28,0.3)"}}>{I.print} CETAK SLIP GAJI</button></div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      <div style={{...S.card,margin:0,borderLeft:`4px solid ${sB>=0?"#27ae60":"#c0392b"}`,paddingTop:12,paddingBottom:12}}><div style={{fontSize:10,fontWeight:600,color:"#888"}}>Saldo Sebelumnya</div><div style={{fontSize:20,fontWeight:700,color:sB>=0?"#27ae60":"#c0392b",marginTop:2}}>{sB>=0?"+":""}{fmtRp(sB)}</div></div>
      <div style={{...S.card,margin:0,borderLeft:"4px solid #e67e22",paddingTop:12,paddingBottom:12}}><div style={{fontSize:10,fontWeight:600,color:"#888"}}>Sisa Kasbon</div><div style={{fontSize:20,fontWeight:700,color:emp.kasbon?"#e67e22":"#27ae60",marginTop:2}}>{fmtRp(emp.kasbon||0)}</div></div>
    </div>

    <div style={{display:"flex",gap:2,marginBottom:14}}>{[["current","Slip Saat Ini"],["kasbon","Kasbon"],["history",`Riwayat (${(emp.riwayat||[]).length})`]].map(([id,lb])=>(<button key={id} onClick={()=>setSlTab(id)} style={{padding:"8px 16px",fontSize:12,fontWeight:slTab===id?600:500,border:"none",background:slTab===id?"#fff":"#e8e8e8",color:slTab===id?"#1a3c34":"#666",cursor:"pointer",borderRadius:"8px 8px 0 0",boxShadow:slTab===id?"0 -1px 4px rgba(0,0,0,0.04)":"none"}}>{lb}</button>))}</div>

    {slTab==="current"&&(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
      <div style={S.card}><div style={S.cardHead}>Data Gaji — {form.periode}</div><div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><label style={{fontSize:11,fontWeight:600,color:"#666",whiteSpace:"nowrap"}}>Periode:</label><input style={S.input} value={form.periode} onChange={e=>setForm({...form,periode:e.target.value})}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><div><label style={S.lbl}>Masuk Hari</label><input style={S.input} type="number" value={form.masukHari||""} onChange={e=>sF("masukHari",e.target.value)}/></div><div><label style={S.lbl}>Gaji/Hari</label><input style={S.input} type="number" value={form.gajiPerhari||""} onChange={e=>sF("gajiPerhari",e.target.value)}/></div></div>
        <div style={{background:"rgba(108,99,255,0.08)",borderRadius:7,padding:"7px 12px",display:"flex",justifyContent:"space-between",border:"1px dashed #6c63ff",fontSize:12}}><span style={{color:"#888"}}>Gaji Pokok</span><span style={{fontWeight:700,color:"#b8b2ff"}}>{fmtRp(c.gajiPokok)}</span></div>
        {[["Lembur","lembur"],["Tunjangan","tunjangan"],["Bonus","bonus"]].map(([l,k])=><div key={k}><label style={S.lbl}>{l}</label><input style={S.input} type="number" value={form[k]||""} onChange={e=>sF(k,e.target.value)}/></div>)}
        <div style={{borderTop:"2px dashed rgba(255,107,107,0.3)",paddingTop:10}}><div style={{fontSize:11,fontWeight:700,color:"#c0392b",marginBottom:8}}>POTONGAN</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><div><label style={S.lbl}>Kasbon (sisa:{fmtRp(emp.kasbon||0)})</label><input style={{...S.input,borderColor:"rgba(255,107,107,0.3)"}} type="number" value={form.potKasbon||""} onChange={e=>sF("potKasbon",e.target.value)}/></div><div><label style={S.lbl}>Pot. Makan</label><input style={{...S.input,borderColor:"rgba(255,107,107,0.3)"}} type="number" value={form.potMakan||""} onChange={e=>sF("potMakan",e.target.value)}/></div></div></div>
        <div style={{borderTop:"2px solid #1a3c34",paddingTop:10,marginTop:10}}><div style={{fontSize:11,fontWeight:700,color:"#b8b2ff",marginBottom:8}}>PEMBAYARAN</div>
          <div style={{background:"rgba(108,99,255,0.08)",borderRadius:7,padding:"8px 12px",marginBottom:8,fontSize:12}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#888"}}>Yang Harus Dibayar</span><span style={{fontWeight:700,color:"#b8b2ff"}}>{fmtRp(harusBayar)}</span></div><div style={{fontSize:10,color:"#666"}}>= Gaji Bersih {fmtRp(c.gajiBersih)} {sB!==0?`${sB>0?'+ saldo ':'− saldo '}${fmtRp(Math.abs(sB))}`:''}</div></div>
          <div><label style={{...S.lbl,color:"#b8b2ff",fontSize:11}}>Jumlah Dibayarkan (Rp)</label><input style={{...S.input,borderColor:"#6c63ff",borderWidth:2,fontSize:14,fontWeight:700,padding:"10px 12px"}} type="number" value={form.dibayarkan||""} onChange={e=>sF("dibayarkan",e.target.value)} placeholder="Masukkan jumlah yang diberikan"/></div>
          {dibayar>0&&<div style={{background:saldoBaru>=0?"#e8f5e9":"#fce4ec",borderRadius:7,padding:"8px 12px",marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,fontWeight:600,color:saldoBaru>=0?"#27ae60":"#c0392b"}}>{saldoBaru>0?"Kurang bayar → terbawa":saldoBaru<0?"Lebih bayar → dipotong berikutnya":"Lunas"}</span><span style={{fontSize:16,fontWeight:800,color:saldoBaru>=0?"#27ae60":"#c0392b"}}>{saldoBaru>0?"+":""}{fmtRp(saldoBaru)}</span></div>}
        </div>
        <div style={{display:"flex",gap:6,marginTop:8}}><button style={{...S.btnPri,flex:1,justifyContent:"center",opacity:saved?.5:1}} onClick={saveSlip} disabled={saved}>{saved?"Tersimpan":"Simpan"}</button><button style={{...S.btnPri,flex:1,justifyContent:"center",background:"#6c63ff"}} onClick={tutupPeriode}>Tutup Periode</button></div>
      </div></div>

      <div style={S.card}><div style={S.cardHead}>Preview</div><div style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"14px 16px"}}>
        <div style={{textAlign:"center",marginBottom:10}}><div style={{fontSize:10,fontWeight:700,color:"#b8b2ff"}}>SLIP GAJI — {form.periode}</div><div style={{fontSize:11,color:"#888",marginTop:2}}>{emp.nama}</div></div>
        <div style={{fontSize:10,fontWeight:700,color:"#b8b2ff",marginBottom:4,borderBottom:"1px solid rgba(255,255,255,0.08)",paddingBottom:3}}>PENDAPATAN</div>
        {[["Gaji Pokok",c.gajiPokok],["Lembur",form.lembur],["Tunjangan",form.tunjangan],["Bonus",form.bonus]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11}}><span style={{color:"#888"}}>{l}</span><span style={{fontWeight:500}}>{fmtRp(v)}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontWeight:700,color:"#27ae60",borderTop:"1px solid rgba(255,255,255,0.08)",marginTop:3,fontSize:12}}><span>Total Pendapatan</span><span>{fmtRp(c.totalPendapatan)}</span></div>
        <div style={{fontSize:10,fontWeight:700,color:"#c0392b",marginTop:10,marginBottom:4,borderBottom:"1px solid rgba(255,255,255,0.08)",paddingBottom:3}}>POTONGAN</div>
        {[["Kasbon",form.potKasbon],["Pot. Makan",form.potMakan]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11}}><span style={{color:"#888"}}>{l}</span><span style={{fontWeight:500}}>{fmtRp(v)}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontWeight:700,color:"#c0392b",borderTop:"1px solid rgba(255,255,255,0.08)",marginTop:3,fontSize:12}}><span>Total Potongan</span><span>{fmtRp(c.totalPotongan)}</span></div>
        <div style={{marginTop:10,border:"2px solid #6c63ff",borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,fontWeight:700,color:"#b8b2ff",marginBottom:6}}>PEMBAYARAN</div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12}}><span>Gaji Bersih</span><span style={{fontWeight:600}}>{fmtRp(c.gajiBersih)}</span></div>
          {sB!==0&&<div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12,color:sB>=0?"#27ae60":"#c0392b"}}><span>Saldo Sebelumnya</span><span style={{fontWeight:600}}>{sB>=0?"+":""} {fmtRp(sB)}</span></div>}
          <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontWeight:700,fontSize:12,borderTop:"1px solid rgba(255,255,255,0.08)",marginTop:3}}><span>Yang Harus Dibayar</span><span>{fmtRp(harusBayar)}</span></div>
          <div style={{height:2,background:"#1a3c34",margin:"6px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:800,color:"#b8b2ff"}}><span>DIBAYARKAN</span><span>{dibayar?fmtRp(dibayar):"—"}</span></div>
        </div>
        {dibayar>0&&<div style={{background:saldoBaru>=0?"#e8f5e9":"#fce4ec",borderRadius:6,padding:"8px 12px",marginTop:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:10,fontWeight:600,color:saldoBaru>=0?"#27ae60":"#c0392b"}}>Saldo → Berikutnya</span><span style={{fontSize:14,fontWeight:800,color:saldoBaru>=0?"#27ae60":"#c0392b"}}>{saldoBaru>0?"+":""}{fmtRp(saldoBaru)}</span></div><div style={{fontSize:9,color:"#888",marginTop:3}}>{saldoBaru>0?"Kurang bayar "+fmtRp(saldoBaru)+" → ditambah periode depan":saldoBaru<0?"Lebih bayar "+fmtRp(Math.abs(saldoBaru))+" → dipotong periode depan":"Pas, tidak ada saldo terbawa"}</div></div>}
      </div></div>
    </div>)}

    {slTab==="kasbon"&&(<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}><div style={{...S.statCard,borderTop:"3px solid #e67e22"}}><div style={S.statLbl}>Sisa Kasbon</div><div style={{fontSize:22,fontWeight:700,color:"#e67e22"}}>{fmtRp(emp.kasbon||0)}</div></div><div style={{...S.statCard,borderTop:"3px solid #1a3c34"}}><div style={S.statLbl}>Total Pinjaman</div><div style={{fontSize:22,fontWeight:700,color:"#b8b2ff"}}>{fmtRp((emp.logKasbon||[]).reduce((s,x)=>s+x.jumlah,0))}</div></div></div>
      <div style={S.card}><div style={S.cardHead}>Ambil Kasbon Baru</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><div style={{flex:1,minWidth:120}}><label style={S.lbl}>Jumlah</label><input style={S.input} type="number" value={kbF.jumlah} onChange={e=>setKbF({...kbF,jumlah:e.target.value})}/></div><div style={{flex:2,minWidth:150}}><label style={S.lbl}>Keterangan</label><input style={S.input} value={kbF.ket} onChange={e=>setKbF({...kbF,ket:e.target.value})}/></div><button style={{...S.btnPri,alignSelf:"flex-end"}} onClick={addKb}>{I.plus} Ambil</button></div></div>
      <div style={S.card}><div style={S.cardHead}>Riwayat Kasbon</div>{!(emp.logKasbon||[]).length?<div style={S.empty}>Belum ada</div>:<div style={{display:"flex",flexDirection:"column",gap:6}}>{(emp.logKasbon||[]).map(k=>(<div key={k.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"rgba(255,255,255,0.03)",borderRadius:8,borderLeft:"3px solid #e67e22"}}><div><div style={{fontWeight:500,fontSize:13}}>{fmtRp(k.jumlah)}</div><div style={{fontSize:11,color:"#666"}}>{k.tgl}{k.ket&&` · ${k.ket}`}</div></div></div>))}</div>}</div>
    </div>)}

    {slTab==="history"&&(()=>{
      const rw=emp.riwayat||[];
      const delRw=(idx)=>{if(confirm("Hapus riwayat periode ini?"))onUpdate({...emp,riwayat:rw.filter((_,i)=>i!==idx)})};
      const startEdit=(idx)=>{const r=rw[idx];setEditRw(idx);setRwF({periode:r.periode,gajiBersih:r.gajiBersih||0,saldoSblm:r.saldoSblm||0,dibayarkan:r.dibayarkan||r.totalDiterima||0})};
      const saveEdit=()=>{const gb=NM(rwF.gajiBersih);const ss=NM(rwF.saldoSblm);const db=NM(rwF.dibayarkan);const hb=gb+ss;const sa=hb-db;const nr=rw.map((r,i)=>i===editRw?{...r,periode:rwF.periode,gajiBersih:gb,saldoSblm:ss,harusBayar:hb,dibayarkan:db,saldoAkhir:sa}:r);onUpdate({...emp,riwayat:nr});setEditRw(null)};
      return(<div style={S.card}><div style={S.cardHead}>Riwayat Gaji</div>{!rw.length?<div style={S.empty}>Belum ada. Klik "Tutup Periode" untuk simpan.</div>:<div style={S.tableWrap}><table style={S.table}><thead><tr><th style={{...S.th,textAlign:"left"}}>Periode</th><th style={S.th}>Gaji Bersih</th><th style={S.th}>Saldo Sblm</th><th style={S.th}>Harus Bayar</th><th style={{...S.th,fontWeight:700}}>Dibayarkan</th><th style={S.th}>Saldo Akhir</th><th style={S.th}>Aksi</th></tr></thead><tbody>{rw.map((r,i)=>{const hb=r.harusBayar||(r.gajiBersih+(r.saldoSblm||0));const db=r.dibayarkan||r.totalDiterima||0;
      if(editRw===i){const ehb=NM(rwF.gajiBersih)+NM(rwF.saldoSblm);const esa=ehb-NM(rwF.dibayarkan);return(<tr key={i} style={{background:`${T.ac}10`}}><td style={{...S.td,textAlign:"left"}}><input style={{...S.input,width:110,padding:"4px 6px",fontSize:11}} value={rwF.periode} onChange={e=>setRwF({...rwF,periode:e.target.value})}/></td><td style={S.td}><input style={{...S.input,width:85,padding:"4px 6px",fontSize:11,textAlign:"right"}} type="number" value={rwF.gajiBersih} onChange={e=>setRwF({...rwF,gajiBersih:e.target.value})}/></td><td style={S.td}><input style={{...S.input,width:85,padding:"4px 6px",fontSize:11,textAlign:"right"}} type="number" value={rwF.saldoSblm} onChange={e=>setRwF({...rwF,saldoSblm:e.target.value})}/></td><td style={{...S.td,fontWeight:600}}>{fmtRp(ehb)}</td><td style={S.td}><input style={{...S.input,width:85,padding:"4px 6px",fontSize:11,textAlign:"right"}} type="number" value={rwF.dibayarkan} onChange={e=>setRwF({...rwF,dibayarkan:e.target.value})}/></td><td style={{...S.td,fontWeight:700,color:esa>=0?"#27ae60":"#c0392b"}}>{esa>=0?"+":""}{fmtRp(esa)}</td><td style={S.td}><div style={{display:"flex",gap:3,justifyContent:"center"}}><button style={{...S.btnMini,borderColor:"#27ae60",color:"#27ae60",padding:"3px 8px"}} onClick={saveEdit}>{I.save}</button><button style={{...S.btnMini,borderColor:T.sub,color:T.sub,padding:"3px 8px"}} onClick={()=>setEditRw(null)}>{I.x}</button></div></td></tr>)}
      return(<tr key={i} style={i%2?{background:"rgba(255,255,255,0.03)"}:{}}><td style={{...S.td,textAlign:"left"}}><div style={{fontWeight:600}}>{r.periode}</div><div style={{fontSize:10,color:"#666"}}>{r.tgl}</div></td><td style={{...S.td,fontWeight:600}}>{fmtRp(r.gajiBersih)}</td><td style={{...S.td,color:(r.saldoSblm||0)>=0?"#27ae60":"#c0392b"}}>{(r.saldoSblm||0)>=0?"+":""}{fmtRp(r.saldoSblm||0)}</td><td style={S.td}>{fmtRp(hb)}</td><td style={{...S.td,fontWeight:700,color:"#b8b2ff"}}>{fmtRp(db)}</td><td style={{...S.td,fontWeight:700,color:(r.saldoAkhir||0)>=0?"#27ae60":"#c0392b"}}>{(r.saldoAkhir||0)>=0?"+":""}{fmtRp(r.saldoAkhir||0)}</td><td style={S.td}><KebabMenu items={[{icon:I.edit,label:"Edit",onClick:()=>startEdit(i)},{icon:I.trash,label:"Hapus",danger:true,onClick:()=>delRw(i)}]}/></td></tr>)})}
    </tbody></table></div>}</div>);
    })()}
  </div>);
}

// ══════ MAIN ══════
function MainApp({account:acc,onLogout,appData,setAppData,onSave}){
  const[now,setNow]=useState(new Date());const[tab,setTab]=useState("dashboard");const[sideOpen,setSideOpen]=useState(false);
  const[detP,setDetP]=useState(null);const[slipE,setSlipE]=useState(null);
  const stg=appData.settings||{theme:"dark",lang:"id"};
  const[theme,setTheme]=useState(stg.theme||"dark");
  const[lang,setLang]=useState(stg.lang||"id");
  const T=THEMES[theme]||THEMES.dark;
  const L=LANG[lang]||LANG.id;
  const S=useMemo(()=>mkS(T),[theme]);
  const gCSS=useMemo(()=>mkCSS(T),[theme]);
  const saveSetting=(k,v)=>{const ns={...stg,[k]:v};const nd={...appData,settings:ns};setAppData(nd);onSave({...nd});};
  const[projects,setProjects]=useState(appData.projects||[]);
  const[employees,setEmployees]=useState(appData.employees||[]);
  const[loans,setLoans]=useState(appData.loans||[]);
  const[tx,setTx]=useState(appData.transactions||[]);
  const[pF,setPF]=useState({name:"",anggaran:""});const[editP,setEditP]=useState(null);
  const[eF,setEF]=useState({nama:"",jabatan:"",dep:"",gaji:"",telp:"",status:"Aktif"});const[editE,setEditE]=useState(null);const[showEF,setShowEF]=useState(false);
  const[lF,setLF]=useState({dari:"",ke:"",jumlah:"",ket:""});const[tF,setTF]=useState({tipe:"masuk",jumlah:"",ket:"",proyek:""});
  const[empQ,setEmpQ]=useState("");
  const[pengajuan,setPengajuan]=useState(appData.pengajuan||[]);
  const[pgSel,setPgSel]=useState(null);const[pgNF,setPgNF]=useState("");const[editPgId,setEditPgId]=useState(null);
  const[pgF,setPgF]=useState({tipe:"debit",jumlah:"",ket:""});const[editEntId,setEditEntId]=useState(null);const[editEntSaldo,setEditEntSaldo]=useState("");
  const[saving,setSaving]=useState(false);
  const saveTimer=useRef(null);

  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);

  // Auto-save to Supabase when data changes
  const doSave=useCallback(()=>{
    const data={projects,employees,loans,transactions:tx,pengajuan,accounts:appData.accounts||ACCTS};
    setSaving(true);
    onSave(data).finally(()=>setTimeout(()=>setSaving(false),1000));
  },[projects,employees,loans,tx,pengajuan,appData.accounts,onSave]);

  useEffect(()=>{
    if(saveTimer.current)clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(doSave,2000);
    return()=>{if(saveTimer.current)clearTimeout(saveTimer.current)};
  },[projects,employees,loans,tx,pengajuan]);

  const tAng=useMemo(()=>projects.reduce((s,p)=>s+p.anggaran,0),[projects]);
  const tCair=useMemo(()=>projects.reduce((s,p)=>s+cP(p).totalCair,0),[projects]);
  const tSisa=tAng-tCair;
  const tIn=useMemo(()=>tx.filter(t=>t.tipe==="masuk").reduce((s,t)=>s+t.jumlah,0),[tx]);
  const tOut=useMemo(()=>tx.filter(t=>t.tipe==="keluar").reduce((s,t)=>s+t.jumlah,0),[tx]);
  const saldo=tSisa+tIn-tOut;const aPct=tAng>0?(tCair/tAng)*100:0;
  const tGaji=useMemo(()=>employees.filter(e=>e.status==="Aktif").reduce((s,e)=>{const c=calcSlip(e.slip||mkSlip());return s+c.gajiBersih+(e.saldo||0)},0),[employees]);
  const eAkt=useMemo(()=>employees.filter(e=>e.status==="Aktif").length,[employees]);
  const allPc=useMemo(()=>projects.flatMap(p=>p.pencairan.map(pc=>({...pc,pN:p.name}))),[projects]);
  const pcC=(s)=>allPc.filter(x=>x.status===s).length;const pcS=(s)=>allPc.filter(x=>x.status===s).reduce((a,x)=>a+x.jumlah,0);
  const fEmp=useMemo(()=>{if(!empQ)return employees;const q=empQ.toLowerCase();return employees.filter(e=>e.nama.toLowerCase().includes(q)||e.jabatan.toLowerCase().includes(q)||e.dep.toLowerCase().includes(q))},[employees,empQ]);

  const navs=[{id:"dashboard",icon:I.home,lb:L.dashboard},{id:"proyek",icon:I.folder,lb:L.proyek},{id:"karyawan",icon:I.users,lb:L.karyawan},{id:"pengajuan",icon:I.wallet,lb:L.pengajuan},{id:"pinjaman",icon:I.shuffle,lb:L.pinjaman},{id:"transaksi",icon:I.list,lb:L.transaksi},...(acc.role==="Admin"?[{id:"akun",icon:I.key,lb:L.akun}]:[]),{id:"settings",icon:I.gear,lb:L.settings}];
  const[akunF,setAkunF]=useState({username:"",password:"",nama:"",role:"Bendahara"});const[editAkun,setEditAkun]=useState(null);const[showPass,setShowPass]=useState({});
  const accounts=appData.accounts||ACCTS;
  const setAccounts=(newAccs)=>{const newData={...appData,accounts:newAccs};setAppData(prev=>({...prev,accounts:newAccs}));onSave({projects,employees,loans,transactions:tx,accounts:newAccs});};
  const goTab=(id)=>{setTab(id);setSideOpen(false);setDetP(null);setSlipE(null)};

  const Side=()=>(<>{sideOpen&&<div style={S.sideOver} onClick={()=>setSideOpen(false)}/>}<aside style={{...S.side,...(sideOpen?S.sideOpen:{})}}>
    <div style={S.sideBrand}><div style={{...S.sideLogo,background:"#fff",padding:3}}><img src={LOGO_IMG} style={{width:28,height:"auto"}} alt="DRT"/></div><div><div style={S.sideBT}>Administrasi Keuangan</div><div style={S.sideBS}>Dept. Rumah Tangga</div></div><button style={S.sideX} onClick={()=>setSideOpen(false)}>{I.x}</button></div>
    <nav style={S.sideNav}>{navs.map(n=><button key={n.id} onClick={()=>goTab(n.id)} style={{...S.sideItem,...(tab===n.id?S.sideItemA:{})}}>{n.icon}<span>{n.lb}</span></button>)}</nav>
    <div style={S.sideBot}><div style={S.sideUser}><div style={S.sideAv}>{acc.nama.charAt(0)}</div><div><div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{acc.nama}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>{acc.role}</div></div></div><button style={S.sideLogout} onClick={onLogout}>{I.logout}<span>Keluar</span></button></div></aside></>);

  const Top=({t})=>(<header style={S.topbar}><div style={{display:"flex",alignItems:"center",gap:10}}><button style={S.menuBtn} onClick={()=>setSideOpen(true)}>{I.menu}</button><h2 style={S.pageTitle}>{t}</h2>{saving&&<span style={{fontSize:10,color:"#27ae60",display:"flex",alignItems:"center",gap:4}}>{I.cloud} Menyimpan...</span>}</div><div style={S.topClock}><span style={S.topTime}>{fmtJam(now)}</span><span style={S.topDate}>{fmtTgl(now)}</span></div></header>);

  if(detP){const p=projects.find(x=>x.id===detP);if(p)return(<div style={S.shell}><style>{gCSS}</style><Side/><div style={S.content}><Top t="Detail Proyek"/><main style={S.main}><PD p={p} onBack={()=>setDetP(null)} onU={u=>setProjects(projects.map(x=>x.id===u.id?u:x))} S={S} T={T}/></main></div></div>)}
  if(slipE){const e=employees.find(x=>x.id===slipE);if(e)return(<div style={S.shell}><style>{gCSS}</style><Side/><div style={S.content}><Top t="Slip Gaji"/><main style={S.main}><SlipDetail emp={e} onBack={()=>setSlipE(null)} onUpdate={u=>setEmployees(employees.map(x=>x.id===u.id?u:x))} S={S} T={T}/></main></div></div>)}

  return(<div style={S.shell}><style>{gCSS}</style><Side/><div style={S.content}><Top t={navs.find(n=>n.id===tab)?.lb}/>
  <main style={S.main}>
    {tab==="dashboard"&&(()=>{
      const pgCalc=(ent)=>{let rs=0;(ent||[]).forEach(x=>{if(x.saldoManual!=null)rs=x.saldoManual;else rs=rs+(x.debit||0)-(x.kredit||0)});return rs};
      const pgAll=pengajuan||[];const gPD=pgAll.reduce((s,pg)=>(pg.entries||[]).reduce((a,x)=>a+(x.debit||0),0)+s,0);const gPK=pgAll.reduce((s,pg)=>(pg.entries||[]).reduce((a,x)=>a+(x.kredit||0),0)+s,0);const gPS=pgAll.reduce((s,pg)=>s+pgCalc(pg.entries),0);
      const prCalc=(ent)=>{let rs=0;(ent||[]).forEach(x=>{if(x.saldoManual!=null)rs=x.saldoManual;else rs=rs+(x.debit||0)-(x.kredit||0)});return rs};
      const gPrD=projects.reduce((s,p)=>(p.entries||[]).reduce((a,x)=>a+(x.debit||0),0)+s,0);
      const gPrK=projects.reduce((s,p)=>(p.entries||[]).reduce((a,x)=>a+(x.kredit||0),0)+s,0);
      const gPrS=projects.reduce((s,p)=>s+prCalc(p.entries),0);
      const dTot=tIn+tOut||1;const inPct=(tIn/dTot)*100;const r=38;const circ=2*Math.PI*r;
      const lt=T.id==="light";
      const cG=lt?"#27ae60":"#00ff88";const cR=lt?"#e74c3c":"#ff6b6b";const cB=lt?"#2980b9":"#5b8cff";const cT=lt?"#1a1a1a":T.tx;
      const gl=lt?{background:"#fff",border:"1px solid #e8e8e8",borderRadius:14,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}:{background:`rgba(30,30,60,0.6)`,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:`1px solid rgba(255,255,255,0.08)`,borderRadius:14};
      const glC={...gl,padding:"16px 18px",overflow:"hidden"};
      const mths=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];const curM=new Date().getMonth();
      const mData=mths.map((_,i)=>{const mIn=tx.filter(t=>t.tipe==="masuk").reduce((s,t)=>{try{if(t.tgl&&t.tgl.includes(mths[i]))return s+t.jumlah;return s}catch(e){return s}},0);const mOut=tx.filter(t=>t.tipe==="keluar").reduce((s,t)=>{try{if(t.tgl&&t.tgl.includes(mths[i]))return s+t.jumlah;return s}catch(e){return s}},0);return{m:mths[i],in:mIn,out:mOut}});
      const maxBar=Math.max(...mData.map(d=>Math.max(d.in,d.out)),1);
      return(<div>
      {/* Welcome */}
      <div style={{...glC,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,background:lt?"linear-gradient(135deg,#f8faf9,#eef5f2)":`linear-gradient(135deg,${T.sA}ee,${T.sB}dd)`}}>
        <div><div style={{fontSize:20,fontWeight:800,color:lt?"#1a3c34":"#fff"}}>{L.selamat}, {acc.nama}</div><div style={{fontSize:11,color:lt?"#888":"rgba(255,255,255,0.45)",marginTop:4}}>{L.ringkasan} {saving?`• ${L.menyimpan}`:""}</div></div>
        <div style={{width:44,height:44,borderRadius:"50%",background:lt?"#1a3c34":T.acBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:lt?"#fff":T.acL}}>{acc.nama.charAt(0)}</div>
      </div>

      {/* Saldo Proyek DRT */}
      <div style={{...glC,marginBottom:16,textAlign:"center",padding:"24px 20px"}}>
        <div style={{fontSize:11,fontWeight:600,color:lt?"#888":T.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Saldo Proyek DRT</div>
        <div style={{fontSize:32,fontWeight:800,color:gPrS>=0?cG:cR,fontVariantNumeric:"tabular-nums"}}>{fmtRp(gPrS)}</div>
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:12}}>
          <div><div style={{fontSize:9,color:lt?"#888":T.sub}}>Total Debit</div><div style={{fontSize:14,fontWeight:700,color:cB}}>{fmtRp(gPrD)}</div></div>
          <div style={{width:1,background:lt?"#e0e0e0":T.cb}}/> 
          <div><div style={{fontSize:9,color:lt?"#888":T.sub}}>Total Kredit</div><div style={{fontSize:14,fontWeight:700,color:cR}}>{fmtRp(gPrK)}</div></div>
        </div>
      </div>

      {/* Operasional + Transaksi */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{...glC}}>
          <div style={{fontSize:12,fontWeight:700,color:cT,marginBottom:12}}>Ringkasan Operasional</div>
          <div><div style={{fontSize:11,color:lt?"#666":T.sub}}>Karyawan: <b style={{color:cG}}>{eAkt}</b> {L.aktif}</div><div style={{fontSize:22,fontWeight:800,color:lt?"#1a3c34":T.acL,marginTop:4}}>{tGaji<0?"− ":""}{fmtRp(Math.abs(tGaji))}</div><div style={{fontSize:9,color:lt?"#999":T.mut,marginTop:2}}>{L.gajiBulan}</div></div>
        </div>
        <div style={{...glC}}>
          <div style={{fontSize:12,fontWeight:700,color:cT,marginBottom:12}}>{L.transaksi}</div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{position:"relative",width:70,height:70}}>
              <svg width="70" height="70" viewBox="0 0 90 90"><circle cx="45" cy="45" r={r} fill="none" stroke={lt?"#eee":T.iBg} strokeWidth="8"/>{tIn>0&&<circle cx="45" cy="45" r={r} fill="none" stroke={cG} strokeWidth="8" strokeDasharray={`${(inPct/100)*circ} ${circ}`} strokeDashoffset="0" transform="rotate(-90 45 45)" strokeLinecap="round"/>}{tOut>0&&<circle cx="45" cy="45" r={r} fill="none" stroke={cR} strokeWidth="8" strokeDasharray={`${((100-inPct)/100)*circ} ${circ}`} strokeDashoffset={`${-(inPct/100)*circ}`} transform="rotate(-90 45 45)" strokeLinecap="round"/>}</svg>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:10,fontWeight:800,color:cT}}>{tIn+tOut>0?`${inPct.toFixed(0)}%`:"-"}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><div style={{width:10,height:10,borderRadius:"50%",background:cG}}/><span style={{fontSize:11,color:lt?"#666":T.sub,flex:1}}>Masuk</span><span style={{fontWeight:700,color:cG,fontSize:12}}>{fmtRp(tIn)}</span></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:"50%",background:cR}}/><span style={{fontSize:11,color:lt?"#666":T.sub,flex:1}}>Keluar</span><span style={{fontWeight:700,color:cR,fontSize:12}}>{fmtRp(tOut)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend */}
      <div style={{...glC,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:cT}}>Ringkasan Tren</div>
          <div style={{display:"flex",gap:12,fontSize:10}}><span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:2,background:cG}}/><span style={{color:lt?"#888":T.sub}}>Masuk</span></span><span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:2,background:cR}}/><span style={{color:lt?"#888":T.sub}}>Keluar</span></span></div>
        </div>
        <div style={{display:"flex",alignItems:"flex-end",gap:4,height:100}}>
          {mData.slice(0,curM+1).map((d,i)=>{const hIn=maxBar>0?(d.in/maxBar)*80:0;const hOut=maxBar>0?(d.out/maxBar)*80:0;return(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <div style={{display:"flex",gap:2,alignItems:"flex-end",height:80}}>
                <div style={{width:8,borderRadius:"3px 3px 0 0",background:hIn>0?cG:(lt?"#eee":T.iBg),height:Math.max(hIn,2),transition:"height 0.3s"}}/>
                <div style={{width:8,borderRadius:"3px 3px 0 0",background:hOut>0?cR:(lt?"#eee":T.iBg),height:Math.max(hOut,2),transition:"height 0.3s"}}/>
              </div>
              <span style={{fontSize:8,color:lt?"#aaa":T.mut}}>{d.m}</span>
            </div>
          )})}
        </div>
      </div>

      {/* Bottom: Pengajuan + Proyek */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{...glC}}>
          <div style={{fontSize:12,fontWeight:700,color:cT,marginBottom:12}}>{L.pengajuan}</div>
          {!pgAll.length?<div style={S.empty}>Belum ada</div>:<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
              {[["Debit",fmtRp(gPD),cB],["Kredit",fmtRp(gPK),cR],[L.saldo,fmtRp(gPS),gPS>=0?cG:cR]].map(([l,v,c],i)=>(<div key={i} style={{background:lt?`${c}10`:`${c}12`,borderRadius:8,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:8,fontWeight:700,color:c}}>{l}</div><div style={{fontSize:12,fontWeight:800,color:c}}>{v}</div></div>))}</div>
            <div style={S.tableWrap}><table style={{...S.table,fontSize:10}}><thead><tr><th style={{...S.th,textAlign:"left",fontSize:8}}>Nama Proyek</th><th style={{...S.th,fontSize:8}}>Debit</th><th style={{...S.th,fontSize:8}}>Kredit</th><th style={{...S.th,fontSize:8}}>{L.saldo}</th></tr></thead><tbody>
              {pgAll.map((pg,i)=>{const ps=pgCalc(pg.entries);return(<tr key={pg.id} style={i%2?{background:lt?"#f9f9f9":`${T.ac}08`}:{}}><td style={{...S.td,textAlign:"left",fontWeight:600,fontSize:11}}>{pg.name}</td><td style={{...S.td,color:cB}}>{fmtRp((pg.entries||[]).reduce((a,x)=>a+(x.debit||0),0))}</td><td style={{...S.td,color:cR}}>{fmtRp((pg.entries||[]).reduce((a,x)=>a+(x.kredit||0),0))}</td><td style={{...S.td,fontWeight:700,color:ps>=0?cG:cR}}>{fmtRp(ps)}</td></tr>)})}
            </tbody></table></div></>}
        </div>
        <div style={{...glC}}>
          <div style={{fontSize:12,fontWeight:700,color:cT,marginBottom:12}}>Daftar {L.proyek}</div>
          {!projects.length?<div style={S.empty}>Belum ada</div>:
          <div style={S.tableWrap}><table style={{...S.table,fontSize:10}}><thead><tr><th style={{...S.th,textAlign:"left",fontSize:8}}>{L.proyek}</th><th style={{...S.th,fontSize:8}}>Debit</th><th style={{...S.th,fontSize:8}}>Cair</th></tr></thead><tbody>
            {projects.map((p,i)=>{const pD=(p.entries||[]).reduce((a,x)=>a+(x.debit||0),0);const pK=(p.entries||[]).reduce((a,x)=>a+(x.kredit||0),0);return(<tr key={p.id} style={i%2?{background:lt?"#f9f9f9":`${T.ac}08`}:{}}><td style={{...S.td,textAlign:"left",fontWeight:600,fontSize:11,cursor:"pointer",color:lt?"#1a3c34":T.acL}} onClick={()=>{setDetP(p.id);setTab("proyek")}}>{p.name}</td><td style={{...S.td,color:cB}}>{fmtRp(pD)}</td><td style={{...S.td,color:cR}}>{fmtRp(pK)}</td></tr>)})}
          </tbody></table></div>}
        </div>
      </div>
    </div>);
    })()}
    {tab==="proyek"&&(()=>{
      const prCalc=(ent)=>{let rs=0;(ent||[]).forEach(x=>{if(x.saldoManual!=null)rs=x.saldoManual;else rs=rs+(x.debit||0)-(x.kredit||0)});return rs};
      const gD=projects.reduce((s,p)=>(p.entries||[]).reduce((a,x)=>a+(x.debit||0),0)+s,0);
      const gK=projects.reduce((s,p)=>(p.entries||[]).reduce((a,x)=>a+(x.kredit||0),0)+s,0);
      const gS=projects.reduce((s,p)=>s+prCalc(p.entries),0);
      return(<div>
        <div style={S.grid3}>
          <div style={{...S.statCard,borderTop:"3px solid #2980b9"}}><div style={S.statLbl}>Total Debit (Semua)</div><div style={{...S.statVal,color:"#2980b9"}}>{fmtRp(gD)}</div></div>
          <div style={{...S.statCard,borderTop:"3px solid #c0392b"}}><div style={S.statLbl}>Total Kredit (Semua)</div><div style={{...S.statVal,color:"#c0392b"}}>{fmtRp(gK)}</div></div>
          <div style={{...S.statCard,borderTop:`3px solid ${gS>=0?"#27ae60":"#c0392b"}`}}><div style={S.statLbl}>Saldo Global</div><div style={{...S.statVal,color:gS>=0?"#27ae60":"#c0392b"}}>{fmtRp(gS)}</div></div>
        </div>
        <div style={S.card}><div style={S.cardHead}>Tambah Proyek</div>
          <div style={{display:"flex",gap:8}}><input style={{...S.input,flex:1}} value={pF.name} onChange={e=>setPF({...pF,name:e.target.value})} placeholder="Nama proyek baru" onKeyDown={e=>{if(e.key==="Enter"&&pF.name.trim()){setProjects([...projects,{id:uid(),name:pF.name.trim(),anggaran:0,entries:[],pencairan:[]}]);setPF({name:"",anggaran:""})}}}/>
            {editP?<><button style={S.btnPri} onClick={()=>{if(!pF.name.trim())return;setProjects(projects.map(p=>p.id===editP?{...p,name:pF.name.trim()}:p));setEditP(null);setPF({name:"",anggaran:""})}}>Simpan</button><button style={S.btnSec} onClick={()=>{setEditP(null);setPF({name:"",anggaran:""})}}>Batal</button></>
            :<button style={S.btnPri} onClick={()=>{if(!pF.name.trim())return;setProjects([...projects,{id:uid(),name:pF.name.trim(),anggaran:0,entries:[],pencairan:[]}]);setPF({name:"",anggaran:""})}}>{I.plus} Tambah</button>}
          </div>
        </div>
        <div style={S.card}><div style={S.cardHead}>Daftar Proyek ({projects.length})</div>
          {!projects.length?<div style={S.empty}>Belum ada proyek</div>:
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {projects.map(p=>{const ps=prCalc(p.entries);const pD=(p.entries||[]).reduce((s,x)=>s+(x.debit||0),0);const pK=(p.entries||[]).reduce((s,x)=>s+(x.kredit||0),0);return(
              <div key={p.id} onClick={()=>setDetP(p.id)} style={{background:T.iBg,borderRadius:10,padding:"14px 16px",border:`1px solid ${T.cb}`,cursor:"pointer",transition:"all 0.15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontWeight:600,fontSize:14,color:T.acL}}>{p.name}</div><div style={{fontSize:10,color:T.sub,marginTop:2}}>{(p.entries||[]).length} transaksi</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{textAlign:"right"}}><div style={{fontSize:9,color:T.sub}}>Saldo</div><div style={{fontWeight:700,fontSize:16,color:ps>=0?"#27ae60":"#c0392b"}}>{fmtRp(ps)}</div></div>
                    <div onClick={e=>e.stopPropagation()}><KebabMenu items={[{icon:I.edit,label:"Rename",onClick:()=>{setEditP(p.id);setPF({name:p.name,anggaran:""})}},{icon:I.trash,label:"Hapus",danger:true,onClick:()=>{if(confirm(`Hapus "${p.name}" beserta semua transaksinya?`))setProjects(projects.filter(x=>x.id!==p.id))}}]}/></div>
                  </div>
                </div>
                <div style={{display:"flex",gap:16,marginTop:6,fontSize:11}}>
                  <span style={{color:"#2980b9"}}>Debit: {fmtRp(pD)}</span>
                  <span style={{color:"#c0392b"}}>Kredit: {fmtRp(pK)}</span>
                </div>
              </div>
            )})}
          </div>}
        </div>
      </div>);
    })()}
    {tab==="karyawan"&&(<div>
      <div style={S.grid3}>{[["Total",employees.length,"#1a3c34"],["Aktif",eAkt,"#27ae60"],["Gaji/Bln",fmtRp(tGaji),"#2980b9"]].map(([l,v,c],i)=>(<div key={i} style={{...S.statCard,borderTop:`3px solid ${c}`}}><div style={S.statLbl}>{l}</div><div style={{...S.statVal,color:c,fontSize:typeof v==="string"?15:20}}>{v}</div></div>))}</div>
      <div style={{...S.card,paddingTop:10,paddingBottom:10,marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:"#888"}}>{I.search}</span><input style={{...S.input,border:"none",background:"transparent",paddingLeft:0,fontSize:13}} placeholder="Cari nama, jabatan, departemen..." value={empQ} onChange={e=>setEmpQ(e.target.value)}/>{empQ&&<button style={{...S.iconBtn,color:"#666"}} onClick={()=>setEmpQ("")}>{I.x}</button>}</div></div>
      {!showEF&&<button style={{...S.btnPri,marginBottom:10}} onClick={()=>{setShowEF(true);setEditE(null);setEF({nama:"",jabatan:"",dep:"",gaji:"",telp:"",status:"Aktif"})}}>{I.plus} Tambah</button>}
      {showEF&&<div style={S.card}><div style={S.cardHead}>{editE?"Edit":"Tambah"} Karyawan</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>{[["Nama","nama"],["Jabatan","jabatan"],["Dept","dep"],["Gaji","gaji"],["Telp","telp"]].map(([l,k])=>(<div key={k}><label style={S.lbl}>{l}</label><input style={S.input} type={k==="gaji"?"number":"text"} value={eF[k]} onChange={e=>setEF({...eF,[k]:e.target.value})}/></div>))}<div><label style={S.lbl}>Status</label><select style={S.select} value={eF.status} onChange={e=>setEF({...eF,status:e.target.value})}><option>Aktif</option><option>Nonaktif</option><option>Cuti</option></select></div></div><div style={{display:"flex",gap:6,marginTop:12}}>{editE?<button style={S.btnPri} onClick={()=>{setEmployees(employees.map(e=>e.id===editE?{...e,...eF,gaji:NM(eF.gaji)}:e));setEditE(null);setShowEF(false)}}>Simpan</button>:<button style={S.btnPri} onClick={()=>{if(!eF.nama||!eF.gaji)return;setEmployees([...employees,{id:uid(),...eF,gaji:NM(eF.gaji),slip:mkSlip(),saldo:0,kasbon:0,logKasbon:[],riwayat:[]}]);setEF({nama:"",jabatan:"",dep:"",gaji:"",telp:"",status:"Aktif"});setShowEF(false)}}>{I.plus} Simpan</button>}<button style={S.btnSec} onClick={()=>{setShowEF(false);setEditE(null)}}>Batal</button></div></div>}
      <div style={S.card}><div style={S.cardHead}>Daftar Karyawan {empQ&&<span style={{fontWeight:400,color:"#666",fontSize:11}}>· {fEmp.length} hasil</span>}</div>{!fEmp.length?<div style={S.empty}>{empQ?"Tidak ditemukan":"Belum ada"}</div>:<div style={S.tableWrap}><table style={S.table}><thead><tr><th style={S.th}>No</th><th style={{...S.th,textAlign:"left"}}>Nama</th><th style={{...S.th,textAlign:"left"}}>Jabatan</th><th style={S.th}>Total Diterima</th><th style={S.th}>Kasbon</th><th style={S.th}>Saldo</th><th style={S.th}>Aksi</th></tr></thead><tbody>{fEmp.map((e,i)=>{const cs=calcSlip(e.slip||mkSlip());const td=cs.gajiBersih+(e.saldo||0);return(<tr key={e.id} style={i%2?{background:"rgba(255,255,255,0.03)"}:{}}><td style={S.td}>{i+1}</td><td style={{...S.td,textAlign:"left"}}><div style={{fontWeight:500}}>{e.nama}</div><div style={{fontSize:10,color:"#666"}}>{e.telp}</div></td><td style={{...S.td,textAlign:"left",fontSize:11}}>{e.jabatan}<br/><span style={{...S.badge,background:"rgba(108,99,255,0.15)",color:"#b8b2ff"}}>{e.dep}</span></td><td style={{...S.td,fontWeight:700,color:"#b8b2ff"}}>{fmtRp(td)}</td><td style={{...S.td,fontWeight:600,color:e.kasbon?"#e67e22":"#aaa"}}>{fmtRp(e.kasbon||0)}</td><td style={{...S.td,fontWeight:700,color:(e.saldo||0)>=0?"#27ae60":"#c0392b"}}>{(e.saldo||0)>=0?"+":""}{fmtRp(e.saldo||0)}</td><td style={S.td}><div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap"}}><button style={{...S.btnMini,borderColor:"#6c63ff",color:"#b8b2ff"}} onClick={()=>setSlipE(e.id)}>{I.slip} Slip</button><KebabMenu items={[{icon:I.edit,label:"Edit",onClick:()=>{setEditE(e.id);setEF({nama:e.nama,jabatan:e.jabatan,dep:e.dep,gaji:e.gaji.toString(),telp:e.telp||"",status:e.status});setShowEF(true)}},{icon:I.trash,label:"Hapus",danger:true,onClick:()=>{if(confirm(`Hapus karyawan "${e.nama}"?`))setEmployees(employees.filter(x=>x.id!==e.id))}}]}/></div></td></tr>)})}</tbody></table></div>}</div>
    </div>)}

    {tab==="pengajuan"&&(()=>{
      // Helper: calc saldo for a project
      const calcPg=(ent)=>{let rs=0;return ent.map(x=>{if(x.saldoManual!==null&&x.saldoManual!==undefined)rs=x.saldoManual;else rs=rs+(x.debit||0)-(x.kredit||0);return{...x,saldoCalc:rs}})};
      const pgSaldo=(ent)=>{const r=calcPg(ent);return r.length?r[r.length-1].saldoCalc:0};
      // Global totals
      const gDebit=pengajuan.reduce((s,pg)=>(pg.entries||[]).reduce((a,x)=>a+(x.debit||0),0)+s,0);
      const gKredit=pengajuan.reduce((s,pg)=>(pg.entries||[]).reduce((a,x)=>a+(x.kredit||0),0)+s,0);
      const gSaldo=pengajuan.reduce((s,pg)=>s+pgSaldo(pg.entries||[]),0);
      // Selected project
      const selPg=pengajuan.find(x=>x.id===pgSel);
      const ent=selPg?(selPg.entries||[]):[];
      const rows=selPg?calcPg(ent):[];
      const tD=ent.reduce((s,x)=>s+(x.debit||0),0);
      const tK=ent.reduce((s,x)=>s+(x.kredit||0),0);
      const curSaldo=rows.length?rows[rows.length-1].saldoCalc:0;
      // CRUD
      const updEnt=(newEnt)=>setPengajuan(pengajuan.map(x=>x.id===pgSel?{...x,entries:newEnt}:x));
      const addEnt=()=>{if(!pgF.jumlah||!pgF.ket||!pgSel)return;const j=NM(pgF.jumlah);updEnt([...ent,{id:uid(),tgl:fmtShort(new Date()),ket:pgF.ket,debit:pgF.tipe==="debit"?j:0,kredit:pgF.tipe==="kredit"?j:0,saldoManual:null}]);setPgF({tipe:"debit",jumlah:"",ket:""})};
      const delEnt=(id)=>{if(confirm("Hapus transaksi ini?"))updEnt(ent.filter(x=>x.id!==id))};
      const saveSM=(id)=>{updEnt(ent.map(x=>x.id===id?{...x,saldoManual:NM(editEntSaldo)}:x));setEditEntId(null);setEditEntSaldo("")};
      const resetSM=(id)=>{updEnt(ent.map(x=>x.id===id?{...x,saldoManual:null}:x))};

      return(<div>
        {/* Global Summary */}
        <div style={S.grid3}>
          <div style={{...S.statCard,borderTop:"3px solid #2980b9"}}><div style={S.statLbl}>Total Debit (Semua)</div><div style={{...S.statVal,color:"#2980b9"}}>{fmtRp(gDebit)}</div></div>
          <div style={{...S.statCard,borderTop:"3px solid #c0392b"}}><div style={S.statLbl}>Total Kredit (Semua)</div><div style={{...S.statVal,color:"#c0392b"}}>{fmtRp(gKredit)}</div></div>
          <div style={{...S.statCard,borderTop:`3px solid ${gSaldo>=0?"#27ae60":"#c0392b"}`}}><div style={S.statLbl}>Saldo Global</div><div style={{...S.statVal,color:gSaldo>=0?"#27ae60":"#c0392b"}}>{fmtRp(gSaldo)}</div></div>
        </div>

        {/* Add Project */}
        <div style={S.card}><div style={S.cardHead}>Tambah Proyek Pengajuan</div>
          <div style={{display:"flex",gap:8}}>
            <input style={{...S.input,flex:1}} value={pgNF} onChange={e=>setPgNF(e.target.value)} placeholder="Nama proyek pengajuan baru" onKeyDown={e=>{if(e.key==="Enter"&&pgNF.trim()){setPengajuan([...pengajuan,{id:uid(),name:pgNF.trim(),entries:[]}]);setPgNF("")}}}/>
            {editPgId?<><button style={S.btnPri} onClick={()=>{if(!pgNF.trim())return;setPengajuan(pengajuan.map(x=>x.id===editPgId?{...x,name:pgNF.trim()}:x));setEditPgId(null);setPgNF("")}}>Simpan</button><button style={S.btnSec} onClick={()=>{setEditPgId(null);setPgNF("")}}>Batal</button></>
            :<button style={S.btnPri} onClick={()=>{if(!pgNF.trim())return;setPengajuan([...pengajuan,{id:uid(),name:pgNF.trim(),entries:[]}]);setPgNF("")}}>{I.plus} Tambah</button>}
          </div>
        </div>

        {/* Project List */}
        <div style={S.card}><div style={S.cardHead}>Daftar Proyek Pengajuan ({pengajuan.length})</div>
          {!pengajuan.length?<div style={S.empty}>Belum ada proyek pengajuan</div>:
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {pengajuan.map(pg=>{const ps=pgSaldo(pg.entries||[]);const pD=(pg.entries||[]).reduce((s,x)=>s+(x.debit||0),0);const pK=(pg.entries||[]).reduce((s,x)=>s+(x.kredit||0),0);return(
              <div key={pg.id} onClick={()=>setPgSel(pg.id)} style={{background:pgSel===pg.id?"#f0faf7":"#fafbfc",border:pgSel===pg.id?"2px solid #1a3c34":"2px solid transparent",borderRadius:10,padding:"12px 16px",cursor:"pointer",transition:"all 0.15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontWeight:600,fontSize:13,color:"#b8b2ff"}}>{pg.name}</div><div style={{fontSize:10,color:"#666",marginTop:2}}>{(pg.entries||[]).length} transaksi</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#666"}}>Saldo</div><div style={{fontWeight:700,fontSize:15,color:ps>=0?"#27ae60":"#c0392b"}}>{fmtRp(ps)}</div></div>
                    <KebabMenu items={[{icon:I.edit,label:"Rename",onClick:()=>{setEditPgId(pg.id);setPgNF(pg.name)}},{icon:I.trash,label:"Hapus Proyek",danger:true,onClick:()=>{if(confirm(`Hapus "${pg.name}" beserta semua transaksinya?`)){setPengajuan(pengajuan.filter(x=>x.id!==pg.id));if(pgSel===pg.id)setPgSel(null)}}}]}/>
                  </div>
                </div>
                <div style={{display:"flex",gap:16,marginTop:6,fontSize:11}}>
                  <span style={{color:"#2980b9"}}>Debit: {fmtRp(pD)}</span>
                  <span style={{color:"#c0392b"}}>Kredit: {fmtRp(pK)}</span>
                </div>
              </div>
            )})}
          </div>}
        </div>

        {/* Selected Project Detail */}
        {selPg&&(<>
          <div style={{...S.card,border:"2px solid #6c63ff"}}><div style={{fontSize:14,fontWeight:700,color:"#b8b2ff",marginBottom:12,paddingBottom:7,borderBottom:"2px solid #ede7f6"}}>{selPg.name}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              <div style={{background:"rgba(41,128,185,0.12)",borderRadius:8,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:"#2980b9"}}>Debit</div><div style={{fontSize:16,fontWeight:700,color:"#2980b9"}}>{fmtRp(tD)}</div></div>
              <div style={{background:"rgba(255,107,107,0.1)",borderRadius:8,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:"#c0392b"}}>Kredit</div><div style={{fontSize:16,fontWeight:700,color:"#c0392b"}}>{fmtRp(tK)}</div></div>
              <div style={{background:curSaldo>=0?"#e8f5e9":"#fce4ec",borderRadius:8,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:curSaldo>=0?"#27ae60":"#c0392b"}}>Saldo</div><div style={{fontSize:16,fontWeight:700,color:curSaldo>=0?"#27ae60":"#c0392b"}}>{fmtRp(curSaldo)}</div></div>
            </div>
          </div>

          <div style={S.card}><div style={S.cardHead}>Catat Transaksi</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8}}>
              <div><label style={S.lbl}>Tipe</label><select style={S.select} value={pgF.tipe} onChange={e=>setPgF({...pgF,tipe:e.target.value})}><option value="debit">Debit (Masuk)</option><option value="kredit">Kredit (Keluar)</option></select></div>
              <div><label style={S.lbl}>Jumlah</label><input style={S.input} type="number" value={pgF.jumlah} onChange={e=>setPgF({...pgF,jumlah:e.target.value})} placeholder="Nominal"/></div>
              <div><label style={S.lbl}>Keterangan</label><input style={S.input} value={pgF.ket} onChange={e=>setPgF({...pgF,ket:e.target.value})} placeholder="Keterangan transaksi"/></div>
            </div>
            <button style={{...S.btnPri,marginTop:12}} onClick={addEnt}>{pgF.tipe==="debit"?I.down:I.up} Catat {pgF.tipe==="debit"?"Debit":"Kredit"}</button>
          </div>

          <div style={S.card}><div style={S.cardHead}>Riwayat ({ent.length} transaksi)</div>
            {!rows.length?<div style={S.empty}>Belum ada transaksi</div>:
            <div style={S.tableWrap}><table style={S.table}><thead><tr>
              <th style={S.th}>No</th><th style={{...S.th,textAlign:"left"}}>Tanggal</th><th style={{...S.th,textAlign:"left"}}>Keterangan</th>
              <th style={{...S.th,color:"#2980b9"}}>Debit</th><th style={{...S.th,color:"#c0392b"}}>Kredit</th><th style={{...S.th,fontWeight:700}}>Saldo</th><th style={S.th}>Aksi</th>
            </tr></thead><tbody>
              {rows.map((r,i)=>(<tr key={r.id} style={i%2?{background:"rgba(255,255,255,0.03)"}:{}}>
                <td style={S.td}>{i+1}</td>
                <td style={{...S.td,textAlign:"left",fontSize:11}}>{r.tgl}</td>
                <td style={{...S.td,textAlign:"left",fontWeight:500,fontSize:12}}>{r.ket}</td>
                <td style={{...S.td,fontWeight:600,color:r.debit?"#2980b9":"#ddd"}}>{r.debit?fmtRp(r.debit):"-"}</td>
                <td style={{...S.td,fontWeight:600,color:r.kredit?"#c0392b":"#ddd"}}>{r.kredit?fmtRp(r.kredit):"-"}</td>
                <td style={S.td}>{editEntId===r.id?
                  <div style={{display:"flex",gap:3,alignItems:"center",justifyContent:"center"}}><input style={{...S.input,width:100,padding:"4px 6px",fontSize:11,textAlign:"right"}} type="number" value={editEntSaldo} onChange={e=>setEditEntSaldo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveSM(r.id)} autoFocus/><button style={{...S.btnMini,borderColor:"#27ae60",color:"#27ae60",padding:"2px 6px"}} onClick={()=>saveSM(r.id)}>{I.save}</button><button style={{...S.btnMini,borderColor:"#999",color:"#666",padding:"2px 6px"}} onClick={()=>{setEditEntId(null);setEditEntSaldo("")}}>{I.x}</button></div>
                  :<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><span style={{fontWeight:700,color:r.saldoCalc>=0?"#27ae60":"#c0392b"}}>{fmtRp(r.saldoCalc)}</span>{r.saldoManual!==null&&r.saldoManual!==undefined&&<span style={{fontSize:8,color:"#e67e22",fontWeight:700}} title="Diedit manual">✎</span>}</div>
                }</td>
                <td style={S.td}><KebabMenu items={[
                  {icon:I.edit,label:"Edit Saldo",onClick:()=>{setEditEntId(r.id);setEditEntSaldo(r.saldoCalc.toString())}},
                  ...(r.saldoManual!==null&&r.saldoManual!==undefined?[{icon:I.ret,label:"Reset Saldo",onClick:()=>resetSM(r.id)}]:[]),
                  {icon:I.trash,label:"Hapus",danger:true,onClick:()=>delEnt(r.id)}
                ]}/></td>
              </tr>))}
              <tr style={{background:"rgba(255,255,255,0.04)"}}><td colSpan="3" style={{...S.td,textAlign:"right",fontWeight:700}}>Total</td><td style={{...S.td,fontWeight:700,color:"#2980b9"}}>{fmtRp(tD)}</td><td style={{...S.td,fontWeight:700,color:"#c0392b"}}>{fmtRp(tK)}</td><td style={{...S.td,fontWeight:700,color:curSaldo>=0?"#27ae60":"#c0392b"}}>{fmtRp(curSaldo)}</td><td style={S.td}/></tr>
            </tbody></table></div>}
          </div>
        </>)}
      </div>);
    })()}

    {tab==="pinjaman"&&(()=>{
      const pgCalcS=(ent)=>{let rs=0;(ent||[]).forEach(x=>{if(x.saldoManual!=null)rs=x.saldoManual;else rs=rs+(x.debit||0)-(x.kredit||0)});return rs};
      const pgAll=pengajuan||[];
      // Gabungan: proyek biasa (saldo = sisa anggaran) + proyek pengajuan (saldo = debit-kredit)
      const allP=[
        ...projects.map(p=>{let rs=0;(p.entries||[]).forEach(x=>{if(x.saldoManual!=null)rs=x.saldoManual;else rs=rs+(x.debit||0)-(x.kredit||0)});return{id:p.id,name:p.name,saldo:rs,tipe:"proyek"}}),
        ...pgAll.map(pg=>({id:pg.id,name:pg.name,saldo:pgCalcS(pg.entries),tipe:"pengajuan"}))
      ];
      const dariP=allP.find(x=>x.id===lF.dari);
      const keP=allP.find(x=>x.id===lF.ke);
      const jml=NM(lF.jumlah);
      const saldoKurang=dariP&&jml>0&&jml>dariP.saldo;

      const buatPinjaman=()=>{
        if(!lF.dari||!lF.ke||!lF.jumlah||lF.dari===lF.ke)return;
        if(saldoKurang){alert(`Saldo ${dariP.name} tidak cukup! Saldo: ${fmtRp(dariP.saldo)}, Pinjaman: ${fmtRp(jml)}`);return}
        const now=fmtShort(new Date());const ketD=`Pinjam ke ${keP.name}${lF.ket?" — "+lF.ket:""}`;const ketK=`Pinjam dari ${dariP.name}${lF.ket?" — "+lF.ket:""}`;
        // Catat di proyek pemberi (kredit/keluar)
        if(dariP.tipe==="pengajuan"){setPengajuan(pengajuan.map(p=>p.id===lF.dari?{...p,entries:[...(p.entries||[]),{id:uid(),tgl:now,ket:ketD,debit:0,kredit:jml,saldoManual:null}]}:p))}
        if(dariP.tipe==="proyek"){setProjects(projects.map(p=>p.id===lF.dari?{...p,entries:[...(p.entries||[]),{id:uid(),tgl:now,ket:ketD,debit:0,kredit:jml,saldoManual:null}]}:p))}
        // Catat di proyek penerima (debit/masuk)
        if(keP.tipe==="pengajuan"){setPengajuan(prev=>prev.map(p=>p.id===lF.ke?{...p,entries:[...(p.entries||[]),{id:uid(),tgl:now,ket:ketK,debit:jml,kredit:0,saldoManual:null}]}:p))}
        if(keP.tipe==="proyek"){setProjects(prev=>prev.map(p=>p.id===lF.ke?{...p,entries:[...(p.entries||[]),{id:uid(),tgl:now,ket:ketK,debit:jml,kredit:0,saldoManual:null}]}:p))}
        setLoans([...loans,{id:uid(),dariId:lF.dari,keId:lF.ke,dari:dariP.name,ke:keP.name,dariTipe:dariP.tipe,keTipe:keP.tipe,jumlah:jml,ket:lF.ket,tgl:fmtTgl(new Date())}]);
        setLF({dari:"",ke:"",jumlah:"",ket:""});
      };

      const kembalikan=(loan)=>{
        const now=fmtShort(new Date());
        const keCheck=allP.find(x=>x.id===loan.keId||x.name===loan.ke);
        if(keCheck&&loan.jumlah>keCheck.saldo){alert(`Saldo ${keCheck.name} tidak cukup! Saldo: ${fmtRp(keCheck.saldo)}`);return}
        // Catat pengembalian di pengajuan
        setPengajuan(prev=>prev.map(p=>{
          if((p.id===loan.dariId||p.name===loan.dari)&&loan.dariTipe==="pengajuan"){return{...p,entries:[...(p.entries||[]),{id:uid(),tgl:now,ket:`Pengembalian dari ${loan.ke}`,debit:loan.jumlah,kredit:0,saldoManual:null}]}}
          if((p.id===loan.keId||p.name===loan.ke)&&loan.keTipe==="pengajuan"){return{...p,entries:[...(p.entries||[]),{id:uid(),tgl:now,ket:`Pengembalian ke ${loan.dari}`,debit:0,kredit:loan.jumlah,saldoManual:null}]}}
          return p;
        }));
        // Catat pengembalian di proyek biasa
        setProjects(prev=>prev.map(p=>{
          if((p.id===loan.dariId||p.name===loan.dari)&&loan.dariTipe==="proyek"){return{...p,entries:[...(p.entries||[]),{id:uid(),tgl:now,ket:`Pengembalian dari ${loan.ke}`,debit:loan.jumlah,kredit:0,saldoManual:null}]}}
          if((p.id===loan.keId||p.name===loan.ke)&&loan.keTipe==="proyek"){return{...p,entries:[...(p.entries||[]),{id:uid(),tgl:now,ket:`Pengembalian ke ${loan.dari}`,debit:0,kredit:loan.jumlah,saldoManual:null}]}}
          return p;
        }));
        setLoans(loans.filter(x=>x.id!==loan.id));
      };

      return(<div>
        <div style={S.card}><div style={S.cardHead}>Pinjaman Antar Proyek</div>
          {allP.length<2?<div style={S.empty}>Perlu minimal 2 proyek</div>:<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
              <div><label style={S.lbl}>Dari (Pemberi)</label>
                <select style={S.select} value={lF.dari} onChange={e=>setLF({...lF,dari:e.target.value})}>
                  <option value="">— Pilih —</option>
                  {allP.filter(p=>p.id!==lF.ke).map(p=>(<option key={p.id} value={p.id}>{p.name} — {fmtRp(p.saldo)}</option>))}
                </select>
                {dariP&&<div style={{fontSize:10,marginTop:4,color:dariP.saldo>0?"#00ff88":"#ff6b6b",fontWeight:600}}>Saldo: {fmtRp(dariP.saldo)} ({dariP.tipe==="proyek"?"Proyek":"Pengajuan"})</div>}
              </div>
              <div><label style={S.lbl}>Ke (Penerima)</label>
                <select style={S.select} value={lF.ke} onChange={e=>setLF({...lF,ke:e.target.value})}>
                  <option value="">— Pilih —</option>
                  {allP.filter(p=>p.id!==lF.dari).map(p=>(<option key={p.id} value={p.id}>{p.name} — {fmtRp(p.saldo)}</option>))}
                </select>
              </div>
              <div><label style={S.lbl}>Jumlah</label><input style={{...S.input,borderColor:saldoKurang?"#ff6b6b":T.iBr}} type="number" value={lF.jumlah} onChange={e=>setLF({...lF,jumlah:e.target.value})}/>
                {saldoKurang&&<div style={{fontSize:10,color:"#ff6b6b",marginTop:4,fontWeight:600}}>⚠ Saldo tidak cukup! Tersedia: {fmtRp(dariP.saldo)}</div>}
              </div>
              <div><label style={S.lbl}>Keterangan</label><input style={S.input} value={lF.ket} onChange={e=>setLF({...lF,ket:e.target.value})} placeholder="Opsional"/></div>
            </div>
            <button style={{...S.btnPri,marginTop:12,opacity:saldoKurang?.5:1}} onClick={buatPinjaman} disabled={saldoKurang}>Buat Pinjaman</button>
          </>}
        </div>

        <div style={S.card}><div style={S.cardHead}>Pinjaman Aktif ({loans.length})</div>
          {!loans.length?<div style={S.empty}>Tidak ada pinjaman aktif</div>:
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {loans.map(l=>(
              <div key={l.id} style={{background:T.iBg,borderRadius:10,padding:"12px 16px",border:`1px solid ${T.cb}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <span style={{fontWeight:700,color:"#ff6b6b"}}>{l.dari}</span>
                      <span style={{color:T.mut,fontSize:16}}>→</span>
                      <span style={{fontWeight:700,color:"#00ff88"}}>{l.ke}</span>
                    </div>
                    <div style={{fontSize:10,color:T.sub}}>{l.tgl}{l.ket&&` · ${l.ket}`}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontWeight:800,fontSize:16,color:T.tx}}>{fmtRp(l.jumlah)}</span>
                    <button style={S.btnRet} onClick={()=>kembalikan(l)}>{I.ret} Kembalikan</button>
                  </div>
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>);
    })()}

    {tab==="transaksi"&&(<div>
      <div style={S.card}><div style={S.cardHead}>Catat Transaksi</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}><div><label style={S.lbl}>Tipe</label><select style={S.select} value={tF.tipe} onChange={e=>setTF({...tF,tipe:e.target.value})}><option value="masuk">Masuk</option><option value="keluar">Keluar</option></select></div><div><label style={S.lbl}>Jumlah</label><input style={S.input} type="number" value={tF.jumlah} onChange={e=>setTF({...tF,jumlah:e.target.value})}/></div><div><label style={S.lbl}>Proyek</label><select style={S.select} value={tF.proyek} onChange={e=>setTF({...tF,proyek:e.target.value})}><option value="">Umum</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div><label style={S.lbl}>Ket</label><input style={S.input} value={tF.ket} onChange={e=>setTF({...tF,ket:e.target.value})}/></div></div><button style={{...S.btnPri,marginTop:12}} onClick={()=>{if(!tF.jumlah||!tF.ket)return;setTx([{id:uid(),tipe:tF.tipe,jumlah:NM(tF.jumlah),ket:tF.ket,proyek:tF.proyek?projects.find(p=>p.id===tF.proyek)?.name:"-",tgl:fmtTgl(new Date())},...tx]);setTF({tipe:"masuk",jumlah:"",ket:"",proyek:""})}}>{tF.tipe==="masuk"?I.down:I.up} Catat</button></div>
      <div style={S.grid2}>{[["Masuk",fmtRp(tIn),"#27ae60"],["Keluar",fmtRp(tOut),"#c0392b"]].map(([l,v,c],i)=>(<div key={i} style={{...S.statCard,borderTop:`3px solid ${c}`}}><div style={S.statLbl}>{l}</div><div style={{...S.statVal,color:c}}>{v}</div></div>))}</div>
      <div style={S.card}><div style={S.cardHead}>Riwayat</div>{!tx.length?<div style={S.empty}>Belum ada</div>:<div style={{display:"flex",flexDirection:"column",gap:6}}>{tx.map(t=>(<div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",gap:6}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:t.tipe==="masuk"?"#e8f5e9":"#fce4ec",color:t.tipe==="masuk"?"#27ae60":"#c0392b",flexShrink:0}}>{t.tipe==="masuk"?I.down:I.up}</div><div><div style={{fontSize:12,fontWeight:500}}>{t.ket}</div><div style={{fontSize:10,color:"#666"}}>{t.tgl}{t.proyek!=="-"&&<span style={{display:"inline-block",background:"rgba(108,99,255,0.15)",color:"#b8b2ff",padding:"0 6px",borderRadius:4,fontSize:9,fontWeight:600,marginLeft:5}}>{t.proyek}</span>}</div></div></div><span style={{fontWeight:600,fontSize:13,color:t.tipe==="masuk"?"#27ae60":"#c0392b",whiteSpace:"nowrap"}}>{t.tipe==="masuk"?"+":"−"}{fmtRp(t.jumlah)}</span></div>))}</div>}</div>
    </div>)}

    {tab==="akun"&&(<div>
      <div style={S.grid2}>
        <div style={{...S.statCard,borderTop:"3px solid #1a3c34"}}><div style={S.statLbl}>Total Akun</div><div style={S.statVal}>{accounts.length}</div></div>
        <div style={{...S.statCard,borderTop:"3px solid #7c3aed"}}><div style={S.statLbl}>Login Saat Ini</div><div style={{fontSize:16,fontWeight:700,color:"#b8b2ff"}}>{acc.nama} ({acc.role})</div></div>
      </div>

      <div style={S.card}><div style={S.cardHead}>{editAkun?"Edit Akun":"Tambah Akun Baru"}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
          <div><label style={S.lbl}>Username</label><input style={S.input} value={akunF.username} onChange={e=>setAkunF({...akunF,username:e.target.value})} placeholder="username"/></div>
          <div><label style={S.lbl}>Password</label><input style={S.input} value={akunF.password} onChange={e=>setAkunF({...akunF,password:e.target.value})} placeholder="password"/></div>
          <div><label style={S.lbl}>Nama Lengkap</label><input style={S.input} value={akunF.nama} onChange={e=>setAkunF({...akunF,nama:e.target.value})} placeholder="Nama"/></div>
          <div><label style={S.lbl}>Role</label><select style={S.select} value={akunF.role} onChange={e=>setAkunF({...akunF,role:e.target.value})}><option value="Admin">Admin</option><option value="Bendahara">Bendahara</option></select></div>
        </div>
        <div style={{display:"flex",gap:6,marginTop:12}}>
          {editAkun?<><button style={S.btnPri} onClick={()=>{if(!akunF.username||!akunF.password||!akunF.nama)return;setAccounts(accounts.map(a=>a.username===editAkun?{...akunF}:a));setEditAkun(null);setAkunF({username:"",password:"",nama:"",role:"Bendahara"})}}>Simpan</button><button style={S.btnSec} onClick={()=>{setEditAkun(null);setAkunF({username:"",password:"",nama:"",role:"Bendahara"})}}>Batal</button></>
          :<button style={S.btnPri} onClick={()=>{if(!akunF.username||!akunF.password||!akunF.nama)return;if(accounts.find(a=>a.username===akunF.username)){alert("Username sudah dipakai!");return}setAccounts([...accounts,{...akunF}]);setAkunF({username:"",password:"",nama:"",role:"Bendahara"})}}>{I.plus} Tambah Akun</button>}
        </div>
      </div>

      <div style={S.card}><div style={S.cardHead}>Daftar Akun</div>
        <div style={S.tableWrap}><table style={S.table}><thead><tr>
          <th style={S.th}>No</th>
          <th style={{...S.th,textAlign:"left"}}>Nama</th>
          <th style={S.th}>Username</th>
          <th style={S.th}>Password</th>
          <th style={S.th}>Role</th>
          <th style={S.th}>Aksi</th>
        </tr></thead><tbody>
          {accounts.map((a,i)=>(<tr key={a.username} style={i%2?{background:"rgba(255,255,255,0.03)"}:{}}>
            <td style={S.td}>{i+1}</td>
            <td style={{...S.td,textAlign:"left",fontWeight:500}}>{a.nama}{a.username===acc.username&&<span style={{...S.badge,background:"rgba(124,58,237,0.12)",color:"#b8b2ff",marginLeft:6}}>Anda</span>}</td>
            <td style={S.td}>{a.username}</td>
            <td style={S.td}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><span style={{fontFamily:"monospace",fontSize:11}}>{showPass[a.username]?a.password:"••••••"}</span><button style={{...S.iconBtn,color:"#888"}} onClick={()=>setShowPass({...showPass,[a.username]:!showPass[a.username]})}>{showPass[a.username]?I.eyeOff("#888"):I.eye("#888")}</button></div></td>
            <td style={S.td}><span style={{...S.badge,background:a.role==="Admin"?"#e3f2fd":"#e8f5e9",color:a.role==="Admin"?"#2980b9":"#27ae60"}}>{a.role}</span></td>
            <td style={S.td}><KebabMenu items={[{icon:I.edit,label:"Edit",onClick:()=>{setEditAkun(a.username);setAkunF({username:a.username,password:a.password,nama:a.nama,role:a.role})}},...(a.username!==acc.username?[{icon:I.trash,label:"Hapus",danger:true,onClick:()=>{if(confirm(`Hapus akun "${a.nama}"?`))setAccounts(accounts.filter(x=>x.username!==a.username))}}]:[])
            ]}/></td>
          </tr>))}
        </tbody></table></div>
      </div>
    </div>)}
    {tab==="settings"&&(<div>
      <div style={S.card}><div style={S.cardHead}>{L.tema}</div>
        <div style={{fontSize:12,color:T.sub,marginBottom:14}}>{L.pilihTema}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
          {Object.values(THEMES).map(th=>(<div key={th.id} onClick={()=>{setTheme(th.id);saveSetting("theme",th.id)}} style={{cursor:"pointer",borderRadius:12,padding:14,background:th.card,border:theme===th.id?`3px solid ${th.ac}`:`3px solid ${th.cb||"transparent"}`,transition:"all 0.2s",position:"relative"}}>
            <div style={{display:"flex",gap:5,marginBottom:8}}>{[th.bg,th.card,th.ac].map((c,i)=><div key={i} style={{width:20,height:20,borderRadius:"50%",background:c,border:"2px solid rgba(128,128,128,0.2)"}}/>)}</div>
            <div style={{fontSize:13,fontWeight:700,color:th.tx||"#fff"}}>{th.emoji} {lang==="en"?th.nameEn:th.name}</div>
            {theme===th.id&&<div style={{position:"absolute",top:8,right:10,fontSize:14}}>✓</div>}
          </div>))}
        </div>
      </div>

      <div style={S.card}><div style={S.cardHead}>{L.bahasa}</div>
        <div style={{fontSize:12,color:T.sub,marginBottom:14}}>{L.pilihBahasa}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["id","🇮🇩","Indonesia","Bahasa Indonesia"],["en","🇬🇧","English","English Language"]].map(([id,fl,nm,desc])=>(<div key={id} onClick={()=>{setLang(id);saveSetting("lang",id)}} style={{cursor:"pointer",borderRadius:12,padding:16,background:T.card,border:lang===id?`3px solid ${T.ac}`:`3px solid ${T.cb}`,transition:"all 0.2s",textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:6}}>{fl}</div>
            <div style={{fontSize:14,fontWeight:700,color:T.tx}}>{nm}</div>
            <div style={{fontSize:10,color:T.sub,marginTop:2}}>{desc}</div>
            {lang===id&&<div style={{marginTop:6,fontSize:10,fontWeight:700,color:T.ac}}>✓ {lang==="id"?"Aktif":"Active"}</div>}
          </div>))}
        </div>
      </div>

      <div style={S.card}><div style={S.cardHead}>{lang==="id"?"Informasi Aplikasi":"App Info"}</div>
        <div style={{fontSize:12,color:T.sub,lineHeight:2}}>
          <div><b>Aplikasi:</b> Administrasi Keuangan DRT DN2</div>
          <div><b>Versi:</b> 1.9</div>
          <div><b>Database:</b> Supabase (Singapore)</div>
          <div><b>Login:</b> {acc.nama} ({acc.role})</div>
        </div>
      </div>
    </div>)}

  </main></div></div>);
}

// ── Project Detail ──
function PD({p,onBack,onU,S,T}){
  const[pnF,setPnF]=useState({tipe:"debit",jumlah:"",ket:""});const[editPnId,setEditPnId]=useState(null);const[editPnSaldo,setEditPnSaldo]=useState("");
  const ent=p.entries||[];
  const tD=ent.reduce((s,x)=>s+(x.debit||0),0);const tK=ent.reduce((s,x)=>s+(x.kredit||0),0);
  let runS=0;const rows=ent.map(x=>{if(x.saldoManual!=null)runS=x.saldoManual;else runS=runS+(x.debit||0)-(x.kredit||0);return{...x,saldoCalc:runS}});
  const curSaldo=rows.length?rows[rows.length-1].saldoCalc:0;
  const updEnt=(ne)=>onU({...p,entries:ne});
  const addEnt=()=>{if(!pnF.jumlah||!pnF.ket)return;const j=NM(pnF.jumlah);updEnt([...ent,{id:uid(),tgl:fmtShort(new Date()),ket:pnF.ket,debit:pnF.tipe==="debit"?j:0,kredit:pnF.tipe==="kredit"?j:0,saldoManual:null}]);setPnF({tipe:"debit",jumlah:"",ket:""})};
  const delEnt=(id)=>{if(confirm("Hapus transaksi ini?"))updEnt(ent.filter(x=>x.id!==id))};
  const saveSM=(id)=>{updEnt(ent.map(x=>x.id===id?{...x,saldoManual:NM(editPnSaldo)}:x));setEditPnId(null);setEditPnSaldo("")};
  const resetSM=(id)=>{updEnt(ent.map(x=>x.id===id?{...x,saldoManual:null}:x))};

  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><button style={S.btnGhost} onClick={onBack}>{I.back} Kembali</button><h3 style={{flex:1,fontSize:16,fontWeight:700,color:T.acL}}>{p.name}</h3></div>
    <div style={S.grid3}>
      <div style={{...S.statCard,borderTop:"3px solid #2980b9"}}><div style={S.statLbl}>Total Debit</div><div style={{...S.statVal,color:"#2980b9"}}>{fmtRp(tD)}</div></div>
      <div style={{...S.statCard,borderTop:"3px solid #c0392b"}}><div style={S.statLbl}>Total Kredit</div><div style={{...S.statVal,color:"#c0392b"}}>{fmtRp(tK)}</div></div>
      <div style={{...S.statCard,borderTop:`3px solid ${curSaldo>=0?"#27ae60":"#c0392b"}`}}><div style={S.statLbl}>Saldo</div><div style={{...S.statVal,color:curSaldo>=0?"#27ae60":"#c0392b"}}>{fmtRp(curSaldo)}</div></div>
    </div>
    <div style={S.card}><div style={S.cardHead}>Catat Transaksi</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8}}>
        <div><label style={S.lbl}>Tipe</label><select style={S.select} value={pnF.tipe} onChange={e=>setPnF({...pnF,tipe:e.target.value})}><option value="debit">Debit (Masuk)</option><option value="kredit">Kredit (Keluar)</option></select></div>
        <div><label style={S.lbl}>Jumlah</label><input style={S.input} type="number" value={pnF.jumlah} onChange={e=>setPnF({...pnF,jumlah:e.target.value})} placeholder="Nominal"/></div>
        <div><label style={S.lbl}>Keterangan</label><input style={S.input} value={pnF.ket} onChange={e=>setPnF({...pnF,ket:e.target.value})} placeholder="Keterangan transaksi"/></div>
      </div>
      <button style={{...S.btnPri,marginTop:12}} onClick={addEnt}>{pnF.tipe==="debit"?I.down:I.up} Catat {pnF.tipe==="debit"?"Debit":"Kredit"}</button>
    </div>
    <div style={S.card}><div style={S.cardHead}>Riwayat ({ent.length} transaksi)</div>
      {!rows.length?<div style={S.empty}>Belum ada transaksi</div>:
      <div style={S.tableWrap}><table style={S.table}><thead><tr>
        <th style={S.th}>No</th><th style={{...S.th,textAlign:"left"}}>Tanggal</th><th style={{...S.th,textAlign:"left"}}>Keterangan</th>
        <th style={{...S.th,color:"#2980b9"}}>Debit</th><th style={{...S.th,color:"#c0392b"}}>Kredit</th><th style={{...S.th,fontWeight:700}}>Saldo</th><th style={S.th}>Aksi</th>
      </tr></thead><tbody>
        {rows.map((r,i)=>(<tr key={r.id} style={i%2?{background:`${T.ac}08`}:{}}>
          <td style={S.td}>{i+1}</td>
          <td style={{...S.td,textAlign:"left",fontSize:11}}>{r.tgl}</td>
          <td style={{...S.td,textAlign:"left",fontWeight:500,fontSize:12}}>{r.ket}</td>
          <td style={{...S.td,fontWeight:600,color:r.debit?"#2980b9":T.mut}}>{r.debit?fmtRp(r.debit):"-"}</td>
          <td style={{...S.td,fontWeight:600,color:r.kredit?"#c0392b":T.mut}}>{r.kredit?fmtRp(r.kredit):"-"}</td>
          <td style={S.td}>{editPnId===r.id?
            <div style={{display:"flex",gap:3,alignItems:"center",justifyContent:"center"}}><input style={{...S.input,width:100,padding:"4px 6px",fontSize:11,textAlign:"right"}} type="number" value={editPnSaldo} onChange={e=>setEditPnSaldo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveSM(r.id)} autoFocus/><button style={{...S.btnMini,borderColor:"#27ae60",color:"#27ae60",padding:"3px 8px"}} onClick={()=>saveSM(r.id)}>{I.save}</button><button style={{...S.btnMini,borderColor:T.sub,color:T.sub,padding:"3px 8px"}} onClick={()=>{setEditPnId(null);setEditPnSaldo("")}}>{I.x}</button></div>
            :<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><span style={{fontWeight:700,color:r.saldoCalc>=0?"#27ae60":"#c0392b"}}>{fmtRp(r.saldoCalc)}</span>{r.saldoManual!=null&&<span style={{fontSize:8,color:"#e67e22",fontWeight:700}} title="Diedit manual">✎</span>}</div>
          }</td>
          <td style={S.td}><KebabMenu items={[
            {icon:I.edit,label:"Edit Saldo",onClick:()=>{setEditPnId(r.id);setEditPnSaldo(r.saldoCalc.toString())}},
            ...(r.saldoManual!=null?[{icon:I.ret,label:"Reset Saldo",onClick:()=>resetSM(r.id)}]:[]),
            {icon:I.trash,label:"Hapus",danger:true,onClick:()=>delEnt(r.id)}
          ]}/></td>
        </tr>))}
        <tr style={{background:`${T.ac}08`}}><td colSpan="3" style={{...S.td,textAlign:"right",fontWeight:700}}>Total</td><td style={{...S.td,fontWeight:700,color:"#2980b9"}}>{fmtRp(tD)}</td><td style={{...S.td,fontWeight:700,color:"#c0392b"}}>{fmtRp(tK)}</td><td style={{...S.td,fontWeight:700,color:curSaldo>=0?"#27ae60":"#c0392b"}}>{fmtRp(curSaldo)}</td><td style={S.td}/></tr>
      </tbody></table></div>}
    </div>
  </div>);
}
// ══════ ROOT APP ══════
export default function App(){
  const[acct,setAcct]=useState(null);
  const[appData,setAppData]=useState(null);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState("");

  // Load data from Supabase on mount
  useEffect(()=>{
    loadData().then(data=>{
      setAppData(data||defaultData());
      setLoading(false);
    }).catch(err=>{
      console.error("Load error:",err);
      setAppData(defaultData());
      setLoading(false);
      setError("Gagal memuat dari database, menggunakan data lokal");
    });
  },[]);

  const handleSave=useCallback(async(data)=>{
    try{
      await saveData(data);
      setAppData(prev=>({...prev,...data}));
    }catch(err){console.error("Save error:",err)}
  },[]);

  const curTheme=THEMES[appData?.settings?.theme]||THEMES.dark;

  if(loading)return(
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",minHeight:"100vh",background:curTheme.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{mkCSS(curTheme)}</style>
      <div style={{width:64,height:64,borderRadius:14,background:curTheme.card,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${curTheme.cb}`}}><img src={LOGO_IMG} style={{width:48,height:"auto"}} alt="DRT"/></div>
      <div style={{color:curTheme.sub,fontSize:14,fontWeight:500}}>Memuat data...</div>
    </div>
  );

  if(!acct)return <LoginPage onLogin={setAcct} accounts={appData?.accounts||ACCTS} T={curTheme}/>;

  return <MainApp account={acct} onLogout={()=>setAcct(null)} appData={appData} setAppData={setAppData} onSave={handleSave}/>;
}

const mkS=(t)=>({
  shell:{fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",minHeight:"100vh",background:t.bg,color:t.tx,justifyContent:"center"},
  side:{width:240,background:`linear-gradient(180deg,${t.sA},${t.sB})`,color:"#fff",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:100,transform:"translateX(-100%)",transition:"transform 0.25s ease",borderRight:`1px solid ${t.cb}`},sideOpen:{transform:"translateX(0)"},sideOver:{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:99},sideBrand:{padding:"16px 14px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(255,255,255,0.06)"},sideLogo:{width:36,height:36,borderRadius:8,background:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},sideBT:{fontSize:13,fontWeight:700,color:"#e0e0f0"},sideBS:{fontSize:9,opacity:.4},sideX:{marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",padding:4},sideNav:{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2},sideItem:{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",borderRadius:8,border:"none",background:"transparent",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:12,fontWeight:500,textAlign:"left",width:"100%"},sideItemA:{background:t.acBg,color:t.acL,fontWeight:600},sideBot:{padding:"10px 10px 14px",borderTop:"1px solid rgba(255,255,255,0.06)"},sideUser:{display:"flex",alignItems:"center",gap:8,marginBottom:8},sideAv:{width:30,height:30,borderRadius:"50%",background:t.acBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:t.acL},sideLogout:{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",borderRadius:7,border:"none",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:11,width:"100%"},
  content:{width:"100%",maxWidth:780,display:"flex",flexDirection:"column",minHeight:"100vh",margin:"0 auto"},
  topbar:{background:t.card,padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50,borderBottom:`1px solid ${t.cb}`},menuBtn:{background:"none",border:"none",cursor:"pointer",color:t.sub,padding:3,display:"flex"},pageTitle:{fontSize:16,fontWeight:700,color:t.tx},
  topClock:{display:"flex",flexDirection:"column",alignItems:"flex-end"},topTime:{fontSize:17,fontWeight:300,color:t.sub,fontVariantNumeric:"tabular-nums"},topDate:{fontSize:10,color:t.mut},
  main:{padding:"20px 16px",flex:1},
  grid4:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:18},grid3:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:14},grid2:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:10,marginBottom:14},
  statCard:{background:t.card,borderRadius:12,padding:"14px 16px",border:`1px solid ${t.cb}`},statLbl:{fontSize:10,fontWeight:500,color:t.mut,marginBottom:4},statVal:{fontSize:19,fontWeight:700,fontVariantNumeric:"tabular-nums"},statMeta:{fontSize:10,color:t.mut,marginTop:3},
  card:{background:t.card,borderRadius:14,padding:"18px 20px",border:`1px solid ${t.cb}`,marginBottom:12},cardHead:{fontSize:13,fontWeight:700,color:t.tx,marginBottom:12,paddingBottom:7,borderBottom:`1px solid ${t.cb}`},
  progressOuter:{height:5,background:t.mut,borderRadius:3,overflow:"hidden",opacity:.3},progressInner:{height:"100%",borderRadius:3,transition:"width 0.4s",background:t.ac},
  lbl:{fontSize:10,fontWeight:600,color:t.mut,display:"block",marginBottom:3},
  input:{padding:"9px 12px",fontSize:12,border:`1.5px solid ${t.iBr}`,borderRadius:8,background:t.iBg,color:t.tx,width:"100%",fontFamily:"inherit"},
  loginInput:{padding:"10px 12px",fontSize:13,border:`1.5px solid ${t.iBr}`,borderRadius:10,background:t.iBg,color:t.tx,width:"100%",fontFamily:"inherit"},
  select:{padding:"9px 12px",fontSize:12,border:`1.5px solid ${t.iBr}`,borderRadius:8,background:t.iBg,color:t.tx,cursor:"pointer",fontFamily:"inherit",width:"100%"},
  btnPri:{padding:"9px 16px",fontSize:12,fontWeight:600,border:"none",borderRadius:8,background:t.gr,color:"#fff",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5,whiteSpace:"nowrap",boxShadow:`0 2px 8px ${t.acBg}`},btnSec:{padding:"9px 14px",fontSize:12,fontWeight:500,border:`1.5px solid ${t.iBr}`,borderRadius:8,background:"transparent",color:t.sub,cursor:"pointer"},btnGhost:{display:"flex",alignItems:"center",gap:4,padding:"7px 12px",fontSize:12,fontWeight:500,border:`1.5px solid ${t.iBr}`,borderRadius:8,background:"transparent",color:t.acL,cursor:"pointer"},
  btnRet:{display:"flex",alignItems:"center",gap:3,padding:"5px 9px",fontSize:11,fontWeight:500,border:`1.5px solid ${t.ac}`,borderRadius:5,background:t.acBg,color:t.acL,cursor:"pointer",whiteSpace:"nowrap"},
  btnMini:{padding:"4px 9px",fontSize:10,fontWeight:600,border:"1.5px solid",borderRadius:5,background:"transparent",cursor:"pointer",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:2},
  iconBtn:{background:"none",border:"none",cursor:"pointer",color:t.sub,padding:3,display:"flex",borderRadius:3},
  linkBtn:{background:"none",border:"none",cursor:"pointer",color:t.acL,fontWeight:600,fontSize:12,textDecoration:"underline",textUnderlineOffset:2,padding:0,fontFamily:"inherit"},
  tableWrap:{overflowX:"auto"},table:{width:"100%",borderCollapse:"collapse",fontSize:11},th:{padding:"9px 10px",fontWeight:600,fontSize:9,color:t.mut,borderBottom:`1px solid ${t.cb}`,textAlign:"center",whiteSpace:"nowrap",textTransform:"uppercase",letterSpacing:"0.5px"},td:{padding:"9px 10px",borderBottom:`1px solid ${t.cb}`,textAlign:"center",fontVariantNumeric:"tabular-nums",color:t.sub},
  badge:{padding:"2px 8px",borderRadius:16,fontSize:9,fontWeight:600,whiteSpace:"nowrap"},
  empty:{fontSize:12,color:t.mut,fontStyle:"italic",padding:"20px 0",textAlign:"center"},
});

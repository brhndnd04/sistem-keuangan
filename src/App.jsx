import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
function mkSlip(){return{masukHari:0,lembur:0,gajiPerhari:0,tunjangan:0,bonus:0,potKasbon:0,potMakan:0,periode:curPer()}}

const I={home:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,folder:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,users:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,shuffle:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>,list:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,logout:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,plus:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7.5" y1="2" x2="7.5" y2="13"/><line x1="2" y1="7.5" x2="13" y2="7.5"/></svg>,trash:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,edit:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,down:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7.5 3v9M4.5 9l3 3 3-3"/></svg>,up:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7.5 12V3M4.5 6l3-3 3 3"/></svg>,ret:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,menu:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,x:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,back:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,pdf:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,next:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,eye:(c="#1a3c34")=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,eyeOff:(c="#666")=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,slip:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="8" y1="3" x2="8" y2="21"/></svg>,search:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,print:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,save:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>,clock:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,cloud:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>};

const ACCTS=[{username:"admin",password:"admin123",nama:"Administrator",role:"Admin"},{username:"bendahara",password:"bend123",nama:"Bendahara RT",role:"Bendahara"}];

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
  accounts:[...ACCTS],
});

const gCSS=`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}input,select,button{font-family:inherit}input:focus,select:focus{outline:none;border-color:#3b6b5e!important;box-shadow:0 0 0 3px rgba(59,107,94,0.12)}button:active{transform:scale(0.97)}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:8px}`;

// ── PDF Slip ──
function printSlip(emp,s){const c=calcSlip(s);const sB=emp.saldo||0;const tD=c.gajiBersih+sB;const sK=Math.max(0,(emp.kasbon||0)-s.potKasbon);const now=new Date();
const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Slip Gaji-${emp.nama}</title><style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Plus Jakarta Sans',sans-serif;color:#1a1a1a;padding:32px;font-size:12px;line-height:1.5;max-width:560px;margin:0 auto}.hdr{text-align:center;margin-bottom:18px;padding-bottom:12px;border-bottom:3px solid #1a3c34}.hdr h1{font-size:16px;color:#1a3c34}.hdr .sub{font-size:11px;color:#888;margin-top:2px}.info{display:flex;justify-content:space-between;margin-bottom:16px;padding:10px 14px;background:#f8faf9;border-radius:6px;font-size:11px;line-height:1.7}.sec{font-size:12px;font-weight:700;color:#1a3c34;padding:4px 0;border-bottom:2px solid #e0e0e0;margin:12px 0 6px}.row{display:flex;justify-content:space-between;padding:5px 0;font-size:11px}.row .v{font-weight:600}.row.sub{padding-left:16px;color:#888;font-size:10px}.row.sub .v{font-weight:400}.tot{background:#f4f7f6;border-radius:6px;padding:8px 14px;margin:6px 0}.tot .row{font-weight:700;font-size:12px}.grand{background:linear-gradient(135deg,#1a3c34,#2d6a5a);border-radius:8px;padding:12px 16px;margin:10px 0;color:#fff}.grand .row{font-size:14px;font-weight:700;color:#fff}.saldo{border:2px solid #1a3c34;border-radius:8px;padding:12px 14px;margin:12px 0}.sign{display:flex;justify-content:space-between;margin-top:36px;font-size:10px}.sign-b{text-align:center}.sign-l{margin-top:45px;border-bottom:1px solid #333;width:140px;display:inline-block}.ft{margin-top:20px;padding-top:8px;border-top:1px solid #e8e8e8;font-size:9px;color:#999;text-align:center}@media print{body{padding:16px}@page{margin:10mm;size:A5}}</style></head><body>
<div class="hdr"><h1>SLIP GAJI KARYAWAN</h1><div class="sub">Departemen Rumah Tangga · Periode: ${s.periode}</div></div>
<div class="info"><div><b>Nama:</b> ${emp.nama}<br><b>Jabatan:</b> ${emp.jabatan}<br><b>Dept:</b> ${emp.dep}</div><div style="text-align:right"><b>Gaji Standar:</b> ${fmtRp(emp.gaji)}<br><b>Sisa Kasbon:</b> ${fmtRp(emp.kasbon||0)}<br><b>Cetak:</b> ${fmtTgl(now)}</div></div>
<div class="sec">A. PENDAPATAN</div>
<div class="row"><span>Gaji Pokok (${s.masukHari}hr × ${fmtRp(s.gajiPerhari)})</span><span class="v">${fmtRp(c.gajiPokok)}</span></div>
<div class="row"><span>Lembur</span><span class="v">${fmtRp(s.lembur)}</span></div>
<div class="row"><span>Tunjangan</span><span class="v">${fmtRp(s.tunjangan)}</span></div>
<div class="row"><span>Bonus</span><span class="v">${fmtRp(s.bonus)}</span></div>
<div class="tot"><div class="row" style="color:#27ae60"><span>Total Pendapatan</span><span class="v">${fmtRp(c.totalPendapatan)}</span></div></div>
<div class="sec">B. POTONGAN</div>
<div class="row"><span>Kasbon</span><span class="v">${fmtRp(s.potKasbon)}</span></div>
<div class="row sub"><span>Sisa kasbon: ${fmtRp(sK)}</span><span></span></div>
<div class="row"><span>Pot. Makan</span><span class="v">${fmtRp(s.potMakan)}</span></div>
<div class="tot"><div class="row" style="color:#c0392b"><span>Total Potongan</span><span class="v">${fmtRp(c.totalPotongan)}</span></div></div>
<div class="sec">C. PERHITUNGAN AKHIR</div>
<div class="row"><span>Gaji Bersih</span><span class="v">${fmtRp(c.gajiBersih)}</span></div>
<div class="row" style="color:${sB>=0?'#27ae60':'#c0392b'}"><span>Saldo Sebelumnya</span><span class="v">${sB>=0?'+':''} ${fmtRp(sB)}</span></div>
<div class="grand"><div class="row"><span>TOTAL DITERIMA</span><span class="v">${fmtRp(tD)}</span></div></div>
<div class="saldo"><div style="font-size:11px;font-weight:700;color:#1a3c34;margin-bottom:4px">Saldo Baru</div><div class="row" style="font-weight:700;color:${(tD-emp.gaji)>=0?'#27ae60':'#c0392b'}"><span>→ Periode Berikutnya</span><span>${(tD-emp.gaji)>=0?'+':''}${fmtRp(tD-emp.gaji)}</span></div></div>
<div class="sign"><div class="sign-b"><div style="color:#666">Penerima,</div><div class="sign-l"></div><div style="font-weight:600;margin-top:3px">${emp.nama}</div></div><div class="sign-b"><div style="color:#666">Bendahara,</div><div class="sign-l"></div><div style="font-weight:600;margin-top:3px">Dept. Rumah Tangga</div></div></div>
<div class="ft">Saldo (+) kelebihan · Saldo (−) kekurangan<br>Sistem Keuangan Dept. Rumah Tangga</div>
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
function LoginPage({onLogin,accounts}){const[u,setU]=useState("");const[p,setP]=useState("");const[sh,setSh]=useState(false);const[err,setErr]=useState("");const[now,setNow]=useState(new Date());useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
const go=()=>{const f=(accounts||ACCTS).find(a=>a.username===u&&a.password===p);if(f)onLogin(f);else setErr("Username atau password salah")};
return(<div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",minHeight:"100vh",background:"linear-gradient(145deg,#0f2b24,#1a3c34 30%,#2d6a5a 70%,#3b8b7a)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><style>{gCSS}</style><div style={{background:"#fff",borderRadius:16,padding:"32px 28px 24px",boxShadow:"0 20px 60px rgba(0,0,0,0.25)",width:"100%",maxWidth:380}}>
  <div style={{textAlign:"center",marginBottom:18}}><div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#1a3c34,#3b8b7a)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><h1 style={{fontSize:18,fontWeight:700,color:"#1a3c34"}}>Sistem Keuangan</h1><p style={{fontSize:12,color:"#888",marginTop:2}}>Departemen Rumah Tangga</p></div>
  <div style={{textAlign:"center",padding:"8px 0",marginBottom:12,borderTop:"1px solid #f0f0f0",borderBottom:"1px solid #f0f0f0"}}><span style={{fontSize:20,fontWeight:300,color:"#1a3c34",fontVariantNumeric:"tabular-nums"}}>{fmtJam(now)}</span><span style={{display:"block",fontSize:10,color:"#999",marginTop:1}}>{fmtTgl(now)}</span></div>
  <div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div><label style={{fontSize:11,fontWeight:600,color:"#555",display:"block",marginBottom:4}}>Username</label><input style={S.loginInput} value={u} onChange={e=>{setU(e.target.value);setErr("")}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Username" autoFocus/></div>
    <div><label style={{fontSize:11,fontWeight:600,color:"#555",display:"block",marginBottom:4}}>Password</label><input style={S.loginInput} type={sh?"text":"password"} value={p} onChange={e=>{setP(e.target.value);setErr("")}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Password"/></div>
    {err&&<div style={{fontSize:11,color:"#c0392b",background:"#fef2f2",padding:"7px 10px",borderRadius:7,textAlign:"center"}}>{err}</div>}
    <button style={{padding:11,fontSize:13,fontWeight:600,border:"none",borderRadius:9,background:"linear-gradient(135deg,#1a3c34,#2d6a5a)",color:"#fff",cursor:"pointer",marginTop:2}} onClick={go}>Masuk</button>
  </div>
  <div style={{textAlign:"center",fontSize:10,color:"#bbb",marginTop:16}}>admin / admin123 · bendahara / bend123</div>
</div></div>);}

// ══════ SLIP DETAIL ══════
function SlipDetail({emp,onBack,onUpdate}){
  const s=emp.slip||mkSlip();const[form,setForm]=useState({...s});const[slTab,setSlTab]=useState("current");const[kbF,setKbF]=useState({jumlah:"",ket:""});
  const c=calcSlip(form);const sB=emp.saldo||0;const tD=c.gajiBersih+sB;const nS=tD-emp.gaji;const sKA=Math.max(0,(emp.kasbon||0)-form.potKasbon);
  const sF=(k,v)=>setForm({...form,[k]:NM(v)});const saved=JSON.stringify(form)===JSON.stringify(s);
  const saveSlip=()=>onUpdate({...emp,slip:{...form}});
  const tutupPeriode=()=>{const rec={periode:form.periode,slip:{...form},gajiBersih:c.gajiBersih,saldoSblm:sB,totalDiterima:tD,saldoAkhir:nS,tgl:fmtShort(new Date())};onUpdate({...emp,slip:{...mkSlip(),gajiPerhari:form.gajiPerhari,tunjangan:form.tunjangan},saldo:nS,kasbon:sKA,riwayat:[rec,...(emp.riwayat||[])]});setForm({...mkSlip(),gajiPerhari:form.gajiPerhari,tunjangan:form.tunjangan});setSlTab("history")};
  const addKb=()=>{const j=NM(kbF.jumlah);if(j<=0)return;onUpdate({...emp,kasbon:(emp.kasbon||0)+j,logKasbon:[{id:uid(),tgl:fmtShort(new Date()),jumlah:j,ket:kbF.ket},...(emp.logKasbon||[])]});setKbF({jumlah:"",ket:""})};

  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}><button style={S.btnGhost} onClick={onBack}>{I.back} Kembali</button><div style={{flex:1,minWidth:160}}><h3 style={{fontSize:16,fontWeight:700,color:"#1a3c34"}}>Slip Gaji — {emp.nama}</h3><div style={{fontSize:11,color:"#888"}}>{emp.jabatan} · {emp.dep} · Standar: {fmtRp(emp.gaji)}</div></div><button onClick={()=>{saveSlip();printSlip({...emp,slip:form},form)}} style={{padding:"10px 20px",fontSize:13,fontWeight:700,border:"none",borderRadius:10,background:"linear-gradient(135deg,#b91c1c,#dc2626)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 2px 8px rgba(185,28,28,0.3)"}}>{I.print} CETAK SLIP GAJI</button></div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      <div style={{...S.card,margin:0,borderLeft:`4px solid ${sB>=0?"#27ae60":"#c0392b"}`,paddingTop:12,paddingBottom:12}}><div style={{fontSize:10,fontWeight:600,color:"#888"}}>Saldo Sebelumnya</div><div style={{fontSize:20,fontWeight:700,color:sB>=0?"#27ae60":"#c0392b",marginTop:2}}>{sB>=0?"+":""}{fmtRp(sB)}</div></div>
      <div style={{...S.card,margin:0,borderLeft:"4px solid #e67e22",paddingTop:12,paddingBottom:12}}><div style={{fontSize:10,fontWeight:600,color:"#888"}}>Sisa Kasbon</div><div style={{fontSize:20,fontWeight:700,color:emp.kasbon?"#e67e22":"#27ae60",marginTop:2}}>{fmtRp(emp.kasbon||0)}</div></div>
    </div>

    <div style={{display:"flex",gap:2,marginBottom:14}}>{[["current","Slip Saat Ini"],["kasbon","Kasbon"],["history",`Riwayat (${(emp.riwayat||[]).length})`]].map(([id,lb])=>(<button key={id} onClick={()=>setSlTab(id)} style={{padding:"8px 16px",fontSize:12,fontWeight:slTab===id?600:500,border:"none",background:slTab===id?"#fff":"#e8e8e8",color:slTab===id?"#1a3c34":"#666",cursor:"pointer",borderRadius:"8px 8px 0 0",boxShadow:slTab===id?"0 -1px 4px rgba(0,0,0,0.04)":"none"}}>{lb}</button>))}</div>

    {slTab==="current"&&(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
      <div style={S.card}><div style={S.cardHead}>Data Gaji — {form.periode}</div><div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><label style={{fontSize:11,fontWeight:600,color:"#666",whiteSpace:"nowrap"}}>Periode:</label><input style={S.input} value={form.periode} onChange={e=>setForm({...form,periode:e.target.value})}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><div><label style={S.lbl}>Masuk Hari</label><input style={S.input} type="number" value={form.masukHari||""} onChange={e=>sF("masukHari",e.target.value)}/></div><div><label style={S.lbl}>Gaji/Hari</label><input style={S.input} type="number" value={form.gajiPerhari||""} onChange={e=>sF("gajiPerhari",e.target.value)}/></div></div>
        <div style={{background:"#f0faf7",borderRadius:7,padding:"7px 12px",display:"flex",justifyContent:"space-between",border:"1px dashed #3b6b5e",fontSize:12}}><span style={{color:"#888"}}>Gaji Pokok</span><span style={{fontWeight:700,color:"#1a3c34"}}>{fmtRp(c.gajiPokok)}</span></div>
        {[["Lembur","lembur"],["Tunjangan","tunjangan"],["Bonus","bonus"]].map(([l,k])=><div key={k}><label style={S.lbl}>{l}</label><input style={S.input} type="number" value={form[k]||""} onChange={e=>sF(k,e.target.value)}/></div>)}
        <div style={{borderTop:"2px dashed #fca5a5",paddingTop:10}}><div style={{fontSize:11,fontWeight:700,color:"#c0392b",marginBottom:8}}>POTONGAN</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><div><label style={S.lbl}>Kasbon (sisa:{fmtRp(emp.kasbon||0)})</label><input style={{...S.input,borderColor:"#fca5a5"}} type="number" value={form.potKasbon||""} onChange={e=>sF("potKasbon",e.target.value)}/></div><div><label style={S.lbl}>Pot. Makan</label><input style={{...S.input,borderColor:"#fca5a5"}} type="number" value={form.potMakan||""} onChange={e=>sF("potMakan",e.target.value)}/></div></div></div>
        <div style={{display:"flex",gap:6,marginTop:4}}><button style={{...S.btnPri,flex:1,justifyContent:"center",opacity:saved?.5:1}} onClick={saveSlip} disabled={saved}>{saved?"Tersimpan":"Simpan"}</button><button style={{...S.btnPri,flex:1,justifyContent:"center",background:"#7c3aed"}} onClick={tutupPeriode}>Tutup Periode</button></div>
      </div></div>

      <div style={S.card}><div style={S.cardHead}>Preview</div><div style={{background:"#f8faf9",borderRadius:8,padding:"14px 16px"}}>
        <div style={{textAlign:"center",marginBottom:10}}><div style={{fontSize:10,fontWeight:700,color:"#1a3c34"}}>SLIP GAJI — {form.periode}</div><div style={{fontSize:11,color:"#555",marginTop:2}}>{emp.nama}</div></div>
        <div style={{fontSize:10,fontWeight:700,color:"#1a3c34",marginBottom:4,borderBottom:"1.5px solid #d0d0d0",paddingBottom:3}}>PENDAPATAN</div>
        {[["Gaji Pokok",c.gajiPokok],["Lembur",form.lembur],["Tunjangan",form.tunjangan],["Bonus",form.bonus]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11}}><span style={{color:"#555"}}>{l}</span><span style={{fontWeight:500}}>{fmtRp(v)}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontWeight:700,color:"#27ae60",borderTop:"1.5px solid #d0d0d0",marginTop:3,fontSize:12}}><span>Total Pendapatan</span><span>{fmtRp(c.totalPendapatan)}</span></div>
        <div style={{fontSize:10,fontWeight:700,color:"#c0392b",marginTop:10,marginBottom:4,borderBottom:"1.5px solid #d0d0d0",paddingBottom:3}}>POTONGAN</div>
        {[["Kasbon",form.potKasbon],["Pot. Makan",form.potMakan]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11}}><span style={{color:"#555"}}>{l}</span><span style={{fontWeight:500}}>{fmtRp(v)}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontWeight:700,color:"#c0392b",borderTop:"1.5px solid #d0d0d0",marginTop:3,fontSize:12}}><span>Total Potongan</span><span>{fmtRp(c.totalPotongan)}</span></div>
        <div style={{marginTop:10,border:"2px solid #1a3c34",borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,fontWeight:700,color:"#1a3c34",marginBottom:6}}>PERHITUNGAN AKHIR</div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12}}><span>Gaji Bersih</span><span style={{fontWeight:600}}>{fmtRp(c.gajiBersih)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12,color:sB>=0?"#27ae60":"#c0392b"}}><span>Saldo Sebelumnya</span><span style={{fontWeight:600}}>{sB>=0?"+":""} {fmtRp(sB)}</span></div>
          <div style={{height:2,background:"#1a3c34",margin:"6px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:800,color:"#1a3c34"}}><span>TOTAL DITERIMA</span><span>{fmtRp(tD)}</span></div>
        </div>
        <div style={{background:nS>=0?"#e8f5e9":"#fce4ec",borderRadius:6,padding:"8px 12px",marginTop:8,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,fontWeight:600,color:nS>=0?"#27ae60":"#c0392b"}}>Saldo → Berikutnya</span><span style={{fontSize:14,fontWeight:800,color:nS>=0?"#27ae60":"#c0392b"}}>{nS>=0?"+":""}{fmtRp(nS)}</span></div>
      </div></div>
    </div>)}

    {slTab==="kasbon"&&(<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}><div style={{...S.statCard,borderTop:"3px solid #e67e22"}}><div style={S.statLbl}>Sisa Kasbon</div><div style={{fontSize:22,fontWeight:700,color:"#e67e22"}}>{fmtRp(emp.kasbon||0)}</div></div><div style={{...S.statCard,borderTop:"3px solid #1a3c34"}}><div style={S.statLbl}>Total Pinjaman</div><div style={{fontSize:22,fontWeight:700,color:"#1a3c34"}}>{fmtRp((emp.logKasbon||[]).reduce((s,x)=>s+x.jumlah,0))}</div></div></div>
      <div style={S.card}><div style={S.cardHead}>Ambil Kasbon Baru</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><div style={{flex:1,minWidth:120}}><label style={S.lbl}>Jumlah</label><input style={S.input} type="number" value={kbF.jumlah} onChange={e=>setKbF({...kbF,jumlah:e.target.value})}/></div><div style={{flex:2,minWidth:150}}><label style={S.lbl}>Keterangan</label><input style={S.input} value={kbF.ket} onChange={e=>setKbF({...kbF,ket:e.target.value})}/></div><button style={{...S.btnPri,alignSelf:"flex-end"}} onClick={addKb}>{I.plus} Ambil</button></div></div>
      <div style={S.card}><div style={S.cardHead}>Riwayat Kasbon</div>{!(emp.logKasbon||[]).length?<div style={S.empty}>Belum ada</div>:<div style={{display:"flex",flexDirection:"column",gap:6}}>{(emp.logKasbon||[]).map(k=>(<div key={k.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"#fafbfc",borderRadius:8,borderLeft:"3px solid #e67e22"}}><div><div style={{fontWeight:500,fontSize:13}}>{fmtRp(k.jumlah)}</div><div style={{fontSize:11,color:"#999"}}>{k.tgl}{k.ket&&` · ${k.ket}`}</div></div></div>))}</div>}</div>
    </div>)}

    {slTab==="history"&&(<div style={S.card}><div style={S.cardHead}>Riwayat Gaji</div>{!(emp.riwayat||[]).length?<div style={S.empty}>Belum ada. Klik "Tutup Periode" untuk simpan.</div>:<div style={S.tableWrap}><table style={S.table}><thead><tr><th style={{...S.th,textAlign:"left"}}>Periode</th><th style={S.th}>Pendapatan</th><th style={S.th}>Potongan</th><th style={S.th}>Gaji Bersih</th><th style={S.th}>Saldo Sblm</th><th style={{...S.th,fontWeight:700}}>Diterima</th><th style={S.th}>Saldo Akhir</th></tr></thead><tbody>{(emp.riwayat||[]).map((r,i)=>{const cs=calcSlip(r.slip);return(<tr key={i} style={i%2?{background:"#fafbfc"}:{}}><td style={{...S.td,textAlign:"left"}}><div style={{fontWeight:600}}>{r.periode}</div><div style={{fontSize:10,color:"#aaa"}}>{r.tgl}</div></td><td style={{...S.td,color:"#27ae60"}}>{fmtRp(cs.totalPendapatan)}</td><td style={{...S.td,color:"#c0392b"}}>{fmtRp(cs.totalPotongan)}</td><td style={{...S.td,fontWeight:600}}>{fmtRp(r.gajiBersih)}</td><td style={{...S.td,color:r.saldoSblm>=0?"#27ae60":"#c0392b"}}>{r.saldoSblm>=0?"+":""}{fmtRp(r.saldoSblm)}</td><td style={{...S.td,fontWeight:700,color:"#1a3c34"}}>{fmtRp(r.totalDiterima)}</td><td style={{...S.td,fontWeight:700,color:r.saldoAkhir>=0?"#27ae60":"#c0392b"}}>{r.saldoAkhir>=0?"+":""}{fmtRp(r.saldoAkhir)}</td></tr>)})}
    </tbody></table></div>}</div>)}
  </div>);
}

// ══════ MAIN ══════
function MainApp({account:acc,onLogout,appData,onSave}){
  const[now,setNow]=useState(new Date());const[tab,setTab]=useState("dashboard");const[sideOpen,setSideOpen]=useState(false);
  const[detP,setDetP]=useState(null);const[slipE,setSlipE]=useState(null);
  const[projects,setProjects]=useState(appData.projects||[]);
  const[employees,setEmployees]=useState(appData.employees||[]);
  const[loans,setLoans]=useState(appData.loans||[]);
  const[tx,setTx]=useState(appData.transactions||[]);
  const[pF,setPF]=useState({name:"",anggaran:""});const[editP,setEditP]=useState(null);
  const[eF,setEF]=useState({nama:"",jabatan:"",dep:"",gaji:"",telp:"",status:"Aktif"});const[editE,setEditE]=useState(null);const[showEF,setShowEF]=useState(false);
  const[lF,setLF]=useState({dari:"",ke:"",jumlah:"",ket:""});const[tF,setTF]=useState({tipe:"masuk",jumlah:"",ket:"",proyek:""});
  const[empQ,setEmpQ]=useState("");
  const[saving,setSaving]=useState(false);
  const saveTimer=useRef(null);

  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);

  // Auto-save to Supabase when data changes
  const doSave=useCallback(()=>{
    const data={projects,employees,loans,transactions:tx};
    setSaving(true);
    onSave(data).finally(()=>setTimeout(()=>setSaving(false),1000));
  },[projects,employees,loans,tx,onSave]);

  useEffect(()=>{
    if(saveTimer.current)clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(doSave,2000);
    return()=>{if(saveTimer.current)clearTimeout(saveTimer.current)};
  },[projects,employees,loans,tx]);

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

  const navs=[{id:"dashboard",icon:I.home,lb:"Dashboard"},{id:"proyek",icon:I.folder,lb:"Proyek"},{id:"karyawan",icon:I.users,lb:"Karyawan"},{id:"pinjaman",icon:I.shuffle,lb:"Pinjaman"},{id:"transaksi",icon:I.list,lb:"Transaksi"}];
  const goTab=(id)=>{setTab(id);setSideOpen(false);setDetP(null);setSlipE(null)};

  const Side=()=>(<>{sideOpen&&<div style={S.sideOver} onClick={()=>setSideOpen(false)}/>}<aside style={{...S.side,...(sideOpen?S.sideOpen:{})}}>
    <div style={S.sideBrand}><div style={S.sideLogo}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div><div style={S.sideBT}>Keuangan RT</div><div style={S.sideBS}>Dept. Rumah Tangga</div></div><button style={S.sideX} onClick={()=>setSideOpen(false)}>{I.x}</button></div>
    <nav style={S.sideNav}>{navs.map(n=><button key={n.id} onClick={()=>goTab(n.id)} style={{...S.sideItem,...(tab===n.id?S.sideItemA:{})}}>{n.icon}<span>{n.lb}</span></button>)}</nav>
    <div style={S.sideBot}><div style={S.sideUser}><div style={S.sideAv}>{acc.nama.charAt(0)}</div><div><div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{acc.nama}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>{acc.role}</div></div></div><button style={S.sideLogout} onClick={onLogout}>{I.logout}<span>Keluar</span></button></div></aside></>);

  const Top=({t})=>(<header style={S.topbar}><div style={{display:"flex",alignItems:"center",gap:10}}><button style={S.menuBtn} onClick={()=>setSideOpen(true)}>{I.menu}</button><h2 style={S.pageTitle}>{t}</h2>{saving&&<span style={{fontSize:10,color:"#27ae60",display:"flex",alignItems:"center",gap:4}}>{I.cloud} Menyimpan...</span>}</div><div style={S.topClock}><span style={S.topTime}>{fmtJam(now)}</span><span style={S.topDate}>{fmtTgl(now)}</span></div></header>);

  if(detP){const p=projects.find(x=>x.id===detP);if(p)return(<div style={S.shell}><style>{gCSS}</style><Side/><div style={S.content}><Top t="Detail Proyek"/><main style={S.main}><PD p={p} onBack={()=>setDetP(null)} onU={u=>setProjects(projects.map(x=>x.id===u.id?u:x))}/></main></div></div>)}
  if(slipE){const e=employees.find(x=>x.id===slipE);if(e)return(<div style={S.shell}><style>{gCSS}</style><Side/><div style={S.content}><Top t="Slip Gaji"/><main style={S.main}><SlipDetail emp={e} onBack={()=>setSlipE(null)} onUpdate={u=>setEmployees(employees.map(x=>x.id===u.id?u:x))}/></main></div></div>)}

  return(<div style={S.shell}><style>{gCSS}</style><Side/><div style={S.content}><Top t={navs.find(n=>n.id===tab)?.lb}/>
  <main style={S.main}>
    {tab==="dashboard"&&(<div>
      <div style={S.welcomeBar}><div style={{fontSize:16,fontWeight:600}}>Selamat datang, {acc.nama}</div><div style={{fontSize:11,opacity:.7,marginTop:2}}>Ringkasan Keuangan · Data tersimpan otomatis {I.cloud}</div></div>
      <div style={S.grid4}>{[["Total Anggaran",fmtRp(tAng),"#1a3c34"],["Dicairkan",fmtRp(tCair),"#c0392b"],["Sisa",fmtRp(tSisa),"#27ae60"],["Saldo",fmtRp(saldo),saldo>=0?"#27ae60":"#c0392b"]].map(([l,v,c],i)=>(<div key={i} style={{...S.statCard,borderTop:`3px solid ${c}`}}><div style={S.statLbl}>{l}</div><div style={{...S.statVal,color:c}}>{v}</div></div>))}</div>
      <div style={S.card}><div style={S.cardHead}>Status Pencairan</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8,marginBottom:12}}>{STATUS_LIST.map(st=>{const sc=stC(st);return(<div key={st} style={{background:sc.bg,borderRadius:8,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color:sc.fg}}>{st}</div><div style={{fontSize:16,fontWeight:700,color:sc.fg}}>{pcC(st)}</div><div style={{fontSize:10,fontWeight:600,color:sc.fg}}>{fmtRp(pcS(st))}</div></div>)})}</div></div>
      <div style={S.grid2}><div style={S.statCard}><div style={S.statLbl}>Karyawan: {eAkt} aktif</div><div style={{...S.statVal,color:"#1a3c34"}}>{fmtRp(tGaji)}</div><div style={S.statMeta}>Total diterima/bulan</div></div><div style={{...S.statCard,borderTop:"3px solid #e67e22"}}><div style={S.statLbl}>Transaksi</div><div style={{display:"flex",justifyContent:"space-between",marginTop:6}}><div><div style={{fontSize:10,color:"#aaa"}}>Masuk</div><div style={{fontWeight:700,color:"#27ae60"}}>{fmtRp(tIn)}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#aaa"}}>Keluar</div><div style={{fontWeight:700,color:"#c0392b"}}>{fmtRp(tOut)}</div></div></div></div></div>
    </div>)}

    {tab==="proyek"&&(<div>
      <div style={S.card}><div style={S.cardHead}>Tambah Proyek</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input style={S.input} placeholder="Nama" value={pF.name} onChange={e=>setPF({...pF,name:e.target.value})}/><input style={{...S.input,maxWidth:180}} type="number" placeholder="Anggaran" value={pF.anggaran} onChange={e=>setPF({...pF,anggaran:e.target.value})}/>{editP?<><button style={S.btnPri} onClick={()=>{setProjects(projects.map(p=>p.id===editP?{...p,name:pF.name,anggaran:NM(pF.anggaran)}:p));setEditP(null);setPF({name:"",anggaran:""})}}>Simpan</button><button style={S.btnSec} onClick={()=>{setEditP(null);setPF({name:"",anggaran:""})}}>Batal</button></>:<button style={S.btnPri} onClick={()=>{if(!pF.name||!pF.anggaran)return;setProjects([...projects,{id:uid(),name:pF.name,anggaran:NM(pF.anggaran),pencairan:[]}]);setPF({name:"",anggaran:""})}}>{I.plus} Tambah</button>}</div></div>
      <div style={S.card}><div style={S.cardHead}>Daftar Proyek</div>{!projects.length?<div style={S.empty}>Belum ada</div>:<div style={S.tableWrap}><table style={S.table}><thead><tr><th style={S.th}>No</th><th style={{...S.th,textAlign:"left"}}>Proyek</th><th style={S.th}>Anggaran</th><th style={S.th}>Cair</th><th style={S.th}>Sisa</th><th style={S.th}>Aksi</th></tr></thead><tbody>{projects.map((p,i)=>{const cp=cP(p);return(<tr key={p.id} style={i%2?{background:"#fafbfc"}:{}}><td style={S.td}>{i+1}</td><td style={{...S.td,textAlign:"left"}}><button style={S.linkBtn} onClick={()=>setDetP(p.id)}>{p.name}</button></td><td style={S.td}>{fmtRp(p.anggaran)}</td><td style={{...S.td,color:"#c0392b",fontWeight:600}}>{fmtRp(cp.totalCair)}</td><td style={{...S.td,fontWeight:700,color:cp.sisaAnggaran>=0?"#27ae60":"#c0392b"}}>{fmtRp(cp.sisaAnggaran)}</td><td style={S.td}><div style={{display:"flex",gap:4,justifyContent:"center"}}><button style={S.iconBtn} onClick={()=>setDetP(p.id)}>{I.eye()}</button><button style={S.iconBtn} onClick={()=>{setEditP(p.id);setPF({name:p.name,anggaran:p.anggaran.toString()})}}>{I.edit}</button><button style={{...S.iconBtn,color:"#c0392b"}} onClick={()=>setProjects(projects.filter(x=>x.id!==p.id))}>{I.trash}</button></div></td></tr>)})}</tbody></table></div>}</div>
    </div>)}

    {tab==="karyawan"&&(<div>
      <div style={S.grid3}>{[["Total",employees.length,"#1a3c34"],["Aktif",eAkt,"#27ae60"],["Gaji/Bln",fmtRp(tGaji),"#2980b9"]].map(([l,v,c],i)=>(<div key={i} style={{...S.statCard,borderTop:`3px solid ${c}`}}><div style={S.statLbl}>{l}</div><div style={{...S.statVal,color:c,fontSize:typeof v==="string"?15:20}}>{v}</div></div>))}</div>
      <div style={{...S.card,paddingTop:10,paddingBottom:10,marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:"#888"}}>{I.search}</span><input style={{...S.input,border:"none",background:"transparent",paddingLeft:0,fontSize:13}} placeholder="Cari nama, jabatan, departemen..." value={empQ} onChange={e=>setEmpQ(e.target.value)}/>{empQ&&<button style={{...S.iconBtn,color:"#999"}} onClick={()=>setEmpQ("")}>{I.x}</button>}</div></div>
      {!showEF&&<button style={{...S.btnPri,marginBottom:10}} onClick={()=>{setShowEF(true);setEditE(null);setEF({nama:"",jabatan:"",dep:"",gaji:"",telp:"",status:"Aktif"})}}>{I.plus} Tambah</button>}
      {showEF&&<div style={S.card}><div style={S.cardHead}>{editE?"Edit":"Tambah"} Karyawan</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>{[["Nama","nama"],["Jabatan","jabatan"],["Dept","dep"],["Gaji","gaji"],["Telp","telp"]].map(([l,k])=>(<div key={k}><label style={S.lbl}>{l}</label><input style={S.input} type={k==="gaji"?"number":"text"} value={eF[k]} onChange={e=>setEF({...eF,[k]:e.target.value})}/></div>))}<div><label style={S.lbl}>Status</label><select style={S.select} value={eF.status} onChange={e=>setEF({...eF,status:e.target.value})}><option>Aktif</option><option>Nonaktif</option><option>Cuti</option></select></div></div><div style={{display:"flex",gap:6,marginTop:12}}>{editE?<button style={S.btnPri} onClick={()=>{setEmployees(employees.map(e=>e.id===editE?{...e,...eF,gaji:NM(eF.gaji)}:e));setEditE(null);setShowEF(false)}}>Simpan</button>:<button style={S.btnPri} onClick={()=>{if(!eF.nama||!eF.gaji)return;setEmployees([...employees,{id:uid(),...eF,gaji:NM(eF.gaji),slip:mkSlip(),saldo:0,kasbon:0,logKasbon:[],riwayat:[]}]);setEF({nama:"",jabatan:"",dep:"",gaji:"",telp:"",status:"Aktif"});setShowEF(false)}}>{I.plus} Simpan</button>}<button style={S.btnSec} onClick={()=>{setShowEF(false);setEditE(null)}}>Batal</button></div></div>}
      <div style={S.card}><div style={S.cardHead}>Daftar Karyawan {empQ&&<span style={{fontWeight:400,color:"#aaa",fontSize:11}}>· {fEmp.length} hasil</span>}</div>{!fEmp.length?<div style={S.empty}>{empQ?"Tidak ditemukan":"Belum ada"}</div>:<div style={S.tableWrap}><table style={S.table}><thead><tr><th style={S.th}>No</th><th style={{...S.th,textAlign:"left"}}>Nama</th><th style={{...S.th,textAlign:"left"}}>Jabatan</th><th style={S.th}>Total Diterima</th><th style={S.th}>Kasbon</th><th style={S.th}>Saldo</th><th style={S.th}>Aksi</th></tr></thead><tbody>{fEmp.map((e,i)=>{const cs=calcSlip(e.slip||mkSlip());const td=cs.gajiBersih+(e.saldo||0);return(<tr key={e.id} style={i%2?{background:"#fafbfc"}:{}}><td style={S.td}>{i+1}</td><td style={{...S.td,textAlign:"left"}}><div style={{fontWeight:500}}>{e.nama}</div><div style={{fontSize:10,color:"#999"}}>{e.telp}</div></td><td style={{...S.td,textAlign:"left",fontSize:11}}>{e.jabatan}<br/><span style={{...S.badge,background:"#eef2ff",color:"#4338ca"}}>{e.dep}</span></td><td style={{...S.td,fontWeight:700,color:"#1a3c34"}}>{fmtRp(td)}</td><td style={{...S.td,fontWeight:600,color:e.kasbon?"#e67e22":"#aaa"}}>{fmtRp(e.kasbon||0)}</td><td style={{...S.td,fontWeight:700,color:(e.saldo||0)>=0?"#27ae60":"#c0392b"}}>{(e.saldo||0)>=0?"+":""}{fmtRp(e.saldo||0)}</td><td style={S.td}><div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap"}}><button style={{...S.btnMini,borderColor:"#1a3c34",color:"#1a3c34"}} onClick={()=>setSlipE(e.id)}>{I.slip} Slip</button><button style={S.iconBtn} onClick={()=>{setEditE(e.id);setEF({nama:e.nama,jabatan:e.jabatan,dep:e.dep,gaji:e.gaji.toString(),telp:e.telp||"",status:e.status});setShowEF(true)}}>{I.edit}</button><button style={{...S.iconBtn,color:"#c0392b"}} onClick={()=>setEmployees(employees.filter(x=>x.id!==e.id))}>{I.trash}</button></div></td></tr>)})}</tbody></table></div>}</div>
    </div>)}

    {tab==="pinjaman"&&(<div>
      <div style={S.card}><div style={S.cardHead}>Pinjaman Antar Proyek</div>{projects.length<2?<div style={S.empty}>Perlu 2+ proyek</div>:<><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>{[["Dari","dari"],["Ke","ke"]].map(([l,k])=>(<div key={k}><label style={S.lbl}>{l}</label><select style={S.select} value={lF[k]} onChange={e=>setLF({...lF,[k]:e.target.value})}><option value="">— Pilih —</option>{projects.filter(p=>p.id!==(k==="dari"?lF.ke:lF.dari)).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>))}<div><label style={S.lbl}>Jumlah</label><input style={S.input} type="number" value={lF.jumlah} onChange={e=>setLF({...lF,jumlah:e.target.value})}/></div><div><label style={S.lbl}>Ket</label><input style={S.input} value={lF.ket} onChange={e=>setLF({...lF,ket:e.target.value})}/></div></div><button style={{...S.btnPri,marginTop:12}} onClick={()=>{if(!lF.dari||!lF.ke||!lF.jumlah||lF.dari===lF.ke)return;setLoans([...loans,{id:uid(),dari:projects.find(p=>p.id===lF.dari).name,ke:projects.find(p=>p.id===lF.ke).name,jumlah:NM(lF.jumlah),ket:lF.ket,tgl:fmtTgl(new Date())}]);setLF({dari:"",ke:"",jumlah:"",ket:""})}}>Buat</button></>}</div>
      <div style={S.card}><div style={S.cardHead}>Aktif ({loans.length})</div>{!loans.length?<div style={S.empty}>Tidak ada</div>:<div style={{display:"flex",flexDirection:"column",gap:8}}>{loans.map(l=>(<div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fafbfc",borderRadius:8,padding:"10px 14px",flexWrap:"wrap",gap:6}}><div><span style={{fontWeight:600,color:"#c0392b"}}>{l.dari}</span><span style={{color:"#bbb",margin:"0 6px"}}>→</span><span style={{fontWeight:600,color:"#27ae60"}}>{l.ke}</span><div style={{fontSize:10,color:"#999"}}>{l.tgl}{l.ket&&` · ${l.ket}`}</div></div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontWeight:700}}>{fmtRp(l.jumlah)}</span><button style={S.btnRet} onClick={()=>setLoans(loans.filter(x=>x.id!==l.id))}>{I.ret} Kembali</button></div></div>))}</div>}</div>
    </div>)}

    {tab==="transaksi"&&(<div>
      <div style={S.card}><div style={S.cardHead}>Catat Transaksi</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}><div><label style={S.lbl}>Tipe</label><select style={S.select} value={tF.tipe} onChange={e=>setTF({...tF,tipe:e.target.value})}><option value="masuk">Masuk</option><option value="keluar">Keluar</option></select></div><div><label style={S.lbl}>Jumlah</label><input style={S.input} type="number" value={tF.jumlah} onChange={e=>setTF({...tF,jumlah:e.target.value})}/></div><div><label style={S.lbl}>Proyek</label><select style={S.select} value={tF.proyek} onChange={e=>setTF({...tF,proyek:e.target.value})}><option value="">Umum</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div><label style={S.lbl}>Ket</label><input style={S.input} value={tF.ket} onChange={e=>setTF({...tF,ket:e.target.value})}/></div></div><button style={{...S.btnPri,marginTop:12}} onClick={()=>{if(!tF.jumlah||!tF.ket)return;setTx([{id:uid(),tipe:tF.tipe,jumlah:NM(tF.jumlah),ket:tF.ket,proyek:tF.proyek?projects.find(p=>p.id===tF.proyek)?.name:"-",tgl:fmtTgl(new Date())},...tx]);setTF({tipe:"masuk",jumlah:"",ket:"",proyek:""})}}>{tF.tipe==="masuk"?I.down:I.up} Catat</button></div>
      <div style={S.grid2}>{[["Masuk",fmtRp(tIn),"#27ae60"],["Keluar",fmtRp(tOut),"#c0392b"]].map(([l,v,c],i)=>(<div key={i} style={{...S.statCard,borderTop:`3px solid ${c}`}}><div style={S.statLbl}>{l}</div><div style={{...S.statVal,color:c}}>{v}</div></div>))}</div>
      <div style={S.card}><div style={S.cardHead}>Riwayat</div>{!tx.length?<div style={S.empty}>Belum ada</div>:<div style={{display:"flex",flexDirection:"column",gap:6}}>{tx.map(t=>(<div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f5f5f5",gap:6}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:t.tipe==="masuk"?"#e8f5e9":"#fce4ec",color:t.tipe==="masuk"?"#27ae60":"#c0392b",flexShrink:0}}>{t.tipe==="masuk"?I.down:I.up}</div><div><div style={{fontSize:12,fontWeight:500}}>{t.ket}</div><div style={{fontSize:10,color:"#999"}}>{t.tgl}{t.proyek!=="-"&&<span style={{display:"inline-block",background:"#eef2ff",color:"#4338ca",padding:"0 6px",borderRadius:4,fontSize:9,fontWeight:600,marginLeft:5}}>{t.proyek}</span>}</div></div></div><span style={{fontWeight:600,fontSize:13,color:t.tipe==="masuk"?"#27ae60":"#c0392b",whiteSpace:"nowrap"}}>{t.tipe==="masuk"?"+":"−"}{fmtRp(t.jumlah)}</span></div>))}</div>}</div>
    </div>)}
  </main></div></div>);
}

// ── Project Detail ──
function PD({p,onBack,onU}){const[pcF,setPcF]=useState({jumlah:"",ket:""});const[err,setErr]=useState("");const c=cP(p);const pct=p.anggaran>0?(c.totalCair/p.anggaran)*100:0;let run=p.anggaran;
return(<div>
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}><button style={S.btnGhost} onClick={onBack}>{I.back} Kembali</button><div style={{flex:1,minWidth:140}}><h3 style={{fontSize:16,fontWeight:700,color:"#1a3c34"}}>{p.name}</h3></div><button style={{...S.btnPri,background:"#b91c1c",gap:5}} onClick={()=>printPc(p)}>{I.pdf} PDF</button></div>
  <div style={{...S.card,border:"2px solid #1a3c34"}}><div style={{fontSize:13,fontWeight:700,color:"#1a3c34",marginBottom:10,paddingBottom:6,borderBottom:"2px solid #e0e0e0"}}>Neraca</div>{[["Anggaran",fmtRp(p.anggaran),"#1a1a1a"],["Dicairkan","- "+fmtRp(c.totalCair),"#c0392b"]].map(([l,v,cl])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13,color:cl}}><span>{l}</span><span style={{fontWeight:700}}>{v}</span></div>))}<div style={{height:2,background:"#1a3c34",margin:"6px 0"}}/><div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:15,fontWeight:700,color:c.sisaAnggaran>=0?"#27ae60":"#c0392b"}}><span>Sisa</span><span>{fmtRp(c.sisaAnggaran)}</span></div></div>
  <div style={{...S.card,paddingTop:10,paddingBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11}}><span style={{color:"#888"}}>{fmtRp(c.totalCair)}/{fmtRp(p.anggaran)}</span><span style={{fontWeight:600}}>{pct.toFixed(1)}%</span></div><div style={S.progressOuter}><div style={{...S.progressInner,width:`${Math.min(pct,100)}%`,background:"#3b6b5e"}}/></div></div>
  <div style={S.card}><div style={S.cardHead}>Tambah Tahap</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input style={{...S.input,maxWidth:160}} type="number" placeholder="Jumlah" value={pcF.jumlah} onChange={e=>{setPcF({...pcF,jumlah:e.target.value});setErr("")}}/><input style={S.input} placeholder="Keterangan" value={pcF.ket} onChange={e=>setPcF({...pcF,ket:e.target.value})}/><button style={S.btnPri} onClick={()=>{if(!pcF.jumlah)return;const j=NM(pcF.jumlah);if(c.totalRencana+j>p.anggaran){setErr(`Melebihi! Sisa: ${fmtRp(c.sisaAlokasi)}`);return}setErr("");const nxt=p.pencairan.length?Math.max(...p.pencairan.map(x=>x.tahap))+1:1;onU({...p,pencairan:[...p.pencairan,{id:uid(),tahap:nxt,jumlah:j,tgl:"",status:"Belum Cair",ket:pcF.ket}]});setPcF({jumlah:"",ket:""})}}>{I.plus} Tambah</button></div>{err&&<div style={{fontSize:11,color:"#c0392b",background:"#fef2f2",padding:"6px 10px",borderRadius:6,marginTop:6}}>{err}</div>}</div>
  <div style={S.card}><div style={S.cardHead}>Detail Pencairan</div>{!p.pencairan.length?<div style={S.empty}>Belum ada</div>:<div style={S.tableWrap}><table style={S.table}><thead><tr><th style={{...S.th,width:40,textAlign:"center"}}>Thp</th><th style={{...S.th,textAlign:"left"}}>Ket</th><th style={{...S.th,textAlign:"right",width:105}}>Jumlah</th><th style={{...S.th,textAlign:"right",width:105}}>Potong</th><th style={{...S.th,textAlign:"right",width:105}}>Sisa</th><th style={{...S.th,textAlign:"center",width:85}}>Status</th><th style={{...S.th,width:100}}>Aksi</th></tr></thead><tbody>
  {(()=>{run=p.anggaran;return p.pencairan.map((pc,i)=>{const ic=pc.status!=="Belum Cair";if(ic)run-=pc.jumlah;const sc=stC(pc.status);const nl=nxLb(pc.status);return(<tr key={pc.id} style={i%2?{background:"#fafbfc"}:{}}><td style={{...S.td,textAlign:"center",fontWeight:700}}>{pc.tahap}</td><td style={{...S.td,textAlign:"left",fontSize:11}}>{pc.ket||"-"}{pc.tgl&&<div style={{fontSize:9,color:"#aaa"}}>{pc.tgl}</div>}</td><td style={{...S.td,textAlign:"right"}}>{fmtRp(pc.jumlah)}</td><td style={{...S.td,textAlign:"right",fontWeight:600,color:ic?"#c0392b":"#ccc"}}>{ic?`- ${fmtRp(pc.jumlah)}`:"-"}</td><td style={{...S.td,textAlign:"right",fontWeight:600}}>{ic?fmtRp(run):"-"}</td><td style={{...S.td,textAlign:"center"}}><span style={{...S.badge,background:sc.bg,color:sc.fg}}>{pc.status}</span></td><td style={{...S.td,textAlign:"center"}}><div style={{display:"flex",gap:3,justifyContent:"center"}}>{nl&&<button style={{...S.btnMini,borderColor:sc.fg,color:sc.fg}} onClick={()=>{const ns=nxSt(pc.status);onU({...p,pencairan:p.pencairan.map(x=>x.id===pc.id?{...x,status:ns,tgl:ns==="Sudah Cair"?fmtShort(new Date()):x.tgl}:x)})}}>{nl}</button>}<button style={{...S.iconBtn,color:"#c0392b"}} onClick={()=>onU({...p,pencairan:p.pencairan.filter(x=>x.id!==pc.id).map((x,j)=>({...x,tahap:j+1}))})}>{I.trash}</button></div></td></tr>)})})()}
  <tr style={{background:"#f4f7f6"}}><td colSpan="2" style={{...S.td,textAlign:"right",fontWeight:700}}>Total</td><td style={{...S.td,textAlign:"right",fontWeight:700}}>{fmtRp(c.totalRencana)}</td><td style={{...S.td,textAlign:"right",fontWeight:700,color:"#c0392b"}}>- {fmtRp(c.totalCair)}</td><td style={{...S.td,textAlign:"right",fontWeight:700,color:c.sisaAnggaran>=0?"#27ae60":"#c0392b"}}>{fmtRp(c.sisaAnggaran)}</td><td colSpan="2" style={S.td}/></tr></tbody></table></div>}</div>
</div>);}

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

  if(loading)return(
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",minHeight:"100vh",background:"linear-gradient(145deg,#0f2b24,#1a3c34 30%,#2d6a5a)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{gCSS}</style>
      <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
      <div style={{color:"#fff",fontSize:14,fontWeight:500}}>Memuat data...</div>
    </div>
  );

  if(!acct)return <LoginPage onLogin={setAcct} accounts={appData?.accounts||ACCTS}/>;

  return <MainApp account={acct} onLogout={()=>setAcct(null)} appData={appData} onSave={handleSave}/>;
}

const S={
  shell:{fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex",minHeight:"100vh",background:"#f0f2f5",color:"#1a1a1a"},
  side:{width:230,background:"linear-gradient(180deg,#0f2b24,#1a3c34)",color:"#fff",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:100,transform:"translateX(-100%)",transition:"transform 0.25s ease"},sideOpen:{transform:"translateX(0)"},sideOver:{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:99},sideBrand:{padding:"16px 14px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(255,255,255,0.1)"},sideLogo:{width:34,height:34,borderRadius:7,background:"rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},sideBT:{fontSize:13,fontWeight:700},sideBS:{fontSize:9,opacity:.5},sideX:{marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",padding:4},sideNav:{flex:1,padding:"10px 6px",display:"flex",flexDirection:"column",gap:1},sideItem:{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:7,border:"none",background:"transparent",color:"rgba(255,255,255,0.65)",cursor:"pointer",fontSize:12,fontWeight:500,textAlign:"left",width:"100%"},sideItemA:{background:"rgba(255,255,255,0.12)",color:"#fff",fontWeight:600},sideBot:{padding:"10px 10px 14px",borderTop:"1px solid rgba(255,255,255,0.1)"},sideUser:{display:"flex",alignItems:"center",gap:8,marginBottom:8},sideAv:{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700},sideLogout:{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",borderRadius:7,border:"none",background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:11,width:"100%"},
  content:{flex:1,display:"flex",flexDirection:"column",minHeight:"100vh"},
  topbar:{background:"#fff",padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.05)",position:"sticky",top:0,zIndex:50},menuBtn:{background:"none",border:"none",cursor:"pointer",color:"#1a3c34",padding:3,display:"flex"},pageTitle:{fontSize:16,fontWeight:700,color:"#1a3c34"},
  topClock:{display:"flex",flexDirection:"column",alignItems:"flex-end"},topTime:{fontSize:17,fontWeight:300,color:"#1a3c34",fontVariantNumeric:"tabular-nums"},topDate:{fontSize:10,color:"#999"},
  main:{padding:18,flex:1},
  welcomeBar:{background:"linear-gradient(135deg,#1a3c34,#2d6a5a)",borderRadius:11,padding:"18px 22px",color:"#fff",marginBottom:18},
  grid4:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:18},grid3:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:14},grid2:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:10,marginBottom:14},
  statCard:{background:"#fff",borderRadius:9,padding:"13px 15px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"},statLbl:{fontSize:10,fontWeight:500,color:"#888",marginBottom:4},statVal:{fontSize:19,fontWeight:700,color:"#1a3c34",fontVariantNumeric:"tabular-nums"},statMeta:{fontSize:10,color:"#aaa",marginTop:3},
  card:{background:"#fff",borderRadius:11,padding:"16px 18px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",marginBottom:12},cardHead:{fontSize:13,fontWeight:700,color:"#1a3c34",marginBottom:12,paddingBottom:7,borderBottom:"1px solid #f0f0f0"},
  progressOuter:{height:5,background:"#eee",borderRadius:3,overflow:"hidden"},progressInner:{height:"100%",borderRadius:3,transition:"width 0.4s"},
  lbl:{fontSize:10,fontWeight:600,color:"#666",display:"block",marginBottom:3},
  input:{padding:"8px 11px",fontSize:12,border:"1.5px solid #e0e0e0",borderRadius:7,background:"#fafbfc",color:"#1a1a1a",width:"100%",fontFamily:"inherit"},
  loginInput:{padding:"10px 12px",fontSize:13,border:"1.5px solid #e0e0e0",borderRadius:9,background:"#fafbfc",color:"#1a1a1a",width:"100%",fontFamily:"inherit"},
  select:{padding:"8px 11px",fontSize:12,border:"1.5px solid #e0e0e0",borderRadius:7,background:"#fafbfc",color:"#1a1a1a",cursor:"pointer",fontFamily:"inherit",width:"100%"},
  btnPri:{padding:"8px 15px",fontSize:12,fontWeight:600,border:"none",borderRadius:7,background:"#1a3c34",color:"#fff",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5,whiteSpace:"nowrap"},btnSec:{padding:"8px 13px",fontSize:12,fontWeight:500,border:"1.5px solid #ccc",borderRadius:7,background:"#fff",color:"#555",cursor:"pointer"},btnGhost:{display:"flex",alignItems:"center",gap:4,padding:"6px 11px",fontSize:12,fontWeight:500,border:"1.5px solid #ddd",borderRadius:7,background:"#fff",color:"#1a3c34",cursor:"pointer"},
  btnRet:{display:"flex",alignItems:"center",gap:3,padding:"5px 9px",fontSize:11,fontWeight:500,border:"1.5px solid #3b6b5e",borderRadius:5,background:"#f0faf7",color:"#1a3c34",cursor:"pointer",whiteSpace:"nowrap"},
  btnMini:{padding:"3px 8px",fontSize:10,fontWeight:600,border:"1.5px solid",borderRadius:4,background:"#fff",cursor:"pointer",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:2},
  iconBtn:{background:"none",border:"none",cursor:"pointer",color:"#666",padding:3,display:"flex",borderRadius:3},
  linkBtn:{background:"none",border:"none",cursor:"pointer",color:"#1a3c34",fontWeight:600,fontSize:12,textDecoration:"underline",textUnderlineOffset:2,padding:0,fontFamily:"inherit"},
  tableWrap:{overflowX:"auto"},table:{width:"100%",borderCollapse:"collapse",fontSize:11},th:{padding:"8px 9px",fontWeight:600,fontSize:9,color:"#888",borderBottom:"2px solid #f0f0f0",textAlign:"center",whiteSpace:"nowrap"},td:{padding:"8px 9px",borderBottom:"1px solid #f5f5f5",textAlign:"center",fontVariantNumeric:"tabular-nums"},
  badge:{padding:"2px 8px",borderRadius:16,fontSize:9,fontWeight:600,whiteSpace:"nowrap"},
  empty:{fontSize:12,color:"#bbb",fontStyle:"italic",padding:"16px 0",textAlign:"center"},
};

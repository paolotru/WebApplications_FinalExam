// getRispostaBy_D_Q_U = fetch campo text risposta;
import {Q,R,D} from './Components/oggetti.js';
const fetchQs = async() => {
    const response = await fetch('/api/qs');
    const ret = response.json().then(x=>x.map((e) => (new Q(e.id,e.name,e.authId,e.authName,e.ncompil))));
    return ret;
}
const fetchQbyId = async(id) => {
  const response = await fetch('/api/q?id='+id);
  const ret = response.json().then(x=>x.map((e) => (new Q(e.id,e.name,e.authId,e.authName,e.ncompil))));
  return ret;
}
const fetchQsbyAdmin = async(adminId) => {
    const response = await fetch('/api/qs?admin='+adminId);
    return response.json().then(x=>x.map((e) => (new Q(e.id,e.name,e.authId,e.authName,e.ncompil))));
}
const fetchDsbyQ = async(qId) =>{
    const response = await fetch('/api/ds?qId='+qId);
    const ret =response.json().then(x=>x.map((e) => (new D(e.id,e.text,e.qId,e.close,e.min,e.max,e.nrispmult))));
    return ret;
  }
const fetchRbyQ_user = async(qId,user)=>{
    const response = await fetch('/api/r?qId='+qId+'&user='+user);
    return response.json().then(x=>x.map((e) => (new R(e.id,e.text,e.qId,e.dId,e.user))));
}
const fetchMultipleRbyD =async(dId)=>{
  const response = await fetch('/api/mulr?dId='+dId);
  return response.json();
}
const fetchUcompilazioni = async(qId)=>{
  const response = await fetch('/api/ucompilazioni?qId='+qId);
  return response.json();
}

const fetchAddQ = async(q) =>{  
  const response = await fetch('/api/q',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({name:q.name,authId:q.authId,authN:q.authName,ncompil:q.ncompil}),
  });
  return response.json();
}
const fetchAddD = async(d) =>{  
  const response = await fetch('/api/d',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({text:d.text,qId:d.qId,min:d.min,max:d.max,close:d.close,ordine:d.ordine}),
  });
  return response.json();
}
const fetchAddR = async(r) =>{  
  const response = await fetch('/api/r',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({user:r.user,text:r.text,qId:r.qId,dId:r.dId}),
  });
  return response.json();
}
const fetchAddRmultiple = async(r) =>{  
  await fetch('/api/rmultiple',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({text:r.text,dId:r.dId}),
  });
}
const fetchAddCompilazione = async(user,qId) =>{  
  const response = await fetch('/api/compilazione',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({user:user,qId:qId}),
  });
  return response.json();
}
const fetchAddCompilazioneQ = async(qId) =>{  
  const response = await fetch('/api/compilazioneQ',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({qId:qId}),
  });
  return response.json();
}

const creazioneQ=async (q)=>{
  const qId=await API.fetchAddQ(q);
  q.domande.forEach(async (d)=>{
    d.qId=qId;
    const dId = await API.fetchAddD(d);
    if(d.close)
      d.possibilirisp.forEach(async r=>{
        await API.fetchAddRmultiple({text:r,dId:dId});
      });
  });
}

const login = async(credentials) =>{
  let response = await fetch('/api/sessions',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'},
    body: JSON.stringify(credentials),
  });
  if(response.ok){
    const user=await response.json();
    return user;
  }else{
    const errDetails=await response.text();
    throw errDetails;
  }
}
async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}
async function getUserInfo(){
  const res = await fetch('/api/sessions/current');
  const userInfo = await res.json();
  if(res.ok)
    return userInfo;
  else
    throw userInfo;
}

const API = {fetchQbyId,fetchAddCompilazione,fetchAddCompilazioneQ,creazioneQ,fetchAddRmultiple,fetchAddQ,fetchAddD,fetchAddR,
              fetchUcompilazioni,fetchQs,fetchQsbyAdmin,fetchMultipleRbyD,fetchDsbyQ,fetchRbyQ_user,login,logOut,getUserInfo};
export default API;
let books=[], filtered=[], page=1;
const $=id=>document.getElementById(id);
const norm=v=>(v??"").toString().toLowerCase().trim();
async function init(){
 try{
  const res=await fetch("data/ebooks.json",{cache:"no-store"});
  if(!res.ok) throw new Error("HTTP "+res.status);
  books=await res.json();
  buildFilters(); updateStats(); apply();
 }catch(e){
  $("results").innerHTML='<div class="empty"><h3>Collection could not be loaded</h3><p>Make sure <b>data/ebooks.json</b> is uploaded to the repository.</p></div>';
  $("count").textContent="Error loading collection";
  console.error(e);
 }
}
function unique(field){return [...new Set(books.map(b=>b[field]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));}
function buildFilters(){
 unique("year").reverse().forEach(v=>$("yearFilter").add(new Option(v,v)));
 unique("publisher").forEach(v=>$("publisherFilter").add(new Option(v,v)));
}
function updateStats(){
 $("statBooks").textContent=books.length.toLocaleString();
 $("statAuthors").textContent=new Set(books.map(b=>norm(b.author)).filter(Boolean)).size.toLocaleString();
 $("statPublishers").textContent=new Set(books.map(b=>norm(b.publisher)).filter(Boolean)).size.toLocaleString();
 $("statYears").textContent=new Set(books.map(b=>b.year).filter(Boolean)).size.toLocaleString();
}
function matches(b,q,field){
 if(!q)return true;
 let vals=field==="all"?["title","author","publisher","isbn","url_doi","subject","department","remarks"]:field==="doi"?["url_doi"]:[field];
 return vals.some(k=>norm(b[k]).includes(q));
}
function apply(){
 const q=norm($("q").value), field=$("field").value, year=$("yearFilter").value, pub=$("publisherFilter").value;
 filtered=books.filter(b=>matches(b,q,field)&&(year===""||b.year===year)&&(pub===""||b.publisher===pub));
 page=1; render();
 $("resultTitle").textContent=q?"Search Results":"All E-Books";
 $("count").textContent=`${filtered.length.toLocaleString()} record${filtered.length===1?"":"s"} found`;
}
function render(){
 const per=Number($("perPage").value), start=(page-1)*per, items=filtered.slice(start,start+per);
 if(!items.length){$("results").innerHTML='<div class="empty"><h3>No e-books found</h3><p>Try another title, author, publisher, ISBN or DOI.</p></div>';}
 else $("results").innerHTML=items.map(card).join("");
 renderPages(Math.ceil(filtered.length/per));
}
function card(b){
 const link=(b.url_doi||"").trim();
 return `<article class="book">
 <div><h3>${esc(b.title||"Untitled")}</h3>${b.author?`<div class="author">${esc(b.author)}</div>`:""}
 <div class="meta">${b.publisher?`<span><b>Publisher:</b> ${esc(b.publisher)}</span>`:""}${b.year?`<span><b>Year:</b> ${esc(b.year)}</span>`:""}${b.isbn?`<span><b>ISBN:</b> ${esc(b.isbn)}</span>`:""}</div>
 ${b.subject?`<div class="subject">${esc(b.subject)}</div>`:""}</div>
 <div class="actions"><button class="details" onclick="showBook(${books.indexOf(b)})">View Details</button>${isUrl(link)?`<a class="access" href="${escAttr(link)}" target="_blank" rel="noopener noreferrer">Access E-Book ↗</a>`:""}</div>
 </article>`;
}
function showBook(i){
 const b=books[i]; const link=(b.url_doi||"").trim();
 const fields=[["Author",b.author],["Publisher",b.publisher],["Publication Year",b.year],["eISBN",b.isbn],["URL / DOI",b.url_doi],["Subject",b.subject],["Department",b.department],["Remarks",b.remarks]].filter(x=>x[1]);
 $("modalContent").innerHTML=`<div class="eyebrow">E-BOOK RECORD</div><h2>${esc(b.title)}</h2><div class="detailgrid">${fields.map(x=>`<div><small>${esc(x[0])}</small><p>${esc(x[1])}</p></div>`).join("")}</div>${isUrl(link)?`<a class="modal-access" href="${escAttr(link)}" target="_blank" rel="noopener noreferrer">Access E-Book ↗</a>`:""}`;
 $("modal").classList.add("show");$("modal").setAttribute("aria-hidden","false");
}
function renderPages(n){
 let s=""; if(n<=1){$("pagination").innerHTML="";return}
 for(let i=1;i<=n;i++){if(i<=3||i>n-2||Math.abs(i-page)<=1)s+=`<button class="${i===page?"active":""}" onclick="gotoPage(${i})">${i}</button>`;else if(i===4||i===n-3)s+="<span>…</span>";}
 $("pagination").innerHTML=s;
}
function gotoPage(p){page=p;render();window.scrollTo({top:document.querySelector(".results").offsetTop-20,behavior:"smooth"});}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function escAttr(v){return esc(v);}
function isUrl(v){try{let u=new URL(v);return u.protocol==="http:"||u.protocol==="https:"}catch{return false}}
$("searchBtn").onclick=apply;$("q").addEventListener("keydown",e=>{if(e.key==="Enter")apply()});
$("field").onchange=apply;$("yearFilter").onchange=apply;$("publisherFilter").onchange=apply;$("perPage").onchange=render;
$("clearBtn").onclick=()=>{$("q").value="";$("field").value="all";$("yearFilter").value="";$("publisherFilter").value="";apply()};
document.querySelectorAll(".quick button").forEach(b=>b.onclick=()=>{$("field").value=b.dataset.field;apply()});
$("closeModal").onclick=()=>{$("modal").classList.remove("show")};
$("modal").onclick=e=>{if(e.target===$("modal"))$("modal").classList.remove("show")};
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("modal").classList.remove("show")});
init();
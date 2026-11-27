'use strict';
const STORAGE_KEY = 'tresors-guadeloupe-data-v1';
const seedData = () => ({
  products: [
    {id:1,name:'Mangues Julie',producer:'Verger de Marie',category:'Fruits & légumes',buy:2,sell:4.5,stock:30,emoji:'🥭'},
    {id:2,name:'Bananes plantain',producer:'Ferme Bellevue',category:'Fruits & légumes',buy:1.5,sell:3.5,stock:50,emoji:'🍌'},
    {id:3,name:'Confiture goyave',producer:'Saveurs Créoles',category:'Épicerie',buy:4,sell:7.5,stock:15,emoji:'🍯'},
    {id:4,name:'Vanille de Guadeloupe',producer:'Les Jardins Créoles',category:'Épices',buy:5,sell:9.5,stock:12,emoji:'🌿'},
    {id:5,name:'Jus de canne',producer:'Canne & Soleil',category:'Boissons',buy:2.5,sell:5,stock:20,emoji:'🥤'},
    {id:6,name:'Cacao local',producer:'Chocolaterie des Îles',category:'Épicerie',buy:6,sell:11,stock:10,emoji:'🍫'}
  ],
  producers: [
    {id:1,name:'Verger de Marie',contact:'Marie',phone:'À renseigner',town:'Capesterre-Belle-Eau',specialty:'Mangues, fruits'},
    {id:2,name:'Ferme Bellevue',contact:'À renseigner',phone:'À renseigner',town:'Morne-à-l’Eau',specialty:'Plantain, légumes'},
    {id:3,name:'Saveurs Créoles',contact:'À renseigner',phone:'À renseigner',town:'Le Moule',specialty:'Confitures'},
    {id:4,name:'Les Jardins Créoles',contact:'À renseigner',phone:'À renseigner',town:'Basse-Terre',specialty:'Vanille, épices'}
  ],
  orders: [], cart: []
});
let data = loadData();
let activeCategory = 'Tous';
const $ = id => document.getElementById(id);
const money = value => Number(value || 0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function loadData(){try{const saved=localStorage.getItem(STORAGE_KEY);return saved?JSON.parse(saved):seedData()}catch(error){console.warn('Données locales illisibles',error);return seedData()}}
function saveData(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}catch(error){notify('Impossible de sauvegarder : stockage du navigateur indisponible.')}}
function notify(message){const toast=$('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('show'),2600)}
function switchTab(name){document.querySelectorAll('.tab').forEach(button=>button.classList.toggle('active',button.dataset.tab===name));document.querySelectorAll('.view').forEach(view=>view.classList.toggle('hidden',view.id!==name));render()}
document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>switchTab(button.dataset.tab)));

function renderShop(){
  const categories=['Tous',...new Set(data.products.map(p=>p.category))];
  $('categories').innerHTML=categories.map(c=>`<button class="chip ${activeCategory===c?'active':''}" data-category="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join('');
  document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.category;renderShop()}));
  const query=$('search').value.trim().toLocaleLowerCase('fr');
  const products=data.products.filter(p=>(activeCategory==='Tous'||p.category===activeCategory)&&[p.name,p.producer,p.category].join(' ').toLocaleLowerCase('fr').includes(query));
  $('product-grid').innerHTML=products.length?products.map(p=>`
    <article class="product"><div class="product-photo">${escapeHTML(p.emoji||'🌴')}</div><div class="product-body">
      <div class="category">${escapeHTML(p.category)}</div><h3>${escapeHTML(p.name)}</h3><div class="producer">${escapeHTML(p.producer)}</div>
      <div class="price">${money(p.sell)}</div><div class="stock">${p.stock>0?`${p.stock} en stock`:'Indisponible'}</div>
      <button class="button primary" data-add="${p.id}" ${p.stock<=0?'disabled':''}>Ajouter au panier</button>
    </div></article>`).join(''):'<p class="muted">Aucun produit trouvé.</p>';
  document.querySelectorAll('[data-add]').forEach(button=>button.addEventListener('click',()=>addToCart(Number(button.dataset.add))));
}
function addToCart(id){const product=data.products.find(p=>p.id===id);if(!product)return;const item=data.cart.find(i=>i.id===id);if(item){if(item.qty>=product.stock)return notify('Stock maximum atteint.');item.qty++}else data.cart.push({id,qty:1});saveData();renderCart();notify('Produit ajouté au panier.')}
function renderCart(){
  $('cart-count').textContent=data.cart.reduce((sum,item)=>sum+item.qty,0);
  $('cart-items').innerHTML=data.cart.length?data.cart.map(item=>{const p=data.products.find(x=>x.id===item.id);if(!p)return '';return `<div class="cart-row"><div><strong>${escapeHTML(p.name)}</strong><div class="muted">${money(p.sell*item.qty)}</div></div><div class="cart-controls"><button class="button small" data-dec="${p.id}" aria-label="Retirer une unité">−</button><span>${item.qty}</span><button class="button small" data-inc="${p.id}" aria-label="Ajouter une unité">＋</button><button class="button small" data-remove="${p.id}" aria-label="Supprimer">×</button></div></div>`}).join(''):'<p class="muted">Ton panier est vide.</p>';
  $('cart-total').textContent=money(data.cart.reduce((sum,item)=>sum+(data.products.find(p=>p.id===item.id)?.sell||0)*item.qty,0));
  document.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>changeQty(+b.dataset.dec,-1));
  document.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>changeQty(+b.dataset.inc,1));
  document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{data.cart=data.cart.filter(i=>i.id!==+b.dataset.remove);saveData();renderCart()});
}
function changeQty(id,delta){const item=data.cart.find(i=>i.id===id),product=data.products.find(p=>p.id===id);if(!item||!product)return;item.qty+=delta;if(item.qty<1)data.cart=data.cart.filter(i=>i.id!==id);if(item.qty>product.stock)item.qty=product.stock;saveData();renderCart()}
$('cart-toggle').addEventListener('click',()=>$('cart-panel').classList.toggle('hidden'));
$('search').addEventListener('input',renderShop);
$('checkout').addEventListener('click',()=>{
  if(!data.cart.length)return notify('Le panier est vide.');
  const customer=$('customer-name').value.trim();if(!customer)return notify('Renseigne le nom du client.');
  for(const item of data.cart){const p=data.products.find(x=>x.id===item.id);if(!p||p.stock<item.qty)return notify(`Stock insuffisant : ${p?.name||'produit'}.`)}
  const lines=data.cart.map(item=>{const p=data.products.find(x=>x.id===item.id);p.stock-=item.qty;return {name:p.name,qty:item.qty,price:p.sell,buy:p.buy}});
  const total=lines.reduce((sum,line)=>sum+line.qty*line.price,0);
  data.orders.unshift({id:Date.now(),date:new Date().toLocaleString('fr-FR'),customer,contact:$('customer-contact').value,type:$('customer-type').value,note:$('customer-note').value,lines,total,status:'À traiter'});
  data.cart=[];saveData();$('cart-panel').classList.add('hidden');$('customer-name').value='';$('customer-contact').value='';$('customer-note').value='';render();notify('Commande enregistrée.');switchTab('orders');
});

function renderAdmin(){
  const revenue=data.orders.filter(o=>o.status!=='Annulée').reduce((s,o)=>s+o.total,0);
  const margin=data.orders.filter(o=>o.status!=='Annulée').reduce((s,o)=>s+o.lines.reduce((a,l)=>a+(l.price-l.buy)*l.qty,0),0);
  $('revenue').textContent=money(revenue);$('margin').textContent=money(margin);$('product-count').textContent=data.products.length;$('total-orders').textContent=data.orders.length;
  $('inventory').innerHTML=data.products.map(p=>`<tr><td>${escapeHTML(p.emoji)} ${escapeHTML(p.name)}</td><td>${money(p.buy)}</td><td>${money(p.sell)}</td><td>${money(p.sell-p.buy)}</td><td>${p.stock}</td><td><button class="button small" data-delete-product="${p.id}">Supprimer</button></td></tr>`).join('')||'<tr><td colspan="6">Aucun produit.</td></tr>';
  document.querySelectorAll('[data-delete-product]').forEach(b=>b.onclick=()=>{if(confirm('Supprimer ce produit du catalogue ?')){data.products=data.products.filter(p=>p.id!==+b.dataset.deleteProduct);data.cart=data.cart.filter(i=>i.id!==+b.dataset.deleteProduct);saveData();render()}});
}
$('product-form').addEventListener('submit',event=>{
  event.preventDefault();const buy=Number($('new-buy').value),sell=Number($('new-sell').value),stock=Number($('new-stock').value);
  if(buy<0||sell<0||stock<0)return notify('Les prix et le stock doivent être positifs.');
  data.products.push({id:Date.now(),name:$('new-name').value.trim(),producer:$('new-producer').value.trim(),category:$('new-category').value,buy,sell,stock,emoji:$('new-emoji').value.trim()||'🌴'});
  saveData();event.target.reset();$('new-emoji').value='🌴';render();notify('Produit ajouté au catalogue.');
});
function renderProducers(){
  $('producer-list').innerHTML=data.producers.length?data.producers.map(p=>`<article class="producer-card"><div class="card-top"><strong>${escapeHTML(p.name)}</strong><span class="tag">${escapeHTML(p.town||'Guadeloupe')}</span></div><p class="muted">${escapeHTML(p.specialty||'Spécialité à préciser')}</p><div class="muted">${escapeHTML(p.contact)} · ${escapeHTML(p.phone)}</div><button class="button small danger" data-delete-producer="${p.id}">Supprimer</button></article>`).join(''):'<p class="muted">Aucun producteur enregistré.</p>';
  document.querySelectorAll('[data-delete-producer]').forEach(b=>b.onclick=()=>{if(confirm('Supprimer ce producteur ?')){data.producers=data.producers.filter(p=>p.id!==+b.dataset.deleteProducer);saveData();renderProducers()}});
}
$('producer-form').addEventListener('submit',event=>{event.preventDefault();data.producers.push({id:Date.now(),name:$('producer-name').value.trim(),contact:$('producer-contact').value.trim(),phone:$('producer-phone').value.trim(),town:$('producer-town').value.trim(),specialty:$('producer-specialty').value.trim()});saveData();event.target.reset();renderProducers();notify('Producteur ajouté.')});
function renderOrders(){
  $('order-count').textContent=data.orders.length?`(${data.orders.length})`:'';
  $('order-list').innerHTML=data.orders.length?data.orders.map(o=>`<article class="order-card"><div class="card-top"><strong>Commande #${String(o.id).slice(-6)}</strong><span class="tag">${escapeHTML(o.status)}</span></div><p class="muted">${escapeHTML(o.date)} · ${escapeHTML(o.customer)} · ${escapeHTML(o.type)}</p><p>${o.lines.map(l=>`${escapeHTML(l.name)} × ${l.qty}`).join('<br>')}</p><strong>${money(o.total)}</strong><p class="muted">${escapeHTML(o.contact)} ${o.note?'· '+escapeHTML(o.note):''}</p><div class="row-actions"><select class="field" data-status="${o.id}" aria-label="Statut de la commande">${['À traiter','Confirmée','En préparation','Prête / expédiée','Livrée','Annulée'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select><button class="button small danger" data-delete-order="${o.id}">Supprimer</button></div></article>`).join(''):'<div class="panel muted">Aucune commande pour le moment. Les commandes passées depuis la boutique apparaîtront ici.</div>';
  document.querySelectorAll('[data-status]').forEach(select=>select.addEventListener('change',()=>{const order=data.orders.find(o=>o.id===+select.dataset.status);if(order){order.status=select.value;saveData();renderOrders()}}));
  document.querySelectorAll('[data-delete-order]').forEach(b=>b.onclick=()=>{if(confirm('Supprimer cette commande ?')){data.orders=data.orders.filter(o=>o.id!==+b.dataset.deleteOrder);saveData();render()}});
}
function render(){renderShop();renderCart();renderAdmin();renderProducers();renderOrders()}
$('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='tresors-guadeloupe-sauvegarde.json';a.click();URL.revokeObjectURL(url);notify('Sauvegarde exportée.')});
$('import-file').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{const imported=JSON.parse(await file.text());if(!Array.isArray(imported.products)||!Array.isArray(imported.producers)||!Array.isArray(imported.orders)||!Array.isArray(imported.cart))throw new Error('Format non reconnu');data=imported;saveData();render();notify('Sauvegarde importée.')}catch(error){notify('Fichier invalide ou incompatible.')}event.target.value=''});
$('reset').addEventListener('click',()=>{if(confirm('Réinitialiser les données de démonstration ? Cette action effacera les données locales actuelles.')){data=seedData();saveData();render();notify('Démo réinitialisée.')}});
render();

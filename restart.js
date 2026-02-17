const baseURL="https://fakestoreapi.com/products";
let allProducts=[];
let cart=JSON.parse(localStorage.getItem("cart"))||[];

document.addEventListener("DOMContentLoaded",()=>{
updateCartUI();
loadCategories();
loadProducts();
loadTrending();
});

function scrollToProducts(){
document.getElementById("products").scrollIntoView({behavior:"smooth"});
}

async function loadCategories(){
const res=await fetch(baseURL+"/categories");
const data=await res.json();
const container=document.getElementById("categories");

const allBtn=document.createElement("button");
allBtn.textContent="All";
allBtn.classList.add("active");
allBtn.onclick=()=>{setActive(allBtn);loadProducts();}
container.appendChild(allBtn);

data.forEach(cat=>{
const btn=document.createElement("button");
btn.textContent=cat;
btn.onclick=()=>{setActive(btn);loadProducts(cat);}
container.appendChild(btn);
});
}

function setActive(btn){
document.querySelectorAll(".categories button")
.forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
}

async function loadProducts(category){
document.getElementById("spinner").style.display="block";
let url=category?`${baseURL}/category/${category}`:baseURL;
const res=await fetch(url);
const data=await res.json();
allProducts=data;
displayProducts(data);
document.getElementById("spinner").style.display="none";
}

function displayProducts(products){
const container=document.getElementById("products");
container.innerHTML="";

products.forEach(product=>{
const card=document.createElement("div");
card.className="card";

card.innerHTML=`
<img src="${product.image}" alt="${product.title}">
<div class="top-row">
<span class="badge">${product.category}</span>
<span class="price">$${product.price}</span>
</div>
<h4>${product.title.slice(0,50)}</h4>
<p class="rating">⭐ ${product.rating.rate} (${product.rating.count})</p>
<div class="btn-group">
<button class="details-btn" onclick="showDetails(${product.id})">Details</button>
<button class="add-btn">Add to Cart</button>
</div>
`;

card.querySelector(".add-btn").addEventListener("click", ()=> addToCart(product));

container.appendChild(card);
});
}

async function loadTrending(){
const res = await fetch(baseURL);
const data = await res.json();
const top = data.sort((a,b)=>b.rating.rate - a.rating.rate).slice(0,3);
displayTrending(top);
}

function displayTrending(products){
const container = document.getElementById("trending");
container.innerHTML = "";

products.forEach(p => {
const div = document.createElement("div");
div.className = "card";

div.innerHTML = `
<img src="${p.image}" alt="${p.title}">
<div class="top-row">
<span class="badge">${p.category}</span>
<span class="price">$${p.price}</span>
</div>
<h4>${p.title.slice(0,45)}</h4>
<p class="rating">⭐ ${p.rating.rate} (${p.rating.count})</p>
<div class="btn-group">
<button class="details-btn" onclick="showDetails(${p.id})">Details</button>
<button class="add-btn">Add to Cart</button>
</div>
`;

div.querySelector(".add-btn").addEventListener("click", ()=> addToCart(p));

container.appendChild(div);
});
}

function addToCart(product){
cart.push(product);
localStorage.setItem("cart",JSON.stringify(cart));
updateCartUI();
}

function updateCartUI(){
document.getElementById("cartCount").textContent=cart.length;
const container=document.getElementById("cartItems");
container.innerHTML="";
let total=0;
cart.forEach((item,index)=>{
total+=item.price;
container.innerHTML+=`
<div class="cart-item">
<p>${item.title.slice(0,20)}</p>
<p>$${item.price}</p>
<button onclick="removeItem(${index})">X</button>
</div>`;
});
document.getElementById("totalPrice").textContent=total.toFixed(2);
}

function removeItem(index){
cart.splice(index,1);
localStorage.setItem("cart",JSON.stringify(cart));
updateCartUI();
}

function openCart(){document.getElementById("cartModal").style.display="block"}
function closeCart(){document.getElementById("cartModal").style.display="none"}

async function showDetails(id){
const res=await fetch(`${baseURL}/${id}`);
const p=await res.json();
const box=document.getElementById("modalBox");
box.innerHTML=`
<h3>${p.title}</h3>
<p>${p.description}</p>
<p>Price: $${p.price}</p>
<p>Rating: ${p.rating.rate}</p>
<button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
<button onclick="closeModal()">Close</button>
`;
document.getElementById("modal").style.display="flex";
}

function closeModal(){
document.getElementById("modal").style.display="none";
}
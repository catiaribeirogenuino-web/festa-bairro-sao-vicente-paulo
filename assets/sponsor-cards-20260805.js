const recoveredSponsorMedia={
  "Casa dos Presuntos":"./assets/sponsor-casa-dos-presuntos.png",
  "Eletro Ideal":"./assets/sponsor-eletro-ideal.png",
  "Agência Funerária Rebelo":"./assets/sponsor-agencia-funeraria-rebelo.png",
  "Nova Real — Restaurante e Churrasqueira":"./assets/sponsor-nova-real.png"
};

const recoveredSponsorNames=[
  "Agência Funerária Rebelo",
  "Nova Real — Restaurante e Churrasqueira"
];

const recoveredSponsorName=card=>card.querySelector("p")?.textContent.trim()||"";
const recoveredSponsorSlug=name=>name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/&/g,"e").replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-|-$/g,"").toLowerCase();

function createRecoveredSponsor(name,hidden){
  const card=document.createElement("article");
  card.className="sponsor-slide sponsor-slide-card";
  card.setAttribute("aria-hidden",hidden?"true":"false");
  card.innerHTML=`<span>Patrocinador</span><img src="${recoveredSponsorMedia[name]}" alt="${hidden?"":name}"><p>${name}</p>`;
  return card
}

function decorateRecoveredSponsor(card){
  const name=recoveredSponsorName(card);
  const image=recoveredSponsorMedia[name];
  if(!image)return;
  card.classList.add("sponsor-slide-card");
  card.dataset.sponsor=recoveredSponsorSlug(name);
  const oldVisual=card.querySelector(":scope > img, :scope > strong");
  if(oldVisual?.tagName==="IMG")oldVisual.src=image;
  else{
    const visual=document.createElement("img");
    visual.src=image;
    oldVisual?.replaceWith(visual)
  }
  const visual=card.querySelector(":scope > img");
  if(visual)visual.alt=card.getAttribute("aria-hidden")==="true"?"":name
}

function addRecoveredSponsors(){
  document.querySelectorAll(".sponsor-track").forEach(track=>{
    const visible=Array.from(track.children).filter(card=>card.getAttribute("aria-hidden")!=="true");
    const hidden=Array.from(track.children).filter(card=>card.getAttribute("aria-hidden")==="true");
    recoveredSponsorNames.forEach(name=>{
      if(!visible.some(card=>recoveredSponsorName(card)===name))visible.push(createRecoveredSponsor(name,false));
      if(!hidden.some(card=>recoveredSponsorName(card)===name))hidden.push(createRecoveredSponsor(name,true))
    });
    [...visible,...hidden].forEach(card=>{decorateRecoveredSponsor(card);track.appendChild(card)})
  })
}

function ensureRecoveredSponsors(){
  addRecoveredSponsors();
  window.setTimeout(addRecoveredSponsors,250);
  window.setTimeout(addRecoveredSponsors,1000)
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureRecoveredSponsors);else ensureRecoveredSponsors();
window.addEventListener("load",ensureRecoveredSponsors,{once:true});

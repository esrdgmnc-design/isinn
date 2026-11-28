(()=>{let n=0;document.querySelectorAll('p,li,tr,dd,dt,span,div').forEach(e=>{const own=[...e.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent).join('');if(/\d/.test(own)){(e.closest('p,li,tr')||e).style.display='none';n++;}});
document.querySelectorAll('div').forEach(d=>{if(d.children.length===2&&/^Yayın tarihi/.test(d.innerText))d.style.display='none'});return n})()

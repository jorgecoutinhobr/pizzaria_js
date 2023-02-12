const c = (el) => document.querySelector(el);     // Objetivo de reduzir codigo
const f = (el) => document.querySelectorAll(el);

let modalQt = 1; // contador de nº de itens
let cart = []; // lista carrinho de compras
let modalKey = 0; // saber qual pizza clicada


// Listagem de pizzas ==============================================
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true); // clonar div
    pizzaItem.setAttribute('data-key', index);
    // preencher informações
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price[2].toFixed(2)}`;
    
    // menu click
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[2].toFixed(2)}`;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo--size.selected').classList.remove('selected'); 
       
        f('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;
        
 
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{c('.pizzaWindowArea').style.opacity = 1} ,200);

    })

    // colocar na tela
    c('.pizza-area').append(pizzaItem);
});

// EVENTOS MODAL =======================================================
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{ c('.pizzaWindowArea').style.display = 'none';}, 500);
}

f('.pizzaInfo--cancelButton , .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
})

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++
    c('.pizzaInfo--qt').innerHTML = modalQt;
})

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){ 
        modalQt-- 
        c('.pizzaInfo--qt').innerHTML = modalQt
    };
})

f('.pizzaInfo--size').forEach((size, sizeIndex)=>{    // LEMBRAR DE MUDAR PREÇOS DE ACORDO COM O TAMANHO
    size.addEventListener('click', (e)=>{
        
        
        c('.pizzaInfo--size.selected').classList.remove('selected'); 
        e.target.classList.add("selected") 
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[sizeIndex].toFixed(2)}`;
        
    })
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;  // criar identificador para config carrinho
    let key = cart.findIndex((item)=>{return item.identifier == identifier}) // se não encontrar, vai retornar -1

    if(key >-1 ){
        cart[key].qt += modalQt;

    } else {
        cart.push({
        identifier,
        id: pizzaJson[modalKey].id,
        size: size,
        qt: modalQt,
        price: pizzaJson[modalKey].price[size]
    });}

    updateCart();
    closeModal();
})

c('.menu-openner').addEventListener('click', ()=>{
    // if (cart.length > 0 ) {
    //     c('aside').style.left = 0;
    // }
    c('aside').style.left = 0;
})

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})


 c('.cartInicial').addEventListener('click', ()=>{
    c('aside').classList.toggle('show');
}) 
c('.closerInicial').addEventListener('click', ()=>{
    c('aside').classList.remove('show');
})

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''; // zerar a lista de itens

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id               
            })
            subtotal += pizzaItem.price[i] * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSize;
            switch(cart[i].size){
                case 0:
                    pizzaSize = 'P';
                    break
                case 1:
                    pizzaSize= 'M';
                    break
                case 2:
                    pizzaSize = 'G';
                    break
            }
            
            let pizzaName = `${pizzaItem.name} (${pizzaSize})`
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            
            cartItem.querySelector(".cart--item-qtmenos").addEventListener('click', ()=>{
                if(cart[i].qt > 1 ){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1)
                }
                updateCart();
            })
            cartItem.querySelector(".cart--item-qtmais").addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            })


            c('.cart').append(cartItem);
        }
    
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else{
        c('.cart').innerHTML = '';
        subtotal = 0;
        total =0;
        desconto = 0;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
        c('aside').classList.remove('show'); 
        c('aside').style.left = '100vw';
        
    }
}


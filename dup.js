

if (window.location.pathname === '/index.html') {
    const body = document.querySelector('.pro-container');
    const categoryDiv = document.querySelector('.category');


    const getCategories = async () => {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const data = await response.json();

        data.forEach((category) => {
            const a = document.createElement('a');
            a.href = "#";
            // a.style.textDecoration=none;
            // a.style.color=black;
            a.classList.add('nav-link');
            a.textContent = category.charAt(0).toUpperCase() + category.substring(1);

            if (categoryDiv !== null) {

                categoryDiv.appendChild(a);
            }

        })
    }
    getCategories();

    var cartItems = localStorage.getItem('cart') || [];
    if (!Array.isArray(cartItems)) {
        cartItems = [];
    }

    const getElement = async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        const addProduct = (product) => {
            const container = document.createElement('div');
            container.classList.add('pro');

            const img = document.createElement('img');
            img.src = product.image;
            container.appendChild(img);

            const description = document.createElement('div');
            description.classList.add('des');

            const title = document.createElement('h5');
            title.textContent = product.title;
            description.appendChild(title);


            const price = document.createElement('p');
            price.textContent = `$${product.price}`;
            description.appendChild(price);

            container.appendChild(description);

            const cart = document.createElement('button');
            cart.textContent = 'Add to Cart';
            cart.style.width = '10vw';
            cart.style.height = '3vw';
            cart.style.backgroundColor = "yellow";
            cart.style.fontWeight = 'bolder';
            cart.style.border = 'none';
            container.appendChild(cart);
            cart.addEventListener('click', () => {
                event.stopPropagation();
                console.log(product.id);
                cartItems.push(product.id);
                localStorage.setItem('cart', cartItems);
                cart.textContent = 'Added';
                cart.style.backgroundColor = "green";
                cart.style.color = "white";
            })
            cart.style.zIndex = "9999";
            container.addEventListener('click', () => {
                window.location.href = `./card.html?id=${product.id}`;
            })
            // Apply CSS styles to the product container (uncomment these lines if needed)
            // container.style.width = '23%';

            // Add the product container to the body
            if (body !== null)
                body.appendChild(container);
        };

        // Call addProduct for each product in the data array
        data.forEach(addProduct);
    };

    getElement();
}



if (window.location.pathname === "/cart.html") {
    const temp = document.querySelector(".cartf");
    var cartItems = window.localStorage.getItem('cart');
    const newarr = cartItems.split(',');

    if (cartItems.length > 0) {
        let c = 0;
        newarr.forEach(async (item) => {
            var td = document.createElement('img');
            var tt = document.createElement('h3');
            var des = document.createElement('p');
            var pr = document.createElement('p');
            var rat = document.createElement('p')
            var pdiv = document.createElement('div');
            var tdiv = document.createElement('div');
            var b = document.createElement('button');

            pdiv.classList.add('cartItem');

            pdiv.style.display = 'flex';
            pdiv.style.justifyContent = 'space-between';
            pdiv.style.alignItems = 'center';
            const response = await fetch(`https://fakestoreapi.com/products/${item}`);
            const data = await response.json();

            td.src = data.image;

            des.textContent = data.description;
            tt.textContent = data.title;
            pr.textContent = "Price: $" + data.price;
            rat.textContent = "Rating: " + data.rating.rate;
            c = c + data.price;

            b.innerText = "Remove";
            b.addEventListener('click', () => {
                var cartItems = localStorage.getItem('cart') || [];
                var ar = cartItems.split(',');
                console.log(`arr is ${ar}`);
                const index = ar.indexOf((data.id + ""));
                console.log(`elemnt to be searched is ${data.id}`)
                console.log(`index is ${index}`);

                ar.splice(index, 1);
                console.log("array" + ar);
                localStorage.setItem('cart', ar);
                b.innerText = 'Removed';
                b.style.backgroundColor = 'green';
                location.reload();
            });

            tdiv.appendChild(tt);
            tdiv.appendChild(des);
            tdiv.appendChild(rat);
            tdiv.appendChild(pr);
            tdiv.appendChild(b);
            tdiv.style.width = '50%';

            td.style.width = '13vw';
            td.style.height = '28vh'
            pdiv.appendChild(td);
            pdiv.appendChild(tdiv);
            pdiv.style.width = '70%';

            pdiv.style.margin = 'auto';
            pdiv.style.border = '0.5px solid gray';
            pdiv.style.marginBottom = '20px';
            temp.appendChild(pdiv);
            var total = document.querySelector('#num');
            total.textContent = "$" + c;

        });

    }
    else {
        console.log("empty");
    }
}

if (window.location.pathname === '/payment.html') {
    const proceed = document.querySelector('#proceed');

    // const secondName=document.querySelector('#inputPassword4').value;

    proceed.addEventListener('click', (e) => {
        const firstName = document.querySelector('#inputEmail4').value;
        const secondName = document.querySelector('#inputEmail4').value;
        const addr = document.querySelector('#inputAddress').value;
        const addr2 = document.querySelector("#inputAddress2").value;
        const pin = document.querySelector("#inputZip").value;
        const upi = document.querySelector("#inputCity").value;
        if (firstName === '' || secondName === '' || addr === '' || addr2 === '' || pin === '' || upi === '') {
            alert('Please enter all inputs');
        }
        else {

            e.preventDefault();
            alert('Payment Successful');
        }
    });
}
if (window.location.pathname === '/card.html') {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    window.addEventListener('DOMContentLoaded', () => {
        async function getProductDetails(productId) {
            const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
            const data = await response.json();
            const proDetails = document.querySelector('.product-details');

            const img = document.createElement('img');
            img.src = data.image;
            proDetails.appendChild(img);

            const rightDiv = document.createElement('div');
            rightDiv.classList.add('card-rightDiv');

            const title = document.createElement('h2');
            title.textContent = data.title;
            rightDiv.appendChild(title);

            const star = document.createElement('i');
            star.classList.add('fas', 'fa-star');

            const rate = document.createElement('span');
            rate.textContent = "Rating-  " + data.rating.rate + " ";
            rate.appendChild(star);
            rate.classList.add('rate');

            const ratingCount = document.createElement('span');
            ratingCount.textContent = `   ${data.rating.count} ratings`;
            rate.appendChild(ratingCount);

            rightDiv.appendChild(rate);


            const des = document.createElement('p');
            des.classList.add('card-description');
            des.innerText = data.description;
            rightDiv.appendChild(des);

            const price = document.createElement('p');
            price.innerHTML = ` $${data.price}`;
            price.classList.add('card-price');
            rightDiv.appendChild(price);

            // const cart = document.createElement('button');
            // cart.textContent = 'Add to Cart';
            // cart.style.width = '10vw';
            // cart.style.height = '3vw';
            // cart.style.backgroundColor = "yellow";
            // cart.style.fontWeight = 'bolder';
            // cart.style.border = 'none';
            // rightDiv.appendChild(cart);
            // var cartItems = localStorage.getItem('cart') || [];
            // if (!Array.isArray(cartItems)) {
            //     cartItems = [];
            // }
            // cart.addEventListener('click', () => {

            //     console.log(cartItems);
            //     cartItems.push(data.id);
            //     localStorage.setItem('cart', cartItems);
            //     cart.textContent = 'Added';
            //     cart.style.backgroundColor = "green";
            //     cart.style.color = "white";
            // })

            proDetails.appendChild(rightDiv);

        }
        getProductDetails(productId);
    });

}


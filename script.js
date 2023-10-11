console.log(window.location.pathname);

if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
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

    var cartItems = JSON.parse(localStorage.getItem('cart')) || []

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
            // cart.textContent = 'Add to Cart';
            cart.style.width = '10vw';
            cart.style.height = '3vw';
            // cart.style.backgroundColor = "yellow";
            cart.style.fontWeight = 'bolder';
            cart.style.border = 'none';
            function setCartButtonState() {
                const itemCount = cartItems.reduce((count, itemId) => {
                    return count + (itemId === product.id ? 1 : 0);
                }, 0);
                if (itemCount > 0) {
                    cart.textContent = `Added (${itemCount})`;
                    cart.style.backgroundColor = "green";
                    cart.style.color = "white";
                } else {
                    cart.textContent = 'Add to Cart';
                    cart.style.backgroundColor = "yellow";
                    cart.style.color = "black";
                }
            }
            setCartButtonState();
            container.appendChild(cart);
            cart.addEventListener('click', () => {
                event.stopPropagation();
                console.log(product.id);
                cartItems.push(product.id);
                localStorage.setItem('cart', JSON.stringify(cartItems));
                cart.textContent = 'Added';
                cart.style.backgroundColor = "green";
                cart.style.color = "white";
                setCartButtonState();
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
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length > 0) {
        let total = 0;
        const summary = {};

        for (let i = 0; i < cartItems.length; i++) {
            const id = cartItems[i];
            if (summary[id]) {
                summary[id].quantity++;
            } else {
                summary[id] = {
                    product: null,
                    quantity: 1,
                };
            }
        }

        const itemKeys = Object.keys(summary);
        const promises = itemKeys.map((key) => {
            return fetch(`https://fakestoreapi.com/products/${key}`)
                .then((response) => response.json())
                .then((data) => {
                    summary[key].product = data;
                    total += summary[key].quantity * data.price;
                });
        });

        Promise.all(promises).then(() => {
            itemKeys.forEach((key) => {
                const pdiv = document.createElement('div');
                pdiv.classList.add('cartItem');
                pdiv.style.display = 'flex';
                pdiv.style.justifyContent = 'space-between';
                pdiv.style.alignItems = 'center';

                const product = summary[key].product;
                const quantity = summary[key].quantity;
                const price = product.price;
                const itemTotal = quantity * price;

                const td = document.createElement('img');
                td.src = product.image;
                td.style.width = '80px';
                td.style.height = '80px';

                const tdiv = document.createElement('div');
                tdiv.style.width = '70%';

                const tt = document.createElement('h3');
                tt.textContent = product.title;

                const des = document.createElement('p');
                des.textContent = product.description;

                const quantityLabel = document.createElement('span');
                quantityLabel.style.marginRight = '10px';
                quantityLabel.textContent = 'Quantity: ' + quantity;

                const minusButton = document.createElement('button');
                minusButton.style.marginRight = '10px';
                minusButton.textContent = '-';
                minusButton.addEventListener('click', () => {
                    var cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                    const index = cartItems.indexOf((product.id));
                    cartItems.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cartItems));
                    location.reload();
                });

                const plusButton = document.createElement('button');
                plusButton.textContent = '+';
                plusButton.addEventListener('click', () => {
                    var cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                    cartItems.push(product.id);
                    localStorage.setItem('cart', JSON.stringify(cartItems));
                    location.reload();
                });

                const pr = document.createElement('p');
                pr.textContent = 'Price: $' + price.toFixed(2);

                const itemTotalLabel = document.createElement('p');
                itemTotalLabel.textContent = 'Total: $' + itemTotal.toFixed(2);

                const b = document.createElement('button');
                b.innerText = 'Remove Item';
                b.addEventListener('click', () => {

                    var cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                    var index = cartItems.indexOf((product.id));
                    while (index != -1) {
                        cartItems.splice(index, 1);
                        index = cartItems.indexOf((product.id));
                    }
                    localStorage.setItem('cart', JSON.stringify(cartItems));
                    location.reload();

                });

                tt.style.marginBottom = '10px';
                tdiv.appendChild(tt);
                tdiv.appendChild(des);
                tdiv.appendChild(quantityLabel);
                tdiv.appendChild(minusButton);
                tdiv.appendChild(plusButton);
                tdiv.appendChild(pr);
                tdiv.appendChild(itemTotalLabel);
                tdiv.appendChild(b);

                pdiv.appendChild(td);
                pdiv.appendChild(tdiv);
                pdiv.style.width = '70%';
                pdiv.style.margin = 'auto';
                pdiv.style.border = '0.5px solid gray';
                pdiv.style.marginBottom = '20px';

                temp.appendChild(pdiv);
            });

            const totalLabel = document.querySelector('#num');
            totalLabel.textContent = " $" + total.toFixed(2);

        });
        Promise.all(promises).then(() => {
            const total = document.querySelector('#num');
            localStorage.setItem('cart-total', total.textContent);
          });
    }
    function updateCartItems(cartItems, summary) {
        const newCartItems = [];
        cartItems.forEach((key) => {
            for (let i = 0; i < summary[key].quantity; i++) {
                newCartItems.push(key);
            }
        });
        localStorage.setItem('cart', JSON.stringify(newCartItems));
    }
}



if (window.location.pathname === '/payment.html') {
    const proceed = document.querySelector('#proceed');
    const total=document.querySelector("#payment-total");
    const temp=document.createElement('h1');
        temp.textContent="Total Payble amount:- "+localStorage.getItem('cart-total');;
        total.appendChild(temp);
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

            const cart = document.createElement('button');
            cart.textContent = 'Add to Cart';
            cart.style.width = '10vw';
            cart.style.height = '3vw';
            cart.style.backgroundColor = "yellow";
            cart.style.fontWeight = 'bolder';
            cart.style.border = 'none';
            rightDiv.appendChild(cart);
            var cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            function setCartButtonState() {
                const itemCount = cartItems.reduce((count, itemId) => {
                    return count + (itemId === data.id ? 1 : 0);
                }, 0);
                if (itemCount > 0) {
                    cart.textContent = `Added (${itemCount})`;
                    cart.style.backgroundColor = "green";
                    cart.style.color = "white";
                } else {
                    cart.textContent = 'Add to Cart';
                    cart.style.backgroundColor = "yellow";
                    cart.style.color = "black";
                }
            }
            setCartButtonState();
            cart.addEventListener('click', () => {

                console.log(cartItems);
                cartItems.push(data.id);
                localStorage.setItem('cart', JSON.stringify(cartItems));
                cart.textContent = 'Added';
                cart.style.backgroundColor = "green";
                cart.style.color = "white";
                setCartButtonState();
            })

            proDetails.appendChild(rightDiv);

        }
        getProductDetails(productId);
    });

}


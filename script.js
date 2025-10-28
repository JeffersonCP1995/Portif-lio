let cart = [];

// Selectors
const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart-panel");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");
const addCartBtns = document.querySelectorAll(".add-cart"); // Corrigido aqui
const searchInput = document.querySelector('header input[type="text"]');
const productGrid = document.querySelector(".grid");

// Modal de Login
const loginLink = document.getElementById("login-link"); // Corrigido aqui
const loginModal = document.getElementById("login-modal");
const closeModalBtn = document.querySelector("#login-modal .close-modal");
const forgotPasswordLink = document.getElementById("forgot-password-link");

// Modal de Cadastro
const registerLink = document.getElementById("register-link");
const registerModal = document.getElementById("register-modal");
const loginFromRegisterLink = document.getElementById("login-from-register");
const registerForm = document.getElementById("register-form");
const closeRegisterModalBtn = document.querySelector("#register-modal .close-modal");

// Modal de Recuperação de Senha
const forgotPasswordModal = document.getElementById("forgot-password-modal");
const loginFromForgotLink = document.getElementById("login-from-forgot");
const forgotPasswordForm = document.getElementById("forgot-password-form");
const closeForgotModalBtn = document.querySelector("#forgot-password-modal .close-modal");

// Carrossel de Banner
const bannerSlides = document.querySelector(".banner-slides");
const bannerImages = document.querySelectorAll(".banner-slides img");
const bannerPrevBtn = document.querySelector(".banner-prev");
const bannerNextBtn = document.querySelector(".banner-next");
const bannerDotsContainer = document.querySelector(".banner-dots");
const bannerDots = document.querySelectorAll(".banner-dots .dot");

let currentSlide = 0;
const totalSlides = bannerImages.length;

function showSlide(index) {
    // Esconde todas as imagens
    bannerImages.forEach(img => img.classList.remove("active"));
    // Remove a classe 'active' de todos os pontos
    bannerDots.forEach(dot => dot.classList.remove("active"));

    // Mostra a imagem atual
    bannerImages[index].classList.add("active");
    // Adiciona a classe 'active' ao ponto correspondente
    bannerDots[index].classList.add("active");
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Event Listeners para os botões de navegação
bannerNextBtn.addEventListener("click", nextSlide);
bannerPrevBtn.addEventListener("click", prevSlide);

// Event Listeners para os pontos de navegação
bannerDots.forEach(dot => {
    dot.addEventListener("click", (e) => {
        const slideIndex = parseInt(e.target.dataset.slide);
        currentSlide = slideIndex;
        showSlide(currentSlide);
    });
});

// Inicializa o carrossel mostrando o primeiro slide
showSlide(currentSlide);

// Opcional: Auto-play do carrossel
let autoPlayInterval = setInterval(nextSlide, 2000);

const bannerSection = document.querySelector(".banner");
bannerSection.addEventListener("mouseenter", () => {
    clearInterval(autoPlayInterval);
});

bannerSection.addEventListener("mouseleave", () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
});

// Search functionality
searchInput.addEventListener("keyup", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const allProducts = document.querySelectorAll(".produto");

    allProducts.forEach(product => {
        const productName = product.dataset.nome.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
});

// Open/close cart
cartBtn.addEventListener("click", () => {
    cartPanel.classList.add("open");
});

closeCartBtn.addEventListener("click", () => {
    cartPanel.classList.remove("open");
});

// Add item to cart
addCartBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const product = e.target.closest(".produto");
        const name = product.dataset.nome;
        const price = parseFloat(product.dataset.preco);

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.qtd++;
        } else {
            cart.push({ name, price, qtd: 1 });
        }
        updateCart();
    });
});

// Update cart
function updateCart() {
    cartItemsEl.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qtd;
        count += item.qtd;

        const li = document.createElement("li");
        li.classList.add("cart-item");
        li.innerHTML = `
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus" data-index="${index}">-</button>
                <span class="quantity-value">${item.qtd}</span>
                <button class="quantity-btn plus" data-index="${index}">+</button>
            </div>
            <span class="cart-item-price">R$ ${(item.price * item.qtd).toFixed(2)}</span>
            <button class="remove-item" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
        `;
        cartItemsEl.appendChild(li);
    });

    cartTotalEl.textContent = total.toFixed(2);
    cartCountEl.textContent = count;

    // Add event listeners for quantity and remove buttons
    document.querySelectorAll(".quantity-btn.plus").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            cart[index].qtd++;
            updateCart();
        });
    });

    document.querySelectorAll(".quantity-btn.minus").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            if (cart[index].qtd > 1) {
                cart[index].qtd--;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        });
    });

    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.closest(".remove-item").dataset.index;
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// Checkout
document.getElementById("checkout").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    alert("Compra finalizada com sucesso!");
    cart = [];
    updateCart();
    cartPanel.classList.remove("open");
});

// Controles do Modal de Login
loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.add("active");
});

closeModalBtn.addEventListener("click", () => {
    loginModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
        e.target.classList.remove("active");
    }
});

// Controles do Modal de Cadastro
registerLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.remove("active"); // Esconde o modal de login
    registerModal.classList.add("active"); // Exibe o modal de cadastro
});

loginFromRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerModal.classList.remove("active"); // Esconde o modal de cadastro
    loginModal.classList.add("active"); // Exibe o modal de login
});

closeRegisterModalBtn.addEventListener("click", () => {
    registerModal.classList.remove("active");
});

// Controles do Modal de Recuperação de Senha
forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.remove("active");
    forgotPasswordModal.classList.add("active");
});

loginFromForgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    forgotPasswordModal.classList.remove("active");
    loginModal.classList.add("active");
});

closeForgotModalBtn.addEventListener("click", () => {
    forgotPasswordModal.classList.remove("active");
});

forgotPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("forgot-email-cpf").value;
    if (input) {
        alert("Instruções de recuperação de senha enviadas para o e-mail ou CPF informado.");
        forgotPasswordModal.classList.remove("active");
    } else {
        alert("Por favor, preencha o campo.");
    }
});

// Funções de Validação de Cadastro
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (cpf.length !== 11) {
        return false;
    }
    return true; // Validação simplificada para fins de demonstração
}

function validateDOB(dob) {
    const today = new Date();
    const dobDate = new Date(dob);
    return dobDate <= today;
}

function validatePassword(password) {
    return password.length >= 6;
}

// Evento de envio do formulário de cadastro
registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    const name = document.getElementById('reg-name').value;
    const cpf = document.getElementById('reg-cpf').value;
    const dob = document.getElementById('reg-dob').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const zip = document.getElementById('reg-zip').value;
    const street = document.getElementById('reg-street').value;
    const number = document.getElementById('reg-number').value;
    const state = document.getElementById('reg-state').value;
    const city = document.getElementById('reg-city').value;
    const password = document.getElementById('reg-password').value;

    if (!validateCPF(cpf)) {
        alert('Por favor, insira um CPF válido com 11 dígitos.');
        return;
    }

    if (!validateDOB(dob)) {
        alert('A data de nascimento não pode ser no futuro.');
        return;
    }

    if (!validatePassword(password)) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    // Se todas as validações passarem
    alert('Cadastro realizado com sucesso!');
    registerModal.classList.remove('active'); // Fecha o modal após o cadastro
    // Aqui você pode adicionar a lógica para enviar os dados para o servidor
});
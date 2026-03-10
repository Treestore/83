/* ================= 1. AUTOCOMPLETE TÌM KIẾM ================= */
const searchInput = document.getElementById("search-input");
const searchSuggestions = document.getElementById("search-suggestions");

const productDatabase = [
    { name: "Asus Vivobook 15 (Mới 100%)", image: "1.webp", price: "12.590.000 đ" },
    { name: "Lenovo Thinkpad T490 (Cũ Đẹp)", image: "2.jpg", price: "7.200.000 đ" },
    { name: "Macbook Air M1 2020", image: "3.jpg", price: "17.800.000 đ" },
    { name: "Dell Gaming G15 5515", image: "3.webp", price: "16.500.000 đ" },
    { name: "HP Pavilion 15 (Đẹp Keng)", image: "2.jpg", price: "14.000.000 đ" },
    { name: "Acer Nitro 5 Tiger", image: "4.webp", price: "19.900.000 đ" }
];

searchInput.addEventListener("input", function() {
    const keyword = this.value.toLowerCase().trim();
    searchSuggestions.innerHTML = ""; 
    
    if (keyword.length > 0) {
        const filteredProducts = productDatabase.filter(product => product.name.toLowerCase().includes(keyword));

        if (filteredProducts.length > 0) {
            searchSuggestions.style.display = "block"; 
            filteredProducts.forEach(product => {
                const li = document.createElement("li");
                li.innerHTML = `<img src="${product.image}" alt=""><div class="suggest-info"><span class="suggest-name">${product.name}</span><span class="suggest-price">${product.price}</span></div>`;
                li.addEventListener("click", function() {
                    searchInput.value = product.name; 
                    searchSuggestions.style.display = "none"; 
                });
                searchSuggestions.appendChild(li);
            });
        } else {
            searchSuggestions.style.display = "block";
            searchSuggestions.innerHTML = `<li style="justify-content:center; color:#888;">Không tìm thấy máy "${keyword}"</li>`;
        }
    } else { searchSuggestions.style.display = "none"; }
});

document.addEventListener("click", function(e) {
    if (e.target !== searchInput && e.target !== searchSuggestions) { searchSuggestions.style.display = "none"; }
});

/* ================= 2. BANNER SLIDER ================= */
const mainBannerImg = document.getElementById("main-banner-img");
document.querySelectorAll(".thumb").forEach(thumb => {
    thumb.addEventListener("click", function() {
        document.querySelector(".thumb.active").classList.remove("active");
        this.classList.add("active");
        mainBannerImg.src = this.getAttribute("data-image");
    });
});

/* ================= 3. LỌC DANH MỤC (MENU TRÁI) ================= */
const allProducts = document.querySelectorAll(".product-item");
document.querySelectorAll(".cat-link").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault(); 
        const targetCategory = this.getAttribute("data-category");
        document.querySelectorAll(".brand-item").forEach(b => b.classList.remove("active"));
        
        allProducts.forEach(product => {
            if (targetCategory === "all" || product.getAttribute("data-category") === targetCategory) {
                product.style.display = "flex"; 
            } else { product.style.display = "none"; }
        });
    });
});

/* ================= 4. LỌC THƯƠNG HIỆU ================= */
const brandItems = document.querySelectorAll(".brand-item");
brandItems.forEach(brand => {
    brand.addEventListener("click", function() {
        const isActive = this.classList.contains("active");
        brandItems.forEach(b => b.classList.remove("active"));
        
        if (!isActive) {
            this.classList.add("active");
            const targetBrand = this.getAttribute("data-brand-target");
            allProducts.forEach(product => {
                if (product.getAttribute("data-brand") === targetBrand) {
                    product.style.display = "flex"; 
                } else { product.style.display = "none"; }
            });
        } else {
            allProducts.forEach(product => product.style.display = "flex");
        }
    });
});

/* ================= 5. LỌC THEO GIÁ ================= */
const sortSelect = document.getElementById("sort-price");
const productGrid = document.getElementById("product-grid");

sortSelect.addEventListener("change", function() {
    const sortType = this.value;
    let productsArray = Array.from(productGrid.querySelectorAll(".product-item"));

    if (sortType === "asc") { productsArray.sort((a, b) => parseInt(a.getAttribute("data-price")) - parseInt(b.getAttribute("data-price"))); } 
    else if (sortType === "desc") { productsArray.sort((a, b) => parseInt(b.getAttribute("data-price")) - parseInt(a.getAttribute("data-price"))); } 
    else { productsArray.sort((a, b) => parseInt(a.getAttribute("data-order")) - parseInt(b.getAttribute("data-order"))); }

    productsArray.forEach(product => productGrid.appendChild(product));
});

/* ================= 6. HỆ THỐNG GIỎ HÀNG VÀ ĐẶT HÀNG THÔNG MINH ================= */
const productModal = document.getElementById("productModal");
const closeProductModalBtn = productModal.querySelector(".close-btn");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalDesc = document.getElementById("modal-desc");

// Mở cửa sổ xem chi tiết máy
document.querySelectorAll(".open-modal-trigger").forEach(trigger => {
    trigger.addEventListener("click", function(e) {
        e.preventDefault();
        const productCard = this.closest(".product-item");
        modalImg.src = productCard.querySelector("img").src;
        modalTitle.innerText = productCard.querySelector("h3").innerText;
        modalPrice.innerText = productCard.querySelector(".price").innerText;
        modalDesc.innerHTML = "<strong>Thông số chi tiết:</strong><br><br>" + productCard.querySelector(".specs").innerHTML;
        productModal.style.display = "flex";
    });
});
closeProductModalBtn.onclick = function() { productModal.style.display = "none"; }

// KHAI BÁO MẢNG LƯU TRỮ GIỎ HÀNG
let cartArray = [];

// Khi bấm Thêm vào Giỏ hàng
document.getElementById("confirm-add-cart").addEventListener("click", function() {
    const item = {
        name: modalTitle.innerText,
        price: modalPrice.innerText,
        image: modalImg.src
    };
    cartArray.push(item); 
    document.getElementById("cart-count").innerText = "(" + cartArray.length + ")";
    
    // Popup thông báo nhỏ thêm thành công
    alert("Thêm vào giỏ hàng thành công!");
    productModal.style.display = "none"; 
});

// Xử lý Cửa sổ Giỏ hàng
const cartModal = document.getElementById("cartModal");
const openCartBtn = document.getElementById("open-cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

openCartBtn.addEventListener("click", function() {
    renderCart(); 
    cartModal.style.display = "flex";
});

function renderCart() {
    cartItemsContainer.innerHTML = ""; 
    let totalPrice = 0;

    if (cartArray.length === 0) {
        cartItemsContainer.innerHTML = "<p style='text-align:center; color:#888; margin-top: 20px;'>Giỏ hàng đang trống. Hãy chọn mua máy nhé!</p>";
    } else {
        cartArray.forEach((item, index) => {
            const priceNumber = parseInt(item.price.replace(/\D/g, ""));
            totalPrice += priceNumber;

            const div = document.createElement("div");
            div.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px dashed #eee;";
            div.innerHTML = `
                <div style="display:flex; align-items:center; flex:1;">
                    <img src="${item.image}" style="width: 60px; height: 60px; object-fit: contain; border: 1px solid #ccc; border-radius: 5px; margin-right: 15px;">
                    <div>
                        <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 5px;">${item.name}</div>
                        <div style="font-size: 14px; font-weight: bold; color: var(--price-red);">${item.price}</div>
                    </div>
                </div>
                <i class="fas fa-trash" onclick="removeFromCart(${index})" style="color: #ff4757; cursor: pointer; font-size: 18px; padding: 10px;" title="Xóa"></i>
            `;
            cartItemsContainer.appendChild(div);
        });
    }
    cartTotalEl.innerText = totalPrice.toLocaleString('vi-VN') + " đ";
}

window.removeFromCart = function(index) {
    cartArray.splice(index, 1); 
    document.getElementById("cart-count").innerText = "(" + cartArray.length + ")";
    renderCart(); 
}

// Xử lý Cửa sổ Đặt hàng và Thành Công
const checkoutModal = document.getElementById("checkoutModal");
const successModal = document.getElementById("successModal"); 

document.getElementById("btn-checkout-now").addEventListener("click", function() {
    if (cartArray.length === 0) {
        alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng!");
        return;
    }
    cartModal.style.display = "none"; 
    checkoutModal.style.display = "flex"; 
});

document.getElementById("btn-confirm-order").addEventListener("click", function() {
    const name = document.getElementById("cust-name").value;
    const phone = document.getElementById("cust-phone").value;
    const address = document.getElementById("cust-address").value;

    if (!name || !phone || !address) {
        alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ!");
        return;
    }

    // Tạo lời chúc mừng có hồn, in đậm tên và số tiền
    const successMsg = document.getElementById("success-message");
    successMsg.innerHTML = `Cảm ơn <strong>${name.toUpperCase()}</strong> đã tin tưởng mua sắm.<br><br>Chúng tôi sẽ gọi xác nhận qua số <strong>${phone}</strong> để giao hàng tới địa chỉ <strong>${address}</strong>.<br><br>Tổng thanh toán: <span style="color:var(--price-red); font-weight:bold; font-size: 18px;">${cartTotalEl.innerText}</span>`;

    // Ẩn cửa sổ thông tin, Hiện cửa sổ Thành công
    checkoutModal.style.display = "none";
    successModal.style.display = "flex";

    // Reset giỏ hàng
    cartArray = [];
    document.getElementById("cart-count").innerText = "(0)";
    document.getElementById("cust-name").value = "";
    document.getElementById("cust-phone").value = "";
    document.getElementById("cust-address").value = "";
});

// Các nút Đóng cửa sổ
document.getElementById("close-cart-btn").onclick = () => cartModal.style.display = "none";
document.getElementById("close-checkout-btn").onclick = () => checkoutModal.style.display = "none";
document.getElementById("btn-continue-shopping").onclick = () => successModal.style.display = "none";

window.addEventListener("click", function(e) {
    if (e.target == productModal) productModal.style.display = "none";
    if (e.target == cartModal) cartModal.style.display = "none";
    if (e.target == checkoutModal) checkoutModal.style.display = "none";
    if (e.target == successModal) successModal.style.display = "none";
});/* ================= 7. THÔNG BÁO MUA HÀNG ẢO (FOMO NOTIFICATION) ================= */
const fakeSalePopup = document.getElementById("fake-sale-popup");
const closeFakeSaleBtn = document.getElementById("close-fake-sale");
const fakeSaleImg = document.getElementById("fake-sale-img");
const fakeSaleName = document.getElementById("fake-sale-name");
const fakeSaleProduct = document.getElementById("fake-sale-product");
const fakeSaleTime = document.getElementById("fake-sale-time");

// 1. Tạo kho dữ liệu khách hàng "ảo"
const fakeNames = ["Anh Tuấn", "Chị Lan", "Anh Dũng", "Khách hàng ẩn danh", "Anh Hoàng", "Chị Mai", "Anh Nam", "Chị Thảo", "Anh Cường", "Chị Ngọc"];
const fakeLocations = ["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Bình Dương", "Nghệ An", "Đồng Nai"];
const fakeTimes = ["Vừa xong", "1 phút trước", "2 phút trước", "Vài giây trước"];

function showFakeSale() {
    // Lấy ngẫu nhiên Tên, Địa điểm, Thời gian
    const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const randomLocation = fakeLocations[Math.floor(Math.random() * fakeLocations.length)];
    const randomTime = fakeTimes[Math.floor(Math.random() * fakeTimes.length)];
    
    // Lấy ngẫu nhiên 1 máy tính từ thư viện productDatabase (Đã khai báo ở tuốt trên cùng phần Tìm kiếm)
    const randomProduct = productDatabase[Math.floor(Math.random() * productDatabase.length)];

    // Bơm dữ liệu vào khung HTML
    fakeSaleImg.src = randomProduct.image;
    fakeSaleName.innerHTML = `<strong>${randomName}</strong> (${randomLocation})`;
    fakeSaleProduct.innerText = randomProduct.name;
    fakeSaleTime.innerText = randomTime;

    // Trượt bảng thông báo vào màn hình
    fakeSalePopup.classList.add("show");

    // Cho nó tự động biến mất sau 5 giây (5000ms)
    setTimeout(() => {
        fakeSalePopup.classList.remove("show");
    }, 5000);
}

// Tắt thông báo nếu khách chủ động bấm dấu X
closeFakeSaleBtn.addEventListener("click", () => {
    fakeSalePopup.classList.remove("show");
});

// 2. Chức năng hẹn giờ lặp lại (Random từ 8 giây đến 15 giây hiện 1 lần)
function scheduleNextFakeSale() {
    const randomDelay = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
    setTimeout(() => {
        showFakeSale();
        scheduleNextFakeSale(); // Gọi lại chính nó để tạo vòng lặp vô tận
    }, randomDelay);
}

// Khởi động phát súng đầu tiên: Hiện thông báo ngay sau khi khách vào web 3 giây
setTimeout(scheduleNextFakeSale, 3000);
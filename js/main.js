// 1. DỮ LIỆU SẢN PHẨM MẪU (Đã đồng bộ ảnh và danh mục)
const products = [
  {
    id: 1,
    name: "Cà phê Buôn Ma Thuột",
    category: "ca-phe",
    price: 250000,
    origin: "Đắk Lắk",
    stock: 20,
    image: "../images/ca-phe-buon-ma-thuot.jpg",
  },
  {
    id: 2,
    name: "Mật ong rừng Tây Nguyên",
    category: "mat-ong",
    price: 350000,
    origin: "Gia Lai",
    stock: 15,
    image: "../images/mat-ong-rung-tay-nguyen.jpg",
  },
  {
    id: 3,
    name: "Mắc ca Tây Nguyên",
    category: "hat",
    price: 280000,
    origin: "Lâm Đồng",
    stock: 50,
    image: "../images/mac-ca-tay-nguyen.jpg",
  },
  {
    id: 4,
    name: "Tiêu Đắk Nông",
    category: "gia-vi",
    price: 150000,
    origin: "Đắk Nông",
    stock: 100,
    image: "../images/tieu-dak-nong.jpg",
  },
  {
    id: 5,
    name: "Bơ sáp Đắk Lắk",
    category: "trai-cay",
    price: 80000,
    origin: "Đắk Lắk",
    stock: 30,
    image: "../images/bo-sap-dak-lak.jpg",
  },
  {
    id: 6,
    name: "Thổ cẩm Tây Nguyên",
    category: "khac",
    price: 450000,
    origin: "Kon Tum",
    stock: 10,
    image: "../images/tho-cam-tay-nguyen.jpg",
  },
];

// 2. Hiển thị danh sách sản phẩm bằng DOM
const productList = document.querySelector("#product-list");

function renderProducts(items) {
  if (!productList) return;

  if (items.length === 0) {
    productList.innerHTML = "<p>Không có sản phẩm phù hợp.</p>";
    return;
  }

  productList.innerHTML = items
    .map(
      (product) => `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Danh mục: ${product.category}</p>
            <p>Xuất xứ: ${product.origin}</p>
            <p>Tình trạng: ${product.stock > 0 ? "Còn hàng" : "Hết hàng"}</p>
            <p>Giá: ${product.price.toLocaleString("vi-VN")} đ</p>
            <button data-id="${product.id}">Thêm vào giỏ hàng</button>
        </article>
    `,
    )
    .join("");
}

renderProducts(products); // Gọi hàm hiển thị mặc định

// 3. Tìm kiếm sản phẩm & 4. Lọc sản phẩm theo danh mục (Kết hợp)
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");

function filterAndSearchProducts() {
  const keyword = searchInput ? searchInput.value.toLowerCase() : "";
  const category = categoryFilter ? categoryFilter.value : "all";

  const result = products.filter((product) => {
    const matchName = product.name.toLowerCase().includes(keyword);
    const matchCategory = category === "all" || product.category === category;
    return matchName && matchCategory;
  });

  renderProducts(result);
}

if (searchInput) searchInput.addEventListener("input", filterAndSearchProducts);
if (categoryFilter)
  categoryFilter.addEventListener("change", filterAndSearchProducts);

// 5. Thêm sản phẩm vào giỏ hàng
let cart = JSON.parse(localStorage.getItem("myCart")) || [];

function updateCartCount() {
  // Tìm tất cả các chỗ hiển thị giỏ hàng trên trang và cập nhật
  const cartCountElements = document.querySelectorAll("#cart-count");
  cartCountElements.forEach((el) => {
    el.textContent = cart.length;
  });
}

// Chạy lần đầu khi load trang
updateCartCount();

// Bắt sự kiện click trên toàn bộ thẻ body
document.body.addEventListener("click", function (event) {
  // Kiểm tra xem cái bạn vừa click có class là "btn-add-cart" không
  if (event.target.classList.contains("btn-add-cart")) {
    // Lấy ID sản phẩm từ data-id của nút
    const productId = Number(event.target.dataset.id);
    const product = products.find((item) => item.id === productId);

    if (product) {
      cart.push(product);
      // Lưu vào bộ nhớ cục bộ
      localStorage.setItem("myCart", JSON.stringify(cart));
      updateCartCount();
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
  }
});

// 6 & 7. Xây dựng form đặt hàng và Validation client
const orderForm = document.querySelector("#order-form");

if (orderForm) {
  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const customerName = document.querySelector("#customer-name").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const address = document.querySelector("#address").value.trim();

    if (customerName.length < 3) {
      alert("Họ tên phải có ít nhất 3 ký tự.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Số điện thoại phải gồm 10 chữ số.");
      return;
    }

    if (address.length < 10) {
      alert("Địa chỉ phải có ít nhất 10 ký tự.");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng chưa có sản phẩm.");
      return;
    }

    alert("Đơn hàng đã được ghi nhận.");

    orderForm.reset();
    cart = [];
    updateCartCount();
  });
}

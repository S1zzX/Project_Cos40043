<template>
  <footer class="site-footer">
    <div class="container">
      <div class="row g-4 mb-4">
        <div class="col-12 col-md-4">
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-bag-heart-fill text-brand fs-5"></i>
            <span class="fw-bold" style="font-family:'Plus Jakarta Sans',sans-serif;color:var(--brand);font-size:1.15rem;">S1zz</span>
          </div>
          <p class="small mb-0" style="color:var(--text-muted);line-height:1.6;">
            Your premium destination for fashion, electronics, jewellery, and more. Quality products, delivered fast.
          </p>
        </div>
        <div class="col-6 col-md-2">
          <p class="fw-bold small mb-3" style="color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;font-size:0.72rem;">Shop</p>
          <ul class="list-unstyled">
            <li class="mb-2"><RouterLink to="/products" class="footer-link">All Products</RouterLink></li>
            <li class="mb-2"><RouterLink to="/wishlist" class="footer-link">Wishlist</RouterLink></li>
            <li class="mb-2"><RouterLink to="/cart" class="footer-link">Cart</RouterLink></li>
          </ul>
        </div>
        <div class="col-6 col-md-2">
          <p class="fw-bold small mb-3" style="color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;font-size:0.72rem;">Info</p>
          <ul class="list-unstyled">
            <li class="mb-2"><RouterLink to="/news" class="footer-link">News</RouterLink></li>
            <li class="mb-2"><RouterLink to="/about" class="footer-link">About</RouterLink></li>
          </ul>
        </div>
        <div class="col-6 col-md-2">
          <p class="fw-bold small mb-3" style="color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;font-size:0.72rem;">Account</p>
          <ul class="list-unstyled">
            <li class="mb-2"><RouterLink to="/login" class="footer-link">Login</RouterLink></li>
            <li class="mb-2"><RouterLink to="/register" class="footer-link">Register</RouterLink></li>
          </ul>
        </div>
      </div>
      <hr style="border-color:var(--border)">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <p class="small mb-0" style="color:var(--text-muted)">© 2026 S1zz Store · Built with Vue.js 3 & Bootstrap 5</p>
        <p class="small mb-0" style="color:var(--text-muted)">COS30043 — Interface Design & Development</p>
      </div>
    </div>
  </footer>
</template>

import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API, { BASE_IMAGE_URL } from "../axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

const H1 = 48;
const H2_FULL = 56;
const H2_MIN = 44;

const fadePop = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
  transition: { duration: 0.18 }
};

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems = [], cartCount = 0, removeFromCart } = useCart();

  const [keyword, setKeyword] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [categories, setCategories] = useState([]);

  // Realtime search (client-side)
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [openSuggest, setOpenSuggest] = useState(false);

  const cartBoxRef = useRef(null);
  const categoryRef = useRef(null);
  const accountRef = useRef(null);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (cartBoxRef.current && !cartBoxRef.current.contains(e.target)) setOpenCart(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setIsCategoryOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setIsAccountOpen(false);
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setOpenSuggest(false);
    };
    const onScroll = () => setScrollY(window.scrollY);

    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    API.get("/categories").then(r => setCategories(r.data || [])).catch(() => {});
    API.get("/products").then(r => setAllProducts(Array.isArray(r.data) ? r.data : [])).catch(() => setAllProducts([]));

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) { setSuggestions([]); setOpenSuggest(false); return; }
    const list = allProducts
      .filter(p => (p.name || "").toLowerCase().includes(q))
      .slice(0, 8);
    setSuggestions(list);
    setOpenSuggest(list.length > 0);
  }, [keyword, allProducts]);

  const scrolled = scrollY > 4;
  const shrinkProgress = Math.min(scrollY / 150, 1);
  const header2Height = H2_FULL - (H2_FULL - H2_MIN) * shrinkProgress;
  const logoScale = 1 - 0.15 * shrinkProgress;
  const iconSize = 56 - 12 * shrinkProgress;

  const onSearch = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/collections?q=${encodeURIComponent(q)}` : "/collections");
    setOpenSuggest(false);
  };

  const isAdminOrStaff = user?.role === "admin" || user?.role === "staff";

  return (
    <>
      {/* Header 1 */}
      <div
        className={`w-full bg-green-900 text-white transition-all duration-200 ${scrolled ? "opacity-0 h-0" : "opacity-100 h-12"}`}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 1000 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="h-full flex items-center gap-6 text-sm">
            <NavLink to="/" className="hover:text-yellow-300">Trang chủ</NavLink>
            <NavLink to="/collections" className="hover:text-yellow-300">Sản phẩm</NavLink>

            {/* Thể loại */}
            <div
              className="relative"
              ref={categoryRef}
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className="hover:text-yellow-300">Thể loại ▾</button>
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    {...fadePop}
                    className="absolute top-full mt-1 bg-white text-green-900 rounded shadow z-[1100] min-w-[160px]"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat, idx) => (
                        <Link
                          key={idx}
                          to={`/collections?category=${encodeURIComponent(cat)}`}
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsCategoryOpen(false)}
                        >
                          {cat}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">Không có dữ liệu</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/about" className="hover:text-yellow-300">About Us</NavLink>

            {isAdminOrStaff && (
              <NavLink to={user?.role === "admin" ? "/admin/dashboard" : "/staff/dashboard"} className="hover:text-yellow-300">
                Quản trị
              </NavLink>
            )}

            {/* Account */}
            <div
              className="ml-auto relative"
              ref={accountRef}
              onMouseEnter={() => setIsAccountOpen(true)}
              onMouseLeave={() => setIsAccountOpen(false)}
            >
              {user ? (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsAccountOpen(p => !p)}>
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-green-900 flex items-center justify-center font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline">
                    {user.name} <span className="opacity-80">({user.role})</span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <NavLink to="/login" className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Đăng nhập</NavLink>
                  <NavLink to="/register" className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Đăng ký</NavLink>
                </div>
              )}

              <AnimatePresence>
                {user && isAccountOpen && (
                  <motion.div
                    {...fadePop}
                    className="absolute right-0 mt-1 bg-white text-green-900 rounded-lg shadow-lg w-56 z-[1100]"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <nav className="py-1">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Thông tin tài khoản</Link>
                      <Link to="/orders/my" className="block px-4 py-2 hover:bg-gray-100">Lịch sử đơn hàng</Link>
                      <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Đăng xuất</button>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Header 2 */}
      <div
        className="w-full bg-green-800 shadow-sm"
        style={{ position: "fixed", top: scrolled ? 0 : H1, left: 0, zIndex: 50, height: header2Height, transition: "height 0.2s ease" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 h-full">
          {/* Logo */}
          <Link
            to="/"
            style={{ transform: `scale(${logoScale})`, transformOrigin: "left center", transition: "transform 0.2s ease" }}
            className="font-extrabold tracking-wide flex-shrink-0 text-white"
          >
            <span>Anime</span><span className="text-yellow-300">Shop</span>
          </Link>

          {/* Search + suggestions */}
          <div className="relative flex-1 max-w-[640px] mx-4" ref={searchWrapRef}>
            <motion.form
              onSubmit={onSearch}
              className="h-10 flex items-center bg-white rounded-full overflow-hidden border border-gray-300"
              initial={false}
              animate={{ scale: 1 - 0.1 * shrinkProgress }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: "center" }}
            >
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => suggestions.length && setOpenSuggest(true)}
                placeholder="Tìm kiếm sản phẩm..."
                className="flex-1 px-4 py-2 text-green-900 outline-none text-sm"
              />
              <button type="submit" className="bg-green-900 hover:bg-yellow-700 flex items-center justify-center" style={{ width: iconSize, height: iconSize }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"/>
                </svg>
              </button>
            </motion.form>

            <AnimatePresence>
              {openSuggest && suggestions.length > 0 && (
                <motion.div
                  {...fadePop}
                  className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow mt-1 z-50 max-h-80 overflow-auto"
                >
                  {suggestions.map((p, i) => {
                    const img = p.image || p.images?.[0]?.url || "";
                    const price = p.finalPrice ?? p.price ?? 0;
                    return (
                      <motion.button
                        key={p.id}
                        type="button"
                        onClick={() => { navigate(`/products/${p.id}`); setOpenSuggest(false); setKeyword(""); }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: i * 0.02 }}
                      >
                        <img src={`${BASE_IMAGE_URL}${img}`} alt={p.name} className="w-10 h-10 object-cover rounded border" />
                        <div className="flex-1">
                          <div className="text-sm font-medium line-clamp-1">{p.name}</div>
                          <div className="text-xs text-gray-500">{price.toLocaleString()}đ</div>
                        </div>
                      </motion.button>
                    );
                  })}
                  <div className="border-t">
                    <button
                      type="button"
                      onClick={() => { navigate(`/collections?q=${encodeURIComponent(keyword.trim())}`); setOpenSuggest(false); }}
                      className="w-full px-3 py-2 text-sm text-green-700 hover:bg-green-50"
                    >
                      Xem tất cả kết quả cho “{keyword}”
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <div
            className="relative flex-shrink-0"
            ref={cartBoxRef}
            onMouseEnter={() => setOpenCart(true)}
            onMouseLeave={() => setOpenCart(false)}
          >
            <Link
              to="/cart"
              className="relative flex items-center justify-center bg-green-900 hover:bg-yellow-700 rounded-full"
              style={{ width: iconSize - 8, height: iconSize - 8 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                         0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 
                         14h9.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66.11-1.51-.55-1.88a1.35 
                         1.35 0 0 0-.66-.17H6.21L5.27 2H2v2h2l3.6 
                         7.59-1.35 2.45C5.52 14.37 6.15 15 7 15h12v-2H7.42l.74-1.35z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>

            <AnimatePresence>
              {openCart && (
                <motion.div
                  {...fadePop}
                  className="absolute right-0 mt-1 w-80 bg-white text-green-900 rounded-lg shadow-lg border z-40"
                >
                  <div className="px-4 py-3 border-b font-semibold">Giỏ hàng ({cartCount})</div>
                  {cartItems.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600">Chưa có sản phẩm.</div>
                  ) : (
                    <>
                      <div className="max-h-72 overflow-auto divide-y">
                        {cartItems.map((item) => {
                          const p = item.Product || {};
                          const img = p.images?.[0]?.url || p.image || "";
                          const price = p.finalPrice ?? p.price ?? 0;
                          return (
                            <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                              <img src={`${BASE_IMAGE_URL}${img}`} alt={p.name} className="w-12 h-12 object-cover rounded border cursor-pointer" onClick={() => navigate(`/products/${p.id}`)} />
                              <div className="flex-1">
                                <div className="font-medium line-clamp-1">{p.name}</div>
                                <div className="text-sm text-gray-600">{item.quantity} x {price.toLocaleString()}đ</div>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">
                                Xóa
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="px-4 py-3 border-t flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Tổng:{" "}
                          <span className="font-semibold text-green-800">
                            {cartItems.reduce((s, it) => {
                              const p = it.Product || {};
                              const price = p.finalPrice ?? p.price ?? 0;
                              return s + price * (it.quantity || 0);
                            }, 0).toLocaleString()}đ
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link to="/cart" className="px-3 py-1.5 rounded border border-green-700 text-green-700 hover:bg-green-50 text-sm">Xem giỏ</Link>
                          <Link to="/checkout" className="px-3 py-1.5 rounded bg-green-700 text-white hover:bg-green-800 text-sm">Thanh toán</Link>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: scrolled ? header2Height : H1 + header2Height }} />
    </>
  );
}

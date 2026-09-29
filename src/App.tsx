import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { Layout } from "@/components/layout/Layout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const GamesPage = lazy(() => import("@/pages/GamesPage"));
const GameDetailPage = lazy(() => import("@/pages/GameDetailPage"));
const DealsPage = lazy(() => import("@/pages/DealsPage"));
const PreOrdersPage = lazy(() => import("@/pages/PreOrdersPage"));
const UpcomingPage = lazy(() => import("@/pages/UpcomingPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const NewsPage = lazy(() => import("@/pages/NewsPage"));
const SupportPage = lazy(() => import("@/pages/SupportPage"));
const AccountLayout = lazy(() => import("@/pages/account/AccountLayout"));
const AccountProfile = lazy(() => import("@/pages/account/ProfilePage"));
const OrdersPage = lazy(() => import("@/pages/account/OrdersPage"));
const LibraryPage = lazy(() => import("@/pages/account/LibraryPage"));
const AccountReviews = lazy(() => import("@/pages/account/ReviewsPage"));
const CouponsPage = lazy(() => import("@/pages/account/CouponsPage"));
const AccountSupport = lazy(() => import("@/pages/account/SupportPage"));
const SettingsPage = lazy(() => import("@/pages/account/SettingsPage"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/Products"));
const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
const AdminInventory = lazy(() => import("@/pages/admin/Inventory"));
const AdminCoupons = lazy(() => import("@/pages/admin/Coupons"));
const AdminDeals = lazy(() => import("@/pages/admin/Deals"));
const AdminReviews = lazy(() => import("@/pages/admin/Reviews"));
const AdminSupport = lazy(() => import("@/pages/admin/Support"));
const AdminContent = lazy(() => import("@/pages/admin/Content"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-6">
      <div className="skeleton mb-6 h-10 w-64 rounded-lg" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-72 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <OrdersProvider>
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* ADMIN — separate shell */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="deals" element={<AdminDeals />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="support" element={<AdminSupport />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/games" element={<GamesPage />} />
                  <Route path="/categories" element={<GamesPage />} />
                  <Route path="/category/:genre" element={<GamesPage />} />
                  <Route path="/platform/:platform" element={<GamesPage />} />
                  <Route path="/genre/:genre" element={<GamesPage />} />
                  <Route path="/game/:slug" element={<GameDetailPage />} />
                  <Route path="/deals" element={<DealsPage />} />
                  <Route path="/pre-orders" element={<PreOrdersPage />} />
                  <Route path="/upcoming" element={<UpcomingPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/account" element={<AccountLayout />}>
                    <Route index element={<AccountProfile />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="reviews" element={<AccountReviews />} />
                    <Route path="coupons" element={<CouponsPage />} />
                    <Route path="support" element={<AccountSupport />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                  <Route path="/library" element={<Navigate to="/account/library" replace />} />
                  <Route path="/orders" element={<Navigate to="/account/orders" replace />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </OrdersProvider>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  book_id: number;
  book_title: string;
  unit_price: number;
  quantity: number;
  image_url: string;
}

export default function CartSummary() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getCartByUserId/${user.id}`
        );
        if (!res.ok) throw new Error("No se pudo cargar el carrito");

        const data = await res.json();
        console.log("Carrito:", data);

        if (data.length > 0) {
          const cartId = data[0].cart_id;

          const updatedUser = { ...user, id_cart: cartId };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        setCartItems(data);
      } catch (error) {
        console.error("Error cargando el carrito:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const handleDelete = async (bookId: number) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id_cart) {
      alert("No hay carrito activo.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteBookFromCart`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookId,
            cartId: user.id_cart,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al eliminar");

      setCartItems((prev) => prev.filter((item) => item.book_id !== bookId));

      console.log("Libro eliminado del carrito");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el libro del carrito.");
    }
  };

  const router = useRouter();

  const handleCreatePayment = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) {
      alert("Usuario no identificado");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/createPayment/${user.id}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear el pago");
      }

      // ✅ Si todo va bien, redirige a /shop/upload
      router.push("/shop/upload");
    } catch (error) {
      console.error("Error al crear el pago:", error);
      alert("No se pudo crear el registro del pago.");
    }
  };

  if (loading) return <p className="text-center py-8">Cargando carrito...</p>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gris-oscuro mb-4">Carrito</h2>

      <div className="space-y-4 mb-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.book_id}
              className="flex items-center gap-4 pb-4 border-b border-gris-medio/20"
            >
              <img
                src={item.image_url || "/placeholder.svg"}
                alt={item.book_title}
                className="w-16 h-16 object-contain"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gris-oscuro">
                  {item.book_title}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-dorado-elegante font-semibold">
                    ${item.unit_price}
                  </span>
                  <div className="flex items-center">
                    <span className="w-8 h-6 flex items-center justify-center border-t border-b border-gris-medio/30">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleDelete(item.book_id)}
                      className="ml-2 text-gris-medio hover:text-vino-profundo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gris-medio">
            Tu carrito está vacío.
          </p>
        )}
      </div>

      <div className="space-y-2 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-gris-medio">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gris-medio/20">
          <span className="font-semibold text-gris-oscuro">Total</span>
          <span className="font-bold text-vino-profundo">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={handleCreatePayment}
        className="w-full bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro py-3 rounded-md font-medium transition-colors"
      >
        Seguir con la verificación del pago
      </button>

      <div className="mt-4 text-center text-xs text-gris-medio">
        <p className="mt-1">Secure payment processing</p>
      </div>
    </div>
  );
}

"use client";

import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";


export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg bg-card border-l border-border flex flex-col">
        <SheetHeader className="space-y-2.5">
          <SheetTitle className="font-serif text-2xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              Your cart is empty.<br />
              Start adding some beautiful art!
            </p>
            <Button onClick={() => setIsCartOpen(false)} variant="outline">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.poster.id}-${item.selectedSize.name}`}
                  className="flex gap-4 p-4 bg-secondary/30 rounded-lg"
                >
                <div className="relative h-24 w-20 rounded overflow-hidden flex-shrink-0">
  <Image
    src={item.poster.image}
    alt={item.poster.title}
    fill
    sizes="80px"
    className="object-cover"
  />
</div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-medium text-foreground truncate">
                      {item.poster.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.selectedSize.name} - {item.selectedSize.dimensions}
                    </p>
                    <p className="text-sm font-medium text-primary mt-1">
                      {formatPrice(item.selectedSize.price)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.poster.id,
                              item.selectedSize.name,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.poster.id,
                              item.selectedSize.name,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          removeFromCart(item.poster.id, item.selectedSize.name)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-sm text-muted-foreground">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-medium">Total</span>
                <span className="font-serif text-lg font-medium text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button 
                className="w-full btn-gold h-12 text-base"
                onClick={() => {
                  setIsCartOpen(false);
                  window.location.href = "/checkout";
                }}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

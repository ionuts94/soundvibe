"use client";
import React, { useState } from 'react'
import { Modal } from './Modal';
import { Price, ProductWithPrice } from '@/types';
import { Button } from './Button';
import { useUser } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';
import { postData } from '@/libs/helpers';
import { getStripe } from '@/libs/stripeClient';
import { useSubscribeModal } from '@/hooks/useSubscribeModal';

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

function formatPrice(price: Price) {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal();

  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const { user, isLoading, subscription } = useUser();

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  }

  const handleCheckout = async (price: Price) => {
    if (!user) {
      return toast.error('Must be logged in');
    }

    if (subscription) {
      return toast('Already subscribed');
    }


    try {
      setPriceIdLoading(price.id);

      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPriceIdLoading(undefined);
    }
  }

  let content = (
    <div className="text-center">
      No products available.
    </div>
  )

  if (products.length) {
    content = (
      <div>
        {products.map(product => {
          if (!product.prices?.length) {
            return (
              <div key={product.id}>
                No Prices available
              </div>
            )
          }
          return product.prices.map(price => (
            <div key={price.id}>
              <p className="text-center">
                Stripe Test Card: 4242 4242 4242 4242
              </p>
              <p className="text-center">
                Stripe Test Expiry: 5/55 (anything in the future)
              </p>
              <p className="text-center">
                Stripe Test CVC: 555 (any 3 digit number)
              </p>
              <Button
                onClick={() => handleCheckout(price)}
                disabled={isLoading || price.id === priceIdLoading}
                className="mb-4"
              >
                Subscribe for {formatPrice(price)} a {price.interval}
              </Button>
            </div>
          ))
        })}
      </div>
    )
  }

  if (subscription) {
    content = (
      <div className="text-center">
        Already subscribed
      </div>
    )
  }

  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with Sound Vibe Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  )
}

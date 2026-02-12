import { useEffect, useRef, useState, useCallback } from 'react';
import { loadPaymentWidget, type PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';

// TossPay 결제 위젯 설정
const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
const CUSTOMER_KEY = 'anonymous'; // 비회원 결제 시

export interface PaymentRequest {
  orderId: string;
  orderName: string;
  amount: number;
  customerEmail?: string;
  customerName?: string;
  successUrl: string;
  failUrl: string;
}

export interface UseTossPaymentOptions {
  customerKey?: string;
}

export function useTossPayment(options: UseTossPaymentOptions = {}) {
  const { customerKey = CUSTOMER_KEY } = options;
  const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
  const paymentMethodsRef = useRef<ReturnType<PaymentWidgetInstance['renderPaymentMethods']> | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 위젯 초기화
  useEffect(() => {
    async function initWidget() {
      try {
        const widget = await loadPaymentWidget(CLIENT_KEY, customerKey);
        setPaymentWidget(widget);
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
        console.error('TossPay widget 초기화 실패:', err);
      }
    }

    initWidget();

    return () => {
      setPaymentWidget(null);
      paymentMethodsRef.current = null;
    };
  }, [customerKey]);

  // 결제 수단 위젯 렌더링
  const renderPaymentMethods = useCallback(
    (selector: string, amount: number) => {
      if (!paymentWidget) {
        console.warn('Payment widget not initialized');
        return null;
      }

      const paymentMethods = paymentWidget.renderPaymentMethods(
        selector,
        { value: amount },
        { variantKey: 'DEFAULT' }
      );
      paymentMethodsRef.current = paymentMethods;
      return paymentMethods;
    },
    [paymentWidget]
  );

  // 약관 동의 위젯 렌더링
  const renderAgreement = useCallback(
    (selector: string) => {
      if (!paymentWidget) {
        console.warn('Payment widget not initialized');
        return null;
      }

      return paymentWidget.renderAgreement(selector, {
        variantKey: 'AGREEMENT',
      });
    },
    [paymentWidget]
  );

  // 결제 금액 업데이트
  const updateAmount = useCallback((amount: number) => {
    if (paymentMethodsRef.current) {
      paymentMethodsRef.current.updateAmount(amount);
    }
  }, []);

  // 결제 요청
  const requestPayment = useCallback(
    async (paymentRequest: PaymentRequest) => {
      if (!paymentWidget) {
        throw new Error('Payment widget not initialized');
      }

      try {
        await paymentWidget.requestPayment({
          orderId: paymentRequest.orderId,
          orderName: paymentRequest.orderName,
          successUrl: paymentRequest.successUrl,
          failUrl: paymentRequest.failUrl,
          customerEmail: paymentRequest.customerEmail,
          customerName: paymentRequest.customerName,
        });
      } catch (err) {
        console.error('결제 요청 실패:', err);
        throw err;
      }
    },
    [paymentWidget]
  );

  return {
    isReady,
    error,
    renderPaymentMethods,
    renderAgreement,
    updateAmount,
    requestPayment,
    widget: paymentWidget,
  };
}

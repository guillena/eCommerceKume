import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN ?? '',
});

interface CheckoutItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export async function createPreference(
  items: CheckoutItem[],
  orderId: string,
  buyerEmail: string,
  buyerName: string,
) {
  const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001';

  const preference = new Preference(client);

  const nameParts = buyerName.trim().split(' ');
  const firstName = nameParts[0] ?? buyerName;
  const lastName = nameParts.slice(1).join(' ') || '';

  const response = await preference.create({
    body: {
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'ARS',
      })),
      payer: {
        email: buyerEmail,
        name: firstName,
        surname: lastName,
      },
      back_urls: {
        success: `${siteUrl}/checkout/success`,
        failure: `${siteUrl}/checkout/failure`,
        pending: `${siteUrl}/checkout/pending`,
      },
      auto_return: 'approved',
      external_reference: orderId,
      notification_url: `${apiUrl}/api/webhook`,
    },
  });

  return response;
}

export async function getPayment(paymentId: string) {
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}

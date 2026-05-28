export const TYPE_CHAR_MS = 16
export const TYPE_NEWLINE_MS = 38

/** Completed events kept in the sliding window; older ones drop off the top through the mask. */
export const VISIBLE_EVENT_BUFFER = 3

export const EVENTS = [
  `{
  "event": "order.created",
  "id": "evt_9x2k4mpl",
  "timestamp": "2024-03-15T10:22:07Z",
  "data": {
    "order_id": "ord_8f3k2x9p",
    "status": "confirmed",
    "customer": {
      "id": "cus_4m9xp1r",
      "name": "Steve Jobs",
      "email": "s.jobs@icloud.com"
    },
    "items": [
      {
        "id": "itm_3t7vk2nx",
        "name": "MacBook Pro 14-inch M4 Pro",
        "sku": "MBP14-M4P-16-512-SLV",
        "price": 1999.00,
        "quantity": 1
      },
      {
        "id": "itm_8p1zr5qw",
        "name": "AirPods Pro (USB-C)",
        "sku": "APP2-USBC-WHT",
        "price": 249.00,
        "quantity": 1
      }
    ],
    "shipping": {
      "method": "free",
      "address": {
        "line1": "One Apple Park Way",
        "city": "Cupertino",
        "state": "CA",
        "postcode": "95014",
        "country": "US"
      }
    },
    "totals": {
      "subtotal": 2248.00,
      "shipping": 0.00,
      "tax": 207.94,
      "total": 2455.94,
      "currency": "USD"
    }
  }
}`,
  `{
  "event": "payment.captured",
  "id": "evt_4r7n1qws",
  "timestamp": "2024-03-15T10:22:09Z",
  "data": {
    "payment_id": "pay_3m8xp2kn",
    "order_id": "ord_8f3k2x9p",
    "amount": 2455.94,
    "currency": "USD",
    "method": {
      "type": "apple_pay",
      "brand": "visa",
      "last4": "1776",
      "exp_month": 9,
      "exp_year": 2027
    },
    "billing": {
      "name": "Steve Jobs",
      "address": {
        "line1": "One Apple Park Way",
        "city": "Cupertino",
        "state": "CA",
        "postcode": "95014",
        "country": "US"
      }
    },
    "status": "succeeded",
    "risk_score": 2
  }
}`,
  `{
  "event": "inventory.updated",
  "id": "evt_7m3kp9xv",
  "timestamp": "2024-03-15T10:22:11Z",
  "data": {
    "updates": [
      {
        "sku": "MBP14-M4P-16-512-SLV",
        "product_id": "prod_tv3m8n",
        "warehouse": "wh_cali_01",
        "previous": 48,
        "current": 47,
        "reserved": 3
      },
      {
        "sku": "APP2-USBC-WHT",
        "product_id": "prod_kx9p2r",
        "warehouse": "wh_cali_01",
        "previous": 214,
        "current": 213,
        "reserved": 8
      }
    ],
    "trigger": "order.fulfilled",
    "order_id": "ord_8f3k2x9p"
  }
}`,
  `{
  "event": "shipment.dispatched",
  "id": "evt_2p5v8ztq",
  "timestamp": "2024-03-15T14:05:33Z",
  "data": {
    "shipment_id": "shp_7k1r4ynx",
    "order_id": "ord_8f3k2x9p",
    "carrier": {
      "name": "FedEx",
      "service": "Priority Overnight",
      "tracking_url": "https://www.fedex.com/tracking"
    },
    "tracking_number": "7489129045289",
    "items": [
      { "sku": "MBP14-M4P-16-512-SLV", "quantity": 1 },
      { "sku": "APP2-USBC-WHT", "quantity": 1 }
    ],
    "weight_kg": 1.84,
    "estimated_delivery": "2024-03-16",
    "label_created_at": "2024-03-15T13:58:12Z"
  }
}`,
  `{
  "event": "email.sent",
  "id": "evt_1q6hn7cz",
  "timestamp": "2024-03-15T14:06:01Z",
  "data": {
    "message_id": "msg_5r2wp4lv",
    "order_id": "ord_8f3k2x9p",
    "recipient": "s.jobs@icloud.com",
    "template": "shipment_confirmation",
    "subject": "Your order is on its way",
    "tracking_number": "7489129045289",
    "variables": {
      "customer_name": "Steve",
      "carrier": "FedEx",
      "estimated_delivery": "March 16, 2024"
    },
    "provider": "sendgrid",
    "status": "delivered"
  }
}`,
  `{
  "event": "review.submitted",
  "id": "evt_5n8wq3ym",
  "timestamp": "2024-03-17T09:14:52Z",
  "data": {
    "review_id": "rev_6z4qf8rp",
    "order_id": "ord_8f3k2x9p",
    "product_id": "prod_tv3m8n",
    "customer_id": "cus_4m9xp1r",
    "rating": 5,
    "title": "One more thing — it is perfect",
    "body": "Insanely great. The M4 Pro chip is a work of art.",
    "verified_purchase": true,
    "helpful_votes": 0,
    "moderation_status": "approved"
  }
}`,
]

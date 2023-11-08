import * as functions from "firebase-functions";
import Razorpay from 'razorpay';
import corsModule from 'cors';
import Stripe from 'stripe';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const cors = corsModule(({origin: true}));

export const createOrder = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const data = request.body;
        try {
            const instance = new Razorpay({
                key_id: '',
                key_secret: ''
            });
            const options = {
                amount: data.amount,  // amount in the smallest currency unit
                currency: data.currency,
                // receipt: "order_rcptid_11"
            };
            instance.orders.create(options, (err: any, order: any) => {
                console.log(order);
                response.send(order);
            });
            // response.send("Hello from Firebase!" + data);
        } catch(error) {
            response.status(500).json(error);
        }
    });
});

export const stripePaymentSheet = functions.https.onRequest((request, response) => {
    cors(request, response, async() => {
        const data = request.body;

        console.log('data: ', data);

        const _stripe = new Stripe(
            '',
            {apiVersion: '2022-11-15'}
        );
        
        try {
            const params: Stripe.CustomerCreateParams = {
                email: data.email,
                name: data.name,
                // source: '',
                // address: {
                //     line1: 'ABC',
                //     postal_code: '',
                //     city: '',
                //     state: '',
                //     country: ''
                // }
                // description: 'test customer',
            };
            const customer: Stripe.Customer = await _stripe.customers.create(params);
            console.log(customer.id);
            const ephemeralKey = await _stripe.ephemeralKeys.create(
                {customer: customer.id},
                {apiVersion: '2020-08-27'}
            );
            const paymentIntent = await _stripe.paymentIntents.create({
                amount: data.amount,
                currency: data.currency,
                customer: customer.id,
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            const result = {
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
            };
            response.send(result);
        } catch(e) {
            response.status(500).json(e);
        }
    });
});

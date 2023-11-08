package com.technyks.mazaEats;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.ionicframework.capacitor.Checkout;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(Checkout.class);
        registerPlugin(com.getcapacitor.community.stripe.StripePlugin.class);
        super.onCreate(savedInstanceState);
    }
}

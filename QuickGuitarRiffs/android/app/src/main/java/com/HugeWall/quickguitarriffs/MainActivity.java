package com.HugeWall.QuickGuitarRiffs;

import com.facebook.react.ReactActivity;
import com.google.android.gms.ads.MobileAds;
import android.os.Bundle;
import com.google.firebase.analytics.FirebaseAnalytics;

public class MainActivity extends ReactActivity {

	private FirebaseAnalytics mFirebaseAnalytics;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "QuickGuitarRiffs";
    }
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		// Obtain the FirebaseAnalytics instance.
		mFirebaseAnalytics = FirebaseAnalytics.getInstance(this);
    }
}
package com.HugeWall.QuickGuitarRiffs;

import com.facebook.react.ReactActivity;
import com.google.android.gms.ads.MobileAds;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

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
		MobileAds.initialize(this, "ca-app-pub-8431641625411729~2623241602");
    }
}
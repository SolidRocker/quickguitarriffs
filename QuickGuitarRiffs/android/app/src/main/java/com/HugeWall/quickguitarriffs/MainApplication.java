package com.HugeWall.QuickGuitarRiffs;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.invertase.firebase.database.ReactNativeFirebaseDatabasePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import io.invertase.firebase.admob.ReactNativeFirebaseAdmobPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import com.google.android.gms.ads.MobileAds;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.dooboolab.RNIap.RNIapPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
			new MainReactPackage(),
            new ReactNativeFirebaseDatabasePackage(),
            new RNCWebViewPackage(),
            new ReactNativeFirebaseAdmobPackage(),
            new NetInfoPackage(),
            new RNGestureHandlerPackage(),
			new SafeAreaContextPackage(),
			new ReactNativeFirebaseAppPackage(),
			new RNIapPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
	MobileAds.initialize(this, "ca-app-pub-8431641625411729~2623241602");
  }
}

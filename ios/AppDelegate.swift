import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore
import Lottie

@objc(AppDelegate)
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Firebase 초기화
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }
    
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()
    
    reactNativeDelegate = delegate
    reactNativeFactory = factory
    
    window = UIWindow(frame: UIScreen.main.bounds)
    
    factory.startReactNative(
      withModuleName: "one_year_together",
      in: window,
      launchOptions: launchOptions
    )
    
    // Lottie Splash Screen 설정
    if let rootView = window?.rootViewController?.view {
      rootView.backgroundColor = UIColor.white
      
      let dynamic = Dynamic()
      let animationUIView = dynamic.createAnimationView(rootView: rootView, lottieName: "splash")
      
      // register LottieSplashScreen to RNSplashScreen
      RNSplashScreen.showLottieSplash(animationUIView, inRootView: rootView)
      
      // play
      dynamic.play(animationView: animationUIView)
      
      // If you want the animation layout to be forced to remove when hide is called, use this code
      RNSplashScreen.setAnimationFinished(true)
    }
    
    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }
  
  override func bundleURL() -> URL? {
    #if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}

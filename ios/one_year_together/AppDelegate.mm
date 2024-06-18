#import "AppDelegate.h"
#import <Firebase.h> 
#import <React/RCTBundleURLProvider.h>
#import "RNSplashScreen.h"
#import "one_year_together-Swift.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
   if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  
  self.moduleName = @"one_year_together";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

//  return [super application:application didFinishLaunchingWithOptions:launchOptions];
  
  BOOL success = [super application:application didFinishLaunchingWithOptions:launchOptions];
  
   if (success) {
     //This is where we will put the logic to get access to rootview
     UIView *rootView = self.window.rootViewController.view;
     
     rootView.backgroundColor = [UIColor whiteColor]; // change with your desired backgroundColor
  
     Dynamic *t = [Dynamic new];
     UIView *animationUIView = (UIView *)[t createAnimationViewWithRootView:rootView lottieName:@"splash"]; // change lottieName to your lottie files name
  
     // register LottieSplashScreen to RNSplashScreen
     [RNSplashScreen showLottieSplash:animationUIView inRootView:rootView];
     // casting UIView type to AnimationView type
     AnimationView *animationView = (AnimationView *) animationUIView;
     // play
     [t playWithAnimationView:animationView];
     // If you want the animation layout to be forced to remove when hide is called, use this code
     [RNSplashScreen setAnimationFinished:true];
   }
  
   return success;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
